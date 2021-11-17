import React from "react";
import { CheckCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import { message } from "antd";
import { MODIFY_HOSTS_DATA } from "@/redux/constants/HostDataActionType";
import { CONNECT_TYPE } from "@/utils/constant";
import Log from "@/services/LogService";
import intl from "react-intl-universal";

let Redis = window.require("ioredis");
const net = window.require("net");
const { Client } = window.require("ssh2");
const { readFileSync } = window.require("fs");

/**
 * 连接到redis
 */
export default class RedisService {
    /**
     *连接到redis，返会redis实例
     *
     * @static
     * @param {*} node
     * @returns
     * @memberof RedisService
     */
    static connectRedis(node, dispatch, callback) {
        let redis = undefined;
        if (node.data.connectType === CONNECT_TYPE.DIRECT) {
            if (node.data.proxyuse === true) {
                RedisService.proxyssh(node.data, (redis) => {
                    RedisService.redisEvent(node, dispatch, callback, redis);
                });
            } else {
                let params = {
                    host: node.data.host,
                    port: node.data.port,
                    password: node.data.auth,
                };
                redis = new Redis(params);
                RedisService.redisEvent(node, dispatch, callback, redis);
            }
        } else if (node.data.connectType === CONNECT_TYPE.SENTINEL) {
            let params = {
                sentinels: [
                    {
                        host: node.data.host,
                        port: node.data.port,
                    },
                ],
                name: node.data.masterName,
                password: node.data.auth,
                sentinelPassword: node.data.sentinelPassword,
            };
            if (node.data.proxyuse === true) {
                RedisService.proxyssh({ ...node.data, ...params }, (redis) => {
                    RedisService.redisEvent(node, dispatch, callback, redis);
                });
            } else {
                redis = new Redis(params);
                RedisService.redisEvent(node, dispatch, callback, redis);
            }
        } else if (node.data.connectType === CONNECT_TYPE.CLUSTER) {
            redis = new Redis.Cluster(
                [
                    {
                        host: node.data.host,
                        port: node.data.port,
                    },
                ],
                {
                    redisOptions: {
                        password: node.data.auth,
                        // family: 5
                    },
                }
            );
            RedisService.redisEvent(node, dispatch, callback, redis);
        } else {
            Log.error(
                "[cmd=RedisService] connectRedis error. unknow connection mode."
            );
            message.error(
                intl.get("RedisService.error.configure.connection.mode")
            );
            return;
        }
    }

    /**
     * 注册redis事件
     * @param {*} node
     * @param {*} dispatch
     * @param {*} callback
     * @param {*} redis
     */
    static redisEvent(node, dispatch, callback, redis) {
        redis.once("connect", function () {
            RedisService.dispatchSuccess(node, redis, dispatch);
            message.success(
                intl.get("RedisService.info.connection.established.success")
            );
            if (callback !== undefined) {
                callback({ code: 0, msg: "success" });
            }
        });
        redis.once("error", function (error) {
            Log.error("[cmd=RedisService] connectRedis error.", node, error);
            RedisService.dispatchError(redis, node, dispatch);
            message.error(intl.get("RedisService.error.occurred") + error);
            if (callback !== undefined) {
                callback({ code: -1, msg: error });
            }
        });
        redis.once("end", function () {
            Log.info("[cmd=RedisService] connectRedis end.", node);
            RedisService.dispatchError(redis, node, dispatch);
            if (callback !== undefined) {
                callback({
                    code: -1,
                    msg: intl.get("RedisService.info.connection.close.success"),
                });
            }
        });
    }

    /**
     *连接错误
     *
     * @static
     * @param {*} dispatch
     * @memberof RedisService
     */
    static dispatchError(redis, node, dispatch) {
        redis.disconnect();
        if (dispatch !== undefined) {
            node.icon = <WarningTwoTone />;
            node.redis = null;
            dispatch({
                type: MODIFY_HOSTS_DATA,
                payload: { node: node },
            });
        }
    }
    /**
     *连接成功
     *
     * @static
     * @param {*} dispatch
     * @memberof RedisService
     */
    static dispatchSuccess(node, redis, dispatch) {
        if (dispatch !== undefined) {
            node.icon = <CheckCircleTwoTone />;
            node.redis = redis;
            dispatch({
                type: MODIFY_HOSTS_DATA,
                payload: { node: node },
            });
        }
    }
    /**
     *连接结束
     *
     * @static
     * @param {*} dispatch
     * @memberof RedisService
     */
    static dispatchEnd(node, dispatch) {
        if (dispatch !== undefined) {
            node.icon = <WarningTwoTone />;
            node.redis = null;
            dispatch({
                type: MODIFY_HOSTS_DATA,
                payload: { node: node },
            });
        }
    }

    /**
     * 深复制
     * @param {} data
     * @returns
     */
    static deepClone(data) {
        if (!data || !(data instanceof Object) || typeof data == "function") {
            return data || undefined;
        }
        var constructor = data.constructor;
        var result = new constructor();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result[key] = RedisService.deepClone(data[key]);
            }
        }
        return result;
    }

    /**
     * 作者:修罗大人
     * 时间:2021-04-08 11:11:11
     * 描述:实现SSH代理
     */
    static proxyssh(hostinfo, callback) {
        const connectionConfig = {
            host: hostinfo.proxyhost,
            port: hostinfo.proxysshport || 22,
            username: hostinfo.proxyusername,
            password: hostinfo.proxypassword,
        };

        if (
            hostinfo.proxysshkeypath != null &&
            hostinfo.proxysshkeypath !== ""
        ) {
            try {
                connectionConfig.privateKey = readFileSync(
                    hostinfo.proxysshkeypath
                );
            } catch (e) {
                Log.error(
                    "[cmd=RedisService] connectRedis error. read privateKey file error",
                    hostinfo,
                    e
                );
                message.error(intl.get("proxy.privateKey.not.exist"), e);
                return;
            }
        }

        const conn = new Client();
        conn.on("ready", () => {
            const server = net
                .createServer(function (sock) {
                    conn.forwardOut(
                        sock.remoteAddress,
                        sock.remotePort,
                        hostinfo.host,
                        hostinfo.port,
                        (err, stream) => {
                            if (err) {
                                sock.end();
                            } else {
                                sock.pipe(stream).pipe(sock);
                            }
                        }
                    );
                })
                .listen(0, function () {
                    let redis;
                    if (hostinfo.connectType === CONNECT_TYPE.DIRECT) {
                        //直连
                        redis = new Redis({
                            host: "127.0.0.1",
                            port: server.address().port,
                            password: hostinfo.auth,
                        });
                        if (redis != null) {
                            callback(redis);
                        } else {
                            message.error(
                                intl.get("RedisService.error.occurred")
                            );
                        }
                    } else if (hostinfo.connectType === CONNECT_TYPE.SENTINEL) {
                        //哨兵
                        //先用直连模式连接哨兵,获取master信息
                        // redis = new Redis(hostinfo);
                        // redis = new Redis({ ...hostinfo, host: '127.0.0.1', port: server.address().port, password: hostinfo.sentinelPassword });
                        redis = new Redis({
                            host: "127.0.0.1",
                            port: server.address().port,
                            password: hostinfo.sentinelPassword,
                        });

                        //获取master信息
                        redis.info("Sentinel").then(
                            (res) => {
                                //拆分masters
                                let infos = res.split("\n");

                                let masters = {};
                                infos.forEach((v, i) => {
                                    if (v.startsWith("master")) {
                                        //先用 :name 分隔,去除开头的master序号
                                        let strings = v.split(":name");
                                        let t1 = "name" + strings[1];
                                        let temp = t1.split(",");
                                        let master = {
                                            number: strings[0],
                                        };
                                        temp.forEach((v1, i1) => {
                                            let key = v1.split("=")[0];
                                            let value = v1.split("=")[1];
                                            master[key] = value;

                                            if (key === "name") {
                                                masters[value] = master;
                                            }
                                        });
                                    }
                                });

                                //直接转发到当前master
                                let currentMaster =
                                    masters[hostinfo.masterName];
                                if (currentMaster != null) {
                                    let address =
                                        currentMaster.address.split(":");
                                    let masterHost = address[0];
                                    let masterPort = address[1];
                                    const masterServer = net
                                        .createServer(function (sock) {
                                            conn.forwardOut(
                                                sock.remoteAddress,
                                                sock.remotePort,
                                                masterHost,
                                                masterPort,
                                                (err, stream) => {
                                                    if (err) {
                                                        sock.end();
                                                    } else {
                                                        sock.pipe(stream).pipe(
                                                            sock
                                                        );
                                                    }
                                                }
                                            );
                                        })
                                        .listen(0, function () {
                                            //连接master的实例
                                            let masterRedis = new Redis({
                                                host: "127.0.0.1",
                                                port: masterServer.address()
                                                    .port,
                                            });
                                            if (masterRedis != null) {
                                                callback(masterRedis);
                                            } else {
                                                message.error(
                                                    intl.get(
                                                        "RedisService.error.occurred"
                                                    )
                                                );
                                            }
                                        });
                                } else {
                                    message.error(
                                        intl.get("RedisService.error.occurred")
                                    );
                                }
                            },
                            (err) => {
                                Log.error(
                                    "[cmd=RedisService] connectRedis error. redis-info:err",
                                    hostinfo,
                                    err
                                );
                            }
                        );
                    } else if (hostinfo.connectType === CONNECT_TYPE.CLUSTER) {
                        //集群
                    }
                });
        }).on("error", (err) => {
            Log.error("[cmd=RedisService] connectRedis error.", hostinfo, err);
            message.error(intl.get("proxy.connecterror"));
        });
        conn.connect(connectionConfig);
    }
}
