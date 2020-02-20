var udmsg = function(type) {
    var _obj = new Object();

    _obj.type = type === undefined ? 0 : type;
    _obj.headers = new Object();
    _obj.headers["content-length"] = 0;
    _obj.headers["content-type"] = "empty";
    _obj.date = new Date().toString();
    _obj.body = null;

    this.setHeader = (key, value) => {
        _obj.headers[key.toLowerCase()] = value;
        return this;
    }
    this.write = (buf, type) => {
        buf = buf === undefined ? null : buf;
        _obj.body = buf;
        if(type === undefined) {
            if(typeof buf === "string") {
                type = "text/plain;charset=UTF-8";
            }else if(buf === null) {
                type = "empty";
            }else if(typeof buf === "object" && Buffer.isBuffer(buf)) {
                type = "buffer/*";
            }else {
                type = "other";
            }
        }
        return this.setHeader("content-length", buf ? buf.length : 0).setHeader("content-type", type);
    }
    this.toMsg = () => {
        return Buffer.from(JSON.stringify(_obj));
    }
    return this;
};

udmsg.ToObj = (buf) => {
    var obj = JSON.parse(buf.toString());
    return obj;
}

udmsg.getValue = (buf, key) => {
    var obj = JSON.parse(buf.toString());
    if(key === undefined) return obj;
    return obj[key];
}

udmsg.getBody = (buf) => {
    var obj = JSON.parse(buf.toString());
    if(!obj.body) return new Buffer(0);
    return new Buffer(obj.body);
}

udmsg.getHeader = (buf, key) => {
    var obj = JSON.parse(buf.toString());
    if(key === undefined || obj.headers[key] === undefined) {
        return null;
    }
    return obj.headers[key];
}

udmsg.isBuffer = (buf) => {
    return buf && typeof buf === "object" && Buffer.isBuffer(buf);
}

module.exports = udmsg;