/**
 * 主要定义一些和服务器进行数据交互的方法
 */

var udmsg = require('./udmsg');
const dgram = require('dgram');
/**
 * 数据传输的客户端
 */
var client;
/**
 * 标记变量
 * alive 在线 beat 心跳成功
 */
var alive = false, beat = true;
/**
 * 定时器
 */
var timer_d, 
    timer_beat = null, 
    timer_r = new Array();
/**
 * 保存连接服务器的信息
 */
var data_service_ip = "10.70.66.115", data_service_port = "7777", route_service_ip, route_service_port;
/**
 * 回调函数
 */
var f_lgi, 
    f_lgo, 
    f_kab, 
    f_rmb = new Array(), 
    recv_msg;
/**
 * id数据
 */
var self_id = null,  // 自己的id   // 目前只在添加好友时判断是否是自己时用到
    self_flist = [], // 好友的id列表
    cur_id = null;   // 原打算放聊天对象的id 但没用到

/**
 * 登录操作 并为登录成功的用户处理接收于服务器的数据
 */
var login = (uid, password, callback) => {  // 去d验证是否通过然后获取到r的地址
    f_lgi = callback;
    client = dgram.createSocket('udp4');
    timer_d = setTimeout(()=>{
        if(!alive) {
            client.close();
            self_flist = [];
            f_lgi && f_lgi(false);
        }
    }, 2000);

    client.on('message', (msg, rinfo) => {
        var obj = udmsg.getValue(msg);
        var msg_type = obj['type'];
        if(msg_type == 2 && rinfo.port == route_service_port && rinfo.address == route_service_ip) {
            // 来自r的消息
            var desc = obj.headers['desc'];
            if(desc == 'keep-alive') {
                beat = true;
            }
            else if(desc == 'send') {  // 消息发送返回
                var i = obj.headers['mid'];
                clearTimeout(timer_r[i]);
                delete timer_r[i];
                // console.log(timer_r[i], i);  // undefined
                f_rmb[i] && f_rmb[i](obj.headers['back']);
            }else if(desc == 'from') {  // 接到消息
                recv_msg && recv_msg(obj);
            }else if(desc == "out") {  // 注销返回
                clearTimeout(timer_d);
                var back = obj.headers['back'];
                if(back){   // 注销成功
                    client.close();
                    alive = false;
                    self_id = null;
                    select_flist = [];
                    stop_alive();
                }
                f_lgo && f_lgo(back);
            }
        }
        else if(msg_type == 1 && rinfo.port == data_service_port && rinfo.address == data_service_ip) {
            // 来自d的消息
            var query = obj.headers['query'];
            if(query == "flist"){  // 获取好友列表
                var i = obj.headers['mid'];
                clearTimeout(timer_r[i]);
                delete timer_r[i];
                self_flist = obj.body.flist;
                f_rmb[i] && f_rmb[i](true);
            }else if(query == "login") {  // 登录成功
                clearTimeout(timer_d);
                if(obj.headers['back']){
                    alive = true;
                    beat = true;
                    self_id = uid;
                    self_flist = obj.body.flist;
                    route_service_ip = obj.body.ra.ip;
                    route_service_port = obj.body.ra.port;
                    f_lgi && f_lgi(true);
                }else {
                    self_flist = [];
                    alive = false;
                    client.close();
                    f_lgi && f_lgi(false);
                }
            }else if(query == 'addfriend') {  // 添加好友返回
                var i = obj.headers['mid'];
                clearTimeout(timer_r[i]);
                delete timer_r[i];
                f_rmb[i] && f_rmb[i](obj.headers['back']);
            }else if(query == 'delfriend') {
                var i = obj.headers['mid'];
                clearTimeout(timer_r[i]);
                delete timer_r[i];
                f_rmb[i] && f_rmb[i](obj.headers['back']);
            }
        }else {
            console.log(rinfo.address+":"+rinfo.port);
        }
    });
    client.bind();
    var send_msg = (new udmsg(0)).setHeader("uid", uid).setHeader("password", password).setHeader("query", "login").toMsg();
    client.send(send_msg, 0, send_msg.length, data_service_port, data_service_ip, (err) => {
        err && console.error(err);
    });
};
/**
 * 发送主动退出的消息
 * @param {callback} callback 
 */
var logout = (callback) => {  // 告诉r自己退出
    f_lgo = callback;
    if(alive) {
        timer_d = setTimeout(() =>{
            if(alive) { // 超时但未注销成功
                f_lgo && f_lgo(false);
            }
        }, 2000);
        var send_msg = (new udmsg(0)).setHeader('desc', 'out').toMsg();
        client.send(send_msg, 0, send_msg.length, route_service_port, route_service_ip, (err) => {
            err && console.error(err);
        });
    }else {
        f_lgo && f_lgo(false);
    }
};

var mid = () => {  // 查找time_r中第一个空位置
    var i = 0;
    for(;i<timer_r.length;i++){
        if(!timer_r[i]) break;
    }
    return i;
};
/**
 * 将消息发送给uid,消息可以为一个结构
 * @param {string} uid 
 * @param {Object} body 
 * @param {callback} callback 
 */
var sendMsg = (uid, body, callback) => {  // 向r发送消息,转发给uid
    if(alive){
        var i = mid();
        f_rmb[i] = callback;
        timer_r[i] = setTimeout(()=>{
            delete timer_r[i];
            f_rmb[i] && f_rmb[i](false);
        }, 2000); // 消息超时
        var send_msg = (new udmsg(0)).setHeader('desc', 'send').setHeader("to", uid).setHeader("mid", i).write(body).toMsg();
        client.send(send_msg, 0, send_msg.length, route_service_port, route_service_ip, (err) => {
            err && console.error(err);
        });
    }else {
        callback && callback(false);
    }
};
/**
 * 拉取好友列表
 * @param {callback} callback 
 */
var select_flist = (callback) => {  // 向d发送消息,拉取好友列表
    if(alive){
        var i = mid();
        f_rmb[i] = callback;
        timer_r[i] = setTimeout(()=>{
            delete timer_r[i];
            f_rmb[i] && f_rmb[i](false);
        }, 2000);
        var send_msg = (new udmsg(0)).setHeader("query", "flist").setHeader("mid", i).toMsg();
        client.send(send_msg, 0, send_msg.length, data_service_port, data_service_ip, (err) => {
            err && console.error(err);
        });
    }else {
        callback && callback(false);
    }
};
/**
 * 添加好友 为直接确认添加
 * @param {string} uid 
 * @param {callback} callback 
 */
var addfriend = (uid, callback) => {
    if(alive && uid){
        var i = mid();
        f_rmb[i] = callback;
        timer_r[i] = setTimeout(()=>{
            delete timer_r[i];
            f_rmb[i] && f_rmb[i](false);
        }, 2000);
        var send_msg = (new udmsg(0)).setHeader('query', 'addfriend').setHeader('mid', i).setHeader('uid', uid).toMsg();
        client.send(send_msg, 0, send_msg.length, data_service_port, data_service_ip, (err) => {
            err && console.error(err);
        });
    }else {
        callback && callback(false);
    }
}
/**
 * 删除好友 同添加
 * @param {string} uid 
 * @param {callback} callback 
 */
var delfriend = (uid, callback) => {
    if(alive){
        var i = mid();
        f_rmb[i] = callback;
        timer_r[i] = setTimeout(()=>{
            delete timer_r[i];
            f_rmb[i] && f_rmb[i](false);
        }, 2000);
        var send_msg = (new udmsg(0)).setHeader('query', 'delfriend').setHeader('mid', i).setHeader('uid', uid).toMsg();
        client.send(send_msg, 0, send_msg.length, data_service_port, data_service_ip, (err) => {
            err && console.error(err);
        });
    }else {
        callback && callback(false);
    }
}
/**
 * 更名
 * @param {string} uname 
 * @param {*} callback 
 */
var rename = (uname, callback) => {
    if(alive){
        var i = mid();
        f_rmb[i] = callback;
        timer_r[i] = setTimeout(()=>{
            delete timer_r[i];
            f_rmb[i] && f_rmb[i](false);
        }, 2000);
        var send_msg = (new udmsg(0)).setHeader('query', 'rename').setHeader('mid', i).setHeader('uname', uname).toMsg();
        client.send(send_msg, 0, send_msg.length, data_service_port, data_service_ip, (err) => {
            err && console.error(err);
        });
    }else {
        callback && callback(false);
    }
}
/**
 * 注册 将会获得随机的uid
 * @param {string} uname 
 * @param {string} password 
 * @param {callback} callback 
 */
var register = (uname, password, callback) => {  // 向d发送消息,注册
    var i = mid();
    var reg_client = dgram.createSocket('udp4');
    f_rmb[i] = callback;
    timer_r[i] = setTimeout(()=>{
        delete timer_r[i];
        f_rmb[i] && f_rmb[i](false);
        reg_client.close();
    }, 2000);
    reg_client.on('message', (msg, rinfo) => {
        var obj = udmsg.getValue(msg);
        if(obj['type'] == 1 && rinfo.port == data_service_port && rinfo.address == data_service_ip) {
            // 来自d的消息
            if(obj.headers['query'] == "register"){  // 获取注册信息
                reg_client.close();
                var i = obj.headers["mid"];
                clearTimeout(timer_r[i]);
                delete timer_r[i];
                f_rmb[i] && f_rmb[i](obj.headers['back']);  // 把注册结果返回作为回调参数执行回调
            }
        }
    });
    reg_client.bind();
    var send_msg = (new udmsg(0)).setHeader("query", "register").setHeader("mid", i).setHeader("uname", uname).setHeader("password", password).toMsg();
    reg_client.send(send_msg, 0, send_msg.length, data_service_port, data_service_ip, (err) => {
        err && console.error(err);
    });
};
/**
 * 心跳
 * @param {callback} callback 心跳失效时触发回调
 */
var keep_alive = (callback) => {  // beat发出但未接收时执行callback
    f_kab = callback;
    timer_beat != null && clearInterval(timer_beat);
    timer_beat = setInterval(() => {
        if(alive) {
            if(!beat){
                f_kab && f_kab();
            }
            beat = false;
            var send_msg = (new udmsg(0)).setHeader('desc', 'keep-alive').toMsg();
            client.send(send_msg, 0, send_msg.length, route_service_port, route_service_ip, (err) => {
                err && console.error(err);
            });
        }
    }, 2000);
};
var stop_alive = ()=>{
    timer_beat != null && clearInterval(timer_beat);
    timer_beat = null;
    return true;
}
/**
 * 设置接到消息的处理函数
 * @param {callback} callback 
 */
var onrecv = (callback) => {  // 设置接收到消息时的回调
    recv_msg = callback;
};