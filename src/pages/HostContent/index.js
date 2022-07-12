import React, { Component } from "react";
import { Tabs, message } from "antd";
import HostKey from "@/pages/HostKey";
import HostKeyTree from "@/pages/HostKeyTree";
import HostKeyString from "@/pages/HostKeyString";
import HostCornerMarker from "@/pages/HostCornerMarker";
import HostKeyList from "@/pages/HostKeyList";
import HostKeySet from "@/pages/HostKeySet";
import HostKeySortSet from "@/pages/HostKeySortSet";
import HostKeyHash from "@/pages/HostKeyHash";
import HostKeyNotExist from "@/pages/HostKeyNotExist";
import { REDIS_DATA_TYPE, HOST_KEY_SHOW_TYPE } from "@/utils/constant";
import LocaleUtils from "@/utils/LocaleUtils";
import BufferUtils from "@/utils/BufferUtils";
import Log from "@/services/LogService";
import SplitPane from "react-split-pane";
const { TabPane } = Tabs;

/**
 * host 整体界面
 * // Tabs -> TabPane -> SplitPane -> HostKeyTree(树型展示key)/HostKey（表格展示key）
 * // Tabs -> TabPane -> SplitPane -> HostKeyString/HostKeySortSet/HostKeySet/HostKeyHash/HostKeyList/HostKeyNotExist
 * // Tabs -> TabPane -> SplitPane -> HostKeyString/HostKeySortSet/HostKeySet/HostKeyHash/HostKeyList/HostKeyNotExist -> HostKeyHeader+content
 * @class HostContent
 * @extends {Component}
 */
class HostContent extends Component {
    state = { dbTabs: [], activeKey: "0", redisKey: { key: "", type: "" } };

    /**
     *分隔符
     *
     * @memberof HostKeyTree
     */
    hostKeyShowType = HOST_KEY_SHOW_TYPE.TREE;
    componentDidMount() {
        this.updateDBCount();
        let splitSign = LocaleUtils.readSystemConfig(false).splitSign;
        if (splitSign === "" || splitSign === undefined || splitSign === null) {
            this.hostKeyShowType = HOST_KEY_SHOW_TYPE.TABLE;
        }
    }
    bindHostKeyRef = (hostKeyRef) => {
        this.hostKeyRef = hostKeyRef;
    };
    /**
     *更新host key
     *
     * @param {*} key
     * @memberof HostContent
     */
    updateHostKey(key) {
        let redis = this.props.node.redis;
        let keyBuffer = BufferUtils.hexToBuffer(key);
        redis.typeBuffer(keyBuffer, (err, keyType) => {
            if (err) {
                message.error("" + err);
                Log.error("[cmd=HostContent] updateHostKey error", key, err);
                return;
            }
            let strKeyType = BufferUtils.bufferToString(keyType)
            if (strKeyType === "none") {
                strKeyType = "";
            }
            this.setState({ redisKey: { key: key, type: strKeyType } });
        });
    }
    /**
     * 新建key
     */
    createKey(key, keyType) {
        this.setState({ redisKey: { key: key, type: keyType } });
    }
    /**
     *更新数据
     *
     * @memberof HostContent
     */
    updateDBCount() {
        let redis = this.props.node.redis;
        // get databases. default 16
        let maxIndex = 16;
        redis
            .config("get", "databases")
            .then((data) => {
                maxIndex = parseInt(data[1]);
            })
            .catch((err) => {
                Log.error("[cmd=config] get databases error", err);
            });
        redis.info("Keyspace", (err, res) => {
            if (err) {
                message.error("", err);
                Log.error("[cmd=info] Keyspace error", err);
                return;
            }
            let dbIndexMap = new Map();
            try {
                let infos = res.split("\n");
                infos.shift();
                infos.pop();
                infos.forEach((v, i) => {
                    //先用 :keys 分隔,得到数据库序号
                    let firstSplitString = v.split(":keys");
                    let dbname = firstSplitString[0];
                    let secondSplitString = firstSplitString[1].split(",");
                    let thirdSplitString = secondSplitString[0].split("=");
                    let dbIndex = i;
                    if (dbname.startsWith("db")) {
                        dbIndex = parseInt(dbname.substring(2));
                    }
                    dbIndexMap.set(dbIndex, {
                        key: "" + dbIndex,
                        dbIndex: dbIndex,
                        title: dbname,
                        total: thirdSplitString[1],
                    });
                });
            } catch (error) {
                Log.error("[cmd=info] Keyspace split error", error);
            }
            let dbTabs = [];
            // get databases 失败，则尝试在 Keyspace 获取最大值
            for (let [, value] of dbIndexMap) {
                if (value.dbIndex > maxIndex) {
                    maxIndex = value.dbIndex;
                }
            }
            for (let i = 0; i < maxIndex; i++) {
                let dbIndexObj = dbIndexMap.get(i);
                if (dbIndexObj === undefined || dbIndexObj === null) {
                    dbIndexObj = {
                        key: "" + i,
                        dbIndex: i,
                        title: "db" + i,
                        total: 0,
                    };
                }
                dbTabs.push(dbIndexObj);
            }
            this.setState({ dbTabs: dbTabs });
        });
        this.setState({ activeKey: "0" });
    }
    /**
     *点击tab，切换db
     *
     * @memberof HostContent
     */
    onTabClick = (activeKey) => {
        this.setState({
            activeKey: activeKey,
            redisKey: { key: "", type: "" },
        });
        let dbIndex = this.state.dbTabs[activeKey].dbIndex;
        let redis = this.props.node.redis;
        redis.select(dbIndex, (err, res) => {
            if (err) {
                message.error("" + err);
                Log.error(
                    "[cmd=HostContent] onTabClick error",
                    activeKey,
                    err,
                    res
                );
                return;
            }
        });
    };
    /**
     *删除key，清空ui
     *
     * @memberof HostContent
     */
    deleteKey() {
        this.setState({ redisKey: { key: "", type: "" } });
        this.hostKeyRef.deleteKeyAndSearch();
    }
    render() {
        let redisKey = this.state.redisKey.key;
        let redisKeyType = this.state.redisKey.type;
        return (
            <div>
                <Tabs
                    onTabClick={this.onTabClick.bind(this)}
                    tabPosition="left"
                    size="small"
                    style={{
                        overflow: "auto",
                        height: "90vh",
                        background: "#fff",
                    }}
                >
                    {this.state.dbTabs.map((tab) => (
                        <TabPane
                            tab={
                                <HostCornerMarker
                                    title={tab.title}
                                    total={tab.total}
                                ></HostCornerMarker>
                            }
                            key={tab.key}
                            style={{ background: "#fff" }}
                        >
                            <div>
                                <SplitPane
                                    split="vertical"
                                    minSize={200}
                                    maxSize={900}
                                    defaultSize={350}
                                    style={{ position: "static" }}
                                >
                                    <div
                                        style={{
                                            overflow: "auto",
                                            height: "90vh",
                                            background: "#fff",
                                            paddingRight: "10px",
                                        }}
                                    >
                                        {this.hostKeyShowType ===
                                            HOST_KEY_SHOW_TYPE.TREE ? (
                                            <HostKeyTree
                                                node={this.props.node}
                                                db={tab.dbIndex}
                                                updateHostKey={this.updateHostKey.bind(
                                                    this
                                                )}
                                                createKey={this.createKey.bind(
                                                    this
                                                )}
                                                triggerRef={this.bindHostKeyRef}
                                            ></HostKeyTree>
                                        ) : (
                                            ""
                                        )}
                                        {this.hostKeyShowType ===
                                            HOST_KEY_SHOW_TYPE.TABLE ? (
                                            <HostKey
                                                node={this.props.node}
                                                db={tab.dbIndex}
                                                updateHostKey={this.updateHostKey.bind(
                                                    this
                                                )}
                                                createKey={this.createKey.bind(
                                                    this
                                                )}
                                                triggerRef={this.bindHostKeyRef}
                                            ></HostKey>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div style={{ paddingLeft: "20px" }}>
                                        {redisKeyType ===
                                            REDIS_DATA_TYPE.STRING ? (
                                            <HostKeyString
                                                redisKey={redisKey}
                                                redisKeyType={redisKeyType}
                                                node={this.props.node}
                                                deleteKey={this.deleteKey.bind(
                                                    this
                                                )}
                                            ></HostKeyString>
                                        ) : (
                                            ""
                                        )}
                                        {redisKeyType ===
                                            REDIS_DATA_TYPE.ZSET ? (
                                            <HostKeySortSet
                                                redisKey={redisKey}
                                                redisKeyType={redisKeyType}
                                                node={this.props.node}
                                                deleteKey={this.deleteKey.bind(
                                                    this
                                                )}
                                            ></HostKeySortSet>
                                        ) : (
                                            ""
                                        )}
                                        {redisKeyType ===
                                            REDIS_DATA_TYPE.SET ? (
                                            <HostKeySet
                                                redisKey={redisKey}
                                                redisKeyType={redisKeyType}
                                                node={this.props.node}
                                                deleteKey={this.deleteKey.bind(
                                                    this
                                                )}
                                            ></HostKeySet>
                                        ) : (
                                            ""
                                        )}
                                        {redisKeyType ===
                                            REDIS_DATA_TYPE.HASH ? (
                                            <HostKeyHash
                                                redisKey={redisKey}
                                                redisKeyType={redisKeyType}
                                                node={this.props.node}
                                                deleteKey={this.deleteKey.bind(
                                                    this
                                                )}
                                            ></HostKeyHash>
                                        ) : (
                                            ""
                                        )}
                                        {redisKeyType ===
                                            REDIS_DATA_TYPE.LIST ? (
                                            <HostKeyList
                                                redisKey={redisKey}
                                                redisKeyType={redisKeyType}
                                                node={this.props.node}
                                                deleteKey={this.deleteKey.bind(
                                                    this
                                                )}
                                            ></HostKeyList>
                                        ) : (
                                            ""
                                        )}
                                        {redisKeyType === "" ? (
                                            <HostKeyNotExist
                                                redisKey={redisKey}
                                            >
                                                {" "}
                                            </HostKeyNotExist>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </SplitPane>
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }
}

export default HostContent;
