import React from "react";
import { CheckCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import { message } from "antd";
import { MODIFY_HOSTS_DATA } from "@/redux/constants/HostDataActionType";
import { CONNECT_TYPE } from "@/utils/constant";
import intl from "react-intl-universal";
let Redis = window.require("ioredis");
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
            redis = new Redis({
                host: node.data.host,
                port: node.data.port,
                password: node.data.auth,
            });
        } else if (node.data.connectType === CONNECT_TYPE.SENTINEL) {
            redis = new Redis({
                sentinels: [
                    {
                        host: node.data.host,
                        port: node.data.port,
                    },
                ],
                name: node.data.masterName,
                password: node.data.auth,
                sentinelPassword: node.data.sentinelPassword,
            });
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
                    },
                }
            );
        } else {
            message.error(
                intl.get("RedisService.error.configure.connection.mode")
            );
            return;
        }
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
            RedisService.dispatchError(redis, node, dispatch);
            message.error(intl.get("RedisService.error.occurred") + error);
            if (callback !== undefined) {
                callback({ code: -1, msg: error });
            }
        });
        redis.once("end", function () {
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
}
