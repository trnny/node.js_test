var uddata = require('./uddata');
var udmsg = require('./udmsg');
const dgram = require('dgram');

var ud = new uddata();
var uid_list = ud.getalluid(); // 所有的uid(string[])
var uaddress = new Array();
var raddress = new Array();

var uidexist = (uid) => {
    uid = uid+"";
    if(uid_list.indexOf(uid) == -1) return false;
    return true;
}

var getuindex = (uid) => {
    uid = uid+"";
    for(var i=0;i<uaddress.length;i++){
        if(uaddress[i].uid == uid) return i;
    }
    return -1;
};

var getuid = (port, ip) => {
    for(var i=0;i<uaddress.length;i++){
        if(uaddress[i].port == port && uaddress[i].ip == ip) return uaddress[i].uid;
    }
    return false;
}

var getuaddress = (uid) => {
    uid = uid+"";
    for(var i=0;i<uaddress.length;i++){
        if(uaddress[i].uid == uid) return {ip : uaddress[i].ip, port:uaddress[i].port };
    }
    return false;
}

var getrindex = (port, ip) => {
    for(var i=0;i<raddress.length;i++){
        if(raddress[i].port == port && raddress[i].ip == ip) return i;
    }
    return -1;
};

var getar = (i) => {
    i = i === undefined ? 0 : i;
    if(raddress.length>i){
        return {port : raddress[i].port, ip : raddress[i].ip};
    }
    return false;
}

var setuad = (uid, port, ip) => {
    var o = new Object();
    o.uid = uid+"";
    o.port = port;
    o.ip = ip;
    var i = getuindex(uid);
    if(i == -1)
        uaddress.push(o);
    else
        uaddress[i] = o;
};

var drpuad = (uid) => {
    var i = getuindex(uid);
    if(i != -1) {
        uaddress.splice(i, 1);
    }
};

var setrad = (port, ip) => {
    if(getrindex(port, ip) == -1) {
        raddress.push({port : port,ip : ip});
    }
}

var drprad = (port, ip) => {
    var i = getrindex(port, ip);
    if(i != -1) {
        raddress.splice(i, 1);
    }
}

var newuid = (rand, length) => {  // 返回uid(string)
    rand = rand === undefined ? true : rand;
    length = length === undefined ? 5 : length;
    var beg = 1;
    for(var i = 1;i < length;i++){
        beg *= 10;
    }
    var uid = beg;
    var try_count = 0;
    if(rand){
        do{
            uid = Math.floor(Math.random()*beg+beg);
        }while(uidexist(uid) && ++try_count < 50)
        if(try_count == 50) return "0";
    }else {
        while(uidexist(uid) && try_count < 50 && try_count < uid_list.length){
            try_count++;
            beg = uid_list[uid_list.length - try_count]*1;
            uid = beg >= uid ? beg+1 : uid;
        }
        if(try_count == 50) return newuid(true);
    }
    return uid+"";
}

var server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
    var obj = udmsg.getValue(msg);
    var msg_type = obj['type'];
    var query = obj.headers['query'];
    if(msg_type == 0) { // 来自u
        var send_msg = (new udmsg(1)).setHeader('mid', obj.headers['mid']).setHeader('query', query);
        if(query == "register") {
            var rand = uid_list.length % 2 == 0;
            var uid = newuid(rand);
            if(ud.adduser(uid, obj.headers['password'], obj.headers['uname'])) {
                send_msg = send_msg.setHeader('back', uid).toMsg();
                uid_list.push(uid);
                ud.done();  // 即时保存
                // console.log("register success: " + uid);
            }else {
                send_msg = send_msg.setHeader('back', false).toMsg();
                // console.log("register defeat!");
            }
            server.send(send_msg, 0, send_msg.length, rinfo.port, rinfo.address, (err) => {
                err && console.error(err);
            });
        }else if(query == "flist") {
            send_msg = send_msg.write({flist : ud.getfriendlist(getuid(rinfo.port, rinfo.address))}).toMsg();
            server.send(send_msg, 0, send_msg.length, rinfo.port, rinfo.address, (err) => {
                err && console.error(err);
            });
        }else if(query == 'addfriend') {
            send_msg = send_msg.setHeader('back', ud.befriend(getuid(rinfo.port, rinfo.address) , obj.headers['uid'] )).toMsg();
            server.send(send_msg, 0, send_msg.length, rinfo.port, rinfo.address, (err) => {
                err && console.error(err);
            });
        }else if(query == 'delfriend') {
            send_msg = send_msg.setHeader('back', ud.unfriend(getuid(rinfo.port, rinfo.address), obj.headers['uid'])).toMsg();
            server.send(send_msg, 0, send_msg.length, rinfo.port, rinfo.address, (err) => {
                err && console.error(err);
            });
        }else if(query == 'rename') {
            send_msg = send_msg.setHeader('back', ud.rename(getuid(rinfo.port, rinfo.address), obj.headers['uname'])).toMsg();
            server.send(send_msg, 0, send_msg.length, rinfo.port, rinfo.address, (err) => {
                err && console.error(err);
            });
        }else if(query == "login") {
            var uid = obj.headers['uid'];
            var password = obj.headers['password'];
            var pass = ud.pass(uid, password);
            var ra = getar();
            if(pass && ra){
                send_msg = send_msg.setHeader('back', true).write({flist: ud.getfriendlist(uid), ra : ra}).toMsg();
                setuad(uid, rinfo.port, rinfo.address);
                var r_msg = (new udmsg(1)).setHeader('desc', 'ulogin').write({uid : uid, port: rinfo.port, ip: rinfo.address}).toMsg();
                server.send(r_msg, 0, r_msg.length, ra.port, ra.ip, (err) => {
                    err && console.error(err);
                });
            }else{
                send_msg = send_msg.setHeader('back', false).toMsg();
            }
            server.send(send_msg, 0, send_msg.length, rinfo.port, rinfo.address, (err) => {
                err && console.error(err);
            });
        }
    }else if(msg_type == 2) {  // 来自r
        if(query == 'rlink'){
            setrad(rinfo.port, rinfo.address);
            console.log("route server linked: " + rinfo.address);
        }else if(query == 'rulink'){
            drprad(rinfo.port, rinfo.address);
            console.log("route server unlinked");
        }else if(query == 'uout'){
            drpuad(obj.headers['uid']);
        }
        // console.log('未知r消息 '+ rinfo.address+':'+rinfo.port);
    }else {
        console.log(rinfo.address+":"+rinfo.port);
    }
});
server.bind(7777);
console.log('数据服务器启动成功...');