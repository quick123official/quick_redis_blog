import React, { Component } from "react";
import Terminal from "terminal-in-react-quick123";
import RedisCommand from "@/utils/RedisCommand";
import intl from "react-intl-universal";
import { useTheme } from "@/theme/ThemeContext";

/**
 * Terminal 颜色配置
 */
const TERMINAL_THEME = {
    light: {
        color: "#002766",
        backgroundColor: "#fff",
        barColor: "#002766",
        prompt: "#002766",
    },
    dark: {
        color: "#8be9fd",
        backgroundColor: "#1e1e1e",
        barColor: "#8be9fd",
        prompt: "#50fa7b",
    },
};

/**
 * HostTerminal 包装组件 - 处理主题
 */
function HostTerminalWithTheme({ node, title }) {
    const { actualTheme } = useTheme();
    const themeColors = TERMINAL_THEME[actualTheme] || TERMINAL_THEME.light;
    return <HostTerminalInner node={node} title={title} themeColors={themeColors} />;
}

/**
 * 终端（内部类组件）
 */
class HostTerminalInner extends Component {
    state = { redis: undefined };

    componentDidMount() {
        let redis = this.props.node.redis;
        this.setState({ redis: redis });
    }

    render() {
        const { themeColors } = this.props;
        return (
            <div>
                <Terminal
                    color={themeColors.color}
                    backgroundColor={themeColors.backgroundColor}
                    barColor={themeColors.barColor}
                    prompt={themeColors.prompt}
                    promptSymbol=">"
                    style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        fontFamily: "Courier New",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        height: "90vh",
                    }}
                    commands={{
                        append: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        asking: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bgrewriteaof: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bgsave: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bitcount: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bitfield: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bitop: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bitpos: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        blpop: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        brpop: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        brpoplpush: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bzpopmax: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        bzpopmin: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        client: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        cluster: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        command: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        config: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        dbsize: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        debug: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        decr: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        decrby: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        del: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        discard: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        dump: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        echo: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        eval: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        evalsha: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        exec: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        exists: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        expire: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        expireat: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        flushall: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        flushdb: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        geoadd: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        geodist: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        geohash: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        geopos: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        georadius: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        georadius_ro: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        georadiusbymember: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        georadiusbymember_ro: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        get: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        getbit: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        getrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        getset: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hdel: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hexists: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hget: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hgetall: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hincrby: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hincrbyfloat: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hkeys: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hlen: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hmget: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hmset: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hscan: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hset: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hsetnx: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hstrlen: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        hvals: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        incr: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        incrby: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        incrbyfloat: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        info: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        keys: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lastsave: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        latency: "",
                        lindex: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        linsert: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        llen: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lolwut: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lpop: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lpush: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lpushx: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lrem: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        lset: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        ltrim: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        memory: "",
                        mget: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        migrate: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        module: "",
                        monitor: "usage: monitor",
                        move: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        mset: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        msetnx: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        multi: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        object: "",
                        persist: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pexpire: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pexpireat: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pfadd: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pfcount: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pfdebug: "",
                        pfmerge: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pfselftest: "",
                        ping: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        post: "",
                        psetex: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        psubscribe: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        psync: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pttl: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        publish: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pubsub: "",
                        punsubscribe: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        randomkey: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        readonly: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        readwrite: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        rename: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        renamenx: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        replconf: "",
                        replicaof: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        restore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        role: "",
                        rpop: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        rpoplpush: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        rpush: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        rpushx: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sadd: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        save: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        scan: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        scard: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        script: "",
                        sdiff: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sdiffstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sismember: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        slaveof: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        slowlog: "",
                        smembers: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        smove: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sort: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        spop: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        srandmember: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        srem: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sscan: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        strlen: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        subscribe: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        substr: "",
                        sunion: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sunionstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        swapdb: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sync: "",
                        time: "",
                        touch: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        ttl: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        type: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        unlink: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        unsubscribe: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        unwatch: "",
                        wait: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        watch: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xack: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xadd: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xclaim: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xdel: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xgroup: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xinfo: "",
                        xlen: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xpending: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xread: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xreadgroup: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xrevrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        xsetid: "",
                        xtrim: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zadd: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zcard: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zcount: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zincrby: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zinterstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zlexcount: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zpopmax: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zpopmin: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrangebylex: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrangebyscore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrank: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrem: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zremrangebylex: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zremrangebyrank: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zremrangebyscore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrevrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrevrangebylex: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrevrangebyscore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zrevrank: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zscan: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zscore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        zunionstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                    }}
                    commandPassThrough={(cmd) =>
                        `(error) ERR unknown command '${cmd}'`
                    }
                    descriptions={{ show: false }}
                    closedTitle="You closed the window."
                    closedMessage="Click on the icon to reopen."
                    allowTabs={false}
                    hideTopBar={true}
                    startState="maximised"
                    msg={intl.get("HostTerminal.descriptions.msg")}
                />
            </div>
        );
    }
}

export default HostTerminalWithTheme;
