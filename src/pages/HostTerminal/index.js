import React, { Component } from "react";
import Terminal from "terminal-in-react";
import RedisCommand from "@/utils/RedisCommand";
import intl from "react-intl-universal";
/**
 * 终端
 */
class HostTerminal extends Component {
    state = { redis: undefined };

    componentDidMount() {
        let redis = this.props.node.redis;
        this.setState({ redis: redis });
    }
    render() {
        return (
            <div>
                <Terminal
                    color="#002766"
                    backgroundColor="#fff"
                    barColor="#002766"
                    prompt="#002766"
                    promptSymbol=">"
                    style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        fontFamily: "Courier New",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        height: "90vh",
                        width: "90vw",
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
                        latency: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        memory: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        mget: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        migrate: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        module: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        monitor: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        object: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        pfdebug: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pfmerge: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        pfselftest: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        ping: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        post: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        pubsub: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        replconf: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        replicaof: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        restore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        role: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        script: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sdiff: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sdiffstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        select: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        set: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        setbit: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        setex: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        setnx: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        setrange: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        shutdown: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sinter: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sinterstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sismember: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        slaveof: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        slowlog: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        substr: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sunion: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sunionstore: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        swapdb: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        sync: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
                        time: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        unwatch: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        xinfo: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                        xsetid: (args, print, runCommand) => {
                            RedisCommand.invoke(this.state.redis, print, args);
                        },
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
                    descriptions={{
                        show: false,
                        append: "usage: append key value",
                        asking: "",
                        bgrewriteaof: "usage: bgrewriteaof ",
                        bgsave: "usage: bgsave [SCHEDULE]",
                        bitcount: "usage: bitcount key [start end]",
                        bitfield:
                            "usage: bitfield key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]",
                        bitop: "usage: bitop operation destkey key [key ...]",
                        bitpos: "usage: bitpos key bit [start] [end]",
                        blpop: "usage: blpop key [key ...] timeout",
                        brpop: "usage: brpop key [key ...] timeout",
                        brpoplpush:
                            "usage: brpoplpush source destination timeout",
                        bzpopmax: "usage: bzpopmax key [key ...] timeout",
                        bzpopmin: "usage: bzpopmin key [key ...] timeout",
                        client: "",
                        cluster: "",
                        command: "usage: command ",
                        config: "",
                        dbsize: "usage: dbsize ",
                        debug: "",
                        decr: "usage: decr key",
                        decrby: "usage: decrby key decrement",
                        del: "usage: del key [key ...]",
                        discard: "usage: discard ",
                        dump: "usage: dump key",
                        echo: "usage: echo message",
                        eval:
                            "usage: eval script numkeys key [key ...] arg [arg ...]",
                        evalsha:
                            "usage: evalsha sha1 numkeys key [key ...] arg [arg ...]",
                        exec: "usage: exec ",
                        exists: "usage: exists key [key ...]",
                        expire: "usage: expire key seconds",
                        expireat: "usage: expireat key timestamp",
                        flushall: "usage: flushall [ASYNC]",
                        flushdb: "usage: flushdb [ASYNC]",
                        geoadd:
                            "usage: geoadd key longitude latitude member [longitude latitude member ...]",
                        geodist:
                            "usage: geodist key member1 member2 [m|km|ft|mi]",
                        geohash: "usage: geohash key member [member ...]",
                        geopos: "usage: geopos key member [member ...]",
                        georadius:
                            "usage: georadius key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]",
                        georadius_ro: "",
                        georadiusbymember:
                            "usage: georadiusbymember key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]",
                        georadiusbymember_ro: "",
                        get: "usage: get key",
                        getbit: "usage: getbit key offset",
                        getrange: "usage: getrange key start end",
                        getset: "usage: getset key value",
                        hdel: "usage: hdel key field [field ...]",
                        hexists: "usage: hexists key field",
                        hget: "usage: hget key field",
                        hgetall: "usage: hgetall key",
                        hincrby: "usage: hincrby key field increment",
                        hincrbyfloat: "usage: hincrbyfloat key field increment",
                        hkeys: "usage: hkeys key",
                        hlen: "usage: hlen key",
                        hmget: "usage: hmget key field [field ...]",
                        hmset: "usage: hmset key field value [field value ...]",
                        hscan:
                            "usage: hscan key cursor [MATCH pattern] [COUNT count]",
                        hset: "usage: hset key field value [field value ...]",
                        hsetnx: "usage: hsetnx key field value",
                        hstrlen: "usage: hstrlen key field",
                        hvals: "usage: hvals key",
                        incr: "usage: incr key",
                        incrby: "usage: incrby key increment",
                        incrbyfloat: "usage: incrbyfloat key increment",
                        info: "usage: info [section]",
                        keys: "usage: keys pattern",
                        lastsave: "usage: lastsave ",
                        latency: "",
                        lindex: "usage: lindex key index",
                        linsert:
                            "usage: linsert key BEFORE|AFTER pivot element",
                        llen: "usage: llen key",
                        lolwut: "usage: lolwut [VERSION version]",
                        lpop: "usage: lpop key",
                        lpush: "usage: lpush key element [element ...]",
                        lpushx: "usage: lpushx key element [element ...]",
                        lrange: "usage: lrange key start stop",
                        lrem: "usage: lrem key count element",
                        lset: "usage: lset key index element",
                        ltrim: "usage: ltrim key start stop",
                        memory: "",
                        mget: "usage: mget key [key ...]",
                        migrate: "usage: migrate host port key",
                        module: "",
                        monitor: "usage: monitor ",
                        move: "usage: move key db",
                        mset: "usage: mset key value [key value ...]",
                        msetnx: "usage: msetnx key value [key value ...]",
                        multi: "usage: multi ",
                        object:
                            "usage: object subcommand [arguments [arguments ...]]",
                        persist: "usage: persist key",
                        pexpire: "usage: pexpire key milliseconds",
                        pexpireat:
                            "usage: pexpireat key milliseconds-timestamp",
                        pfadd: "usage: pfadd key element [element ...]",
                        pfcount: "usage: pfcount key [key ...]",
                        pfdebug: "",
                        pfmerge:
                            "usage: pfmerge destkey sourcekey [sourcekey ...]",
                        pfselftest: "",
                        ping: "usage: ping [message]",
                        post: "",
                        psetex: "usage: psetex key milliseconds value",
                        psubscribe: "usage: psubscribe pattern [pattern ...]",
                        psync: "usage: psync replicationid offset",
                        pttl: "usage: pttl key",
                        publish: "usage: publish channel message",
                        pubsub:
                            "usage: pubsub subcommand [argument [argument ...]]",
                        punsubscribe:
                            "usage: punsubscribe [pattern [pattern ...]]",
                        randomkey: "usage: randomkey ",
                        readonly: "usage: readonly ",
                        readwrite: "usage: readwrite ",
                        rename: "usage: rename key newkey",
                        renamenx: "usage: renamenx key newkey",
                        replconf: "",
                        replicaof: "usage: replicaof host port",
                        restore:
                            "usage: restore key ttl serialized-value [REPLACE] [ABSTTL] [IDLETIME seconds] [FREQ frequency]",
                        role: "usage: role ",
                        rpop: "usage: rpop key",
                        rpoplpush: "usage: rpoplpush source destination",
                        rpush: "usage: rpush key element [element ...]",
                        rpushx: "usage: rpushx key element [element ...]",
                        sadd: "usage: sadd key member [member ...]",
                        save: "usage: save ",
                        scan:
                            "usage: scan cursor [MATCH pattern] [COUNT count] [TYPE type]",
                        scard: "usage: scard key",
                        script: "",
                        sdiff: "usage: sdiff key [key ...]",
                        sdiffstore:
                            "usage: sdiffstore destination key [key ...]",
                        select: "usage: select index",
                        set:
                            "usage: set key value [EX seconds|PX milliseconds] [NX|XX] [KEEPTTL]",
                        setbit: "usage: setbit key offset value",
                        setex: "usage: setex key seconds value",
                        setnx: "usage: setnx key value",
                        setrange: "usage: setrange key offset value",
                        shutdown: "usage: shutdown [NOSAVE|SAVE]",
                        sinter: "usage: sinter key [key ...]",
                        sinterstore:
                            "usage: sinterstore destination key [key ...]",
                        sismember: "usage: sismember key member",
                        slaveof: "usage: slaveof host port",
                        slowlog: "usage: slowlog subcommand [argument]",
                        smembers: "usage: smembers key",
                        smove: "usage: smove source destination member",
                        sort:
                            "usage: sort key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]",
                        spop: "usage: spop key [count]",
                        srandmember: "usage: srandmember key [count]",
                        srem: "usage: srem key member [member ...]",
                        sscan:
                            "usage: sscan key cursor [MATCH pattern] [COUNT count]",
                        strlen: "usage: strlen key",
                        subscribe: "usage: subscribe channel [channel ...]",
                        substr: "",
                        sunion: "usage: sunion key [key ...]",
                        sunionstore:
                            "usage: sunionstore destination key [key ...]",
                        swapdb: "usage: swapdb index1 index2",
                        sync: "usage: sync ",
                        time: "usage: time ",
                        touch: "usage: touch key [key ...]",
                        ttl: "usage: ttl key",
                        type: "usage: type key",
                        unlink: "usage: unlink key [key ...]",
                        unsubscribe:
                            "usage: unsubscribe [channel [channel ...]]",
                        unwatch: "usage: unwatch ",
                        wait: "usage: wait numreplicas timeout",
                        watch: "usage: watch key [key ...]",
                        xack: "usage: xack key group ID [ID ...]",
                        xadd:
                            "usage: xadd key ID field value [field value ...]",
                        xclaim:
                            "usage: xclaim key group consumer min-idle-time ID [ID ...] [IDLE ms] [TIME ms-unix-time] [RETRYCOUNT count] [FORCE] [JUSTID]",
                        xdel: "usage: xdel key ID [ID ...]",
                        xgroup:
                            "usage: xgroup [CREATE key groupname id-or-$] [SETID key groupname id-or-$] [DESTROY key groupname] [DELCONSUMER key groupname consumername]",
                        xinfo:
                            "usage: xinfo [CONSUMERS key groupname] [GROUPS key] [STREAM key] [HELP]",
                        xlen: "usage: xlen key",
                        xpending:
                            "usage: xpending key group [start end count] [consumer]",
                        xrange: "usage: xrange key start end [COUNT count]",
                        xread:
                            "usage: xread [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]",
                        xreadgroup:
                            "usage: xreadgroup GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]",
                        xrevrange:
                            "usage: xrevrange key end start [COUNT count]",
                        xsetid: "",
                        xtrim: "usage: xtrim key MAXLEN [~] count",
                        zadd:
                            "usage: zadd key [NX|XX] [CH] [INCR] score member [score member ...]",
                        zcard: "usage: zcard key",
                        zcount: "usage: zcount key min max",
                        zincrby: "usage: zincrby key increment member",
                        zinterstore:
                            "usage: zinterstore destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]",
                        zlexcount: "usage: zlexcount key min max",
                        zpopmax: "usage: zpopmax key [count]",
                        zpopmin: "usage: zpopmin key [count]",
                        zrange: "usage: zrange key start stop [WITHSCORES]",
                        zrangebylex:
                            "usage: zrangebylex key min max [LIMIT offset count]",
                        zrangebyscore:
                            "usage: zrangebyscore key min max [WITHSCORES] [LIMIT offset count]",
                        zrank: "usage: zrank key member",
                        zrem: "usage: zrem key member [member ...]",
                        zremrangebylex: "usage: zremrangebylex key min max",
                        zremrangebyrank:
                            "usage: zremrangebyrank key start stop",
                        zremrangebyscore: "usage: zremrangebyscore key min max",
                        zrevrange:
                            "usage: zrevrange key start stop [WITHSCORES]",
                        zrevrangebylex:
                            "usage: zrevrangebylex key max min [LIMIT offset count]",
                        zrevrangebyscore:
                            "usage: zrevrangebyscore key max min [WITHSCORES] [LIMIT offset count]",
                        zrevrank: "usage: zrevrank key member",
                        zscan:
                            "usage: zscan key cursor [MATCH pattern] [COUNT count]",
                        zscore: "usage: zscore key member",
                        zunionstore:
                            "usage: zunionstore destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]",
                    }}
                    closedTitle="You closed the window."
                    closedMessage="Click on the icon to reopen."
                    allowTabs={false}
                    hideTopBar={true}
                    startState="maximised"
                    msg= {intl.get("HostTerminal.descriptions.msg")}
                />
            </div>
        );
    }
}

export default HostTerminal;
