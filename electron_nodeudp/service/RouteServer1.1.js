/////////////  新版

var udmsg = require('./udmsg');
var dgram = require('dgram');

var d_service_ip = "10.70.66.115", d_service_port = "7777";
var uaddress = new Array();

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

var server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
    var obj = udmsg.getValue(msg);
    var msg_type = obj['type'];
    var desc = obj.headers['desc'];
    if(msg_type == 0) {  // 来自u
        if(desc == 'keep-alive'){
            if(getuid(rinfo.port, rinfo.address)){
                var u_msg = (new udmsg(2)).setHeader('desc', 'keep-alive').toMsg();
                server.send(u_msg, 0, u_msg.length, rinfo.port, rinfo.address, (err)=>{
                    err && console.error(err);
                });
            }
        }else if(desc == 'send') {
            var to = obj.headers['to'];
            var uad = getuaddress(to);
            var u_msg = (new udmsg(2)).setHeader('desc', 'send').setHeader('mid', obj.headers['mid']);
            if(uad){
                u_msg = u_msg.setHeader('back', true).toMsg();
                var _msg = (new udmsg(2)).setHeader('desc', 'from').setHeader('from', getuid(rinfo.port, rinfo.address)).write(obj.body).toMsg();
                server.send(_msg, 0, _msg.length, uad.port, uad.ip, (err)=>{
                    err && console.error(err);
                });
            }else{
                // console.log('no such uid');
                u_msg = u_msg.setHeader('back', false).toMsg();
            }
            server.send(u_msg, 0, u_msg.length, rinfo.port, rinfo.address, (err)=>{
                err && console.error(err);
            });
        }else if(desc == 'out') {
            var uid = getuid(rinfo.port, rinfo.address);
            drpuad(uid);
            console.log("logout: " + uid);
            var r_msg = (new udmsg(2)).setHeader('query', 'uout').setHeader('uid', uid).toMsg();
            server.send(r_msg, 0, r_msg.length, d_service_port, d_service_ip, (err)=>{
                err && console.error(err);
            });
            var u_msg = (new udmsg(2)).setHeader('desc', 'out').setHeader('back', true).toMsg();
            server.send(u_msg, 0, u_msg.length, rinfo.port, rinfo.address, (err)=>{
                err && console.error(err);
            });
        }
    }else if(msg_type == 1 && rinfo.port == d_service_port && rinfo.address == d_service_ip) { //来自d
        if(desc == 'ulogin'){
            var uad = obj.body;
            setuad(uad.uid, uad.port, uad.ip);
            console.log("login: " + uad.uid + ' ip: ' + uad.ip);
        }
    }else {
        console.log(rinfo.address+":"+rinfo.port);
    }
});
server.on('listening', ()=>{
    var r_msg = (new udmsg(2)).setHeader('query', 'rlink').toMsg();
    server.send(r_msg, 0, r_msg.length, d_service_port, d_service_ip, (err)=>{
        err && console.error(err);
    });
});
server.on('close', ()=> {
    var r_msg = (new udmsg(2)).setHeader('query', 'rulink').toMsg();
    server.send(r_msg, 0, r_msg.length, d_service_port, d_service_ip, (err)=>{
        err && console.error(err);
    });
})
server.bind();