import React, { Component } from "react";
import { Tabs, message } from "antd";
import HostKey from "@/pages/HostKey";
import HostKeyString from "@/pages/HostKeyString";
import HostKeyList from "@/pages/HostKeyList";
import HostKeySet from "@/pages/HostKeySet";
import HostKeySortSet from "@/pages/HostKeySortSet";
import HostKeyHash from "@/pages/HostKeyHash";
import HostKeyNotExist from "@/pages/HostKeyNotExist";
import { REDIS_DATA_TYPE } from "@/utils/constant";
import Log from "@/services/LogService";
import SplitPane from "react-split-pane";
const { TabPane } = Tabs;

/**
 *host 管理
 *
 * @class HostContent
 * @extends {Component}
 */
class HostContent extends Component {
    state = { dbTabs: [], activeKey: "0", redisKey: { key: "", type: "" } };

    componentDidMount() {
        this.updateDBCount();
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
        redis.type(key, (err, keyType) => {
            if (err) {
                message.error("" + err);
                Log.error("HostContent updateHostKey error", err);
                return;
            }
            if (keyType === "none") {
                keyType = "";
            }
            this.setState({ redisKey: { key: key, type: keyType } });
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
        redis.config("get", "databases", (err, res) => {
            if (res == null) {
                message.error(
                    "can not get db size. It may fail to connect to the redis server. Please ensure that you can connect to the redis server using redis-cli"
                );
                return;
            }
            if (!err && res[1]) {
                let databasesSize = Number(res[1]);
                let dbTabs = [];
                for (let i = 0; i < databasesSize; i++) {
                    dbTabs.push({
                        key: "" + i,
                        title: "db" + i,
                    });
                }
                this.setState({ dbTabs: dbTabs });
            } else {
                if (err) {
                    message.error("" + err);
                    Log.error("HostContent updateDBCount error", err);
                    return;
                }
            }
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
        let redis = this.props.node.redis;
        redis.select(activeKey, (err, res) => {
            if (err) {
                message.error("" + err);
                Log.error("HostContent onTabClick error", err, res);
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
                            tab={tab.title}
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
                                        <HostKey
                                            node={this.props.node}
                                            db={tab.key}
                                            updateHostKey={this.updateHostKey.bind(
                                                this
                                            )}
                                            createKey={this.createKey.bind(
                                                this
                                            )}
                                            triggerRef={this.bindHostKeyRef}
                                        ></HostKey>
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
