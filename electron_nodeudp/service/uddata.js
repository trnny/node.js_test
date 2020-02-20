var fs = require('fs');
var crypto = require('crypto');
var xtable = require('./xtable');

var md5 = (text) => {  // 外部不需要引入该函数
    return crypto.createHash('md5').update(text, 'utf8').digest('hex');
}

var uduser = function(uid, password, uname) {
    var o = new Object();
    o.uid = uid+"";
    o.password_md5 = md5(password);
    o.uname = uname || o.uid;
    o.flist = new Array();
    return o;
}

var uddata = function(fname) {
    var _data = new Object();
    _data.ulist = new Array();  // 用户列表

    var datafname = fname === undefined ? "data.json" : fname;  // 默认脚本同文件夹下的data.json文件
    var op_count = 0;
    var op_max = 10;
    var writeable = true;  // 保护文件

    var savedata = () => {   // 外部不需要引入该函数
        if(writeable) {
            writeable = false;
            var data_str = JSON.stringify(_data);
            var writeStream = fs.createWriteStream(datafname, {flags:"w"}); // 重写
            writeStream.write(data_str);
            writeStream.end();
            writeStream.on("finish", () => {
                writeable = true;
            });
        }
    }

    var readdata = () => {   // 外部不需要引入该函数
        if(fs.existsSync(datafname)){
            var data_obj = JSON.parse(fs.readFileSync(datafname).toString());
            if(data_obj.ulist) _data.ulist = data_obj.ulist;
        }else {
            _data.ulist.length > 0 && savedata();
        }
    }

    var getIndexByUid = (uid) => {   // 外部不需要引入该函数
        uid = uid + "";
        for(var i=0;i<_data.ulist.length;i++){
            if(_data.ulist[i].uid == uid) return i;
        }
        return -1;
    }

    var csave = () => {   // 检查是否达到需保存数 保存
        if(++op_count >= op_max){
            savedata();
            op_count =0;
        }
    }

    var isave = () => {   // 定时检查是否有数据更新 保存
        console.log('自动检查: '+op_count+'项数据更改');
        if(op_count > 0){
            savedata();
            op_count =0;
        }
    }

    this.pass = (uid, password) => {
        var i = getIndexByUid(uid);
        if(i != -1){
            return _data.ulist[i].password_md5 == md5(password);
        }
        return false;
    }

    this.cgpass = (uid, password_old, password_new) => {
        var i = getIndexByUid(uid);
        if(i != -1 && _data.ulist[i].password_md5 == md5(password_old)) {
            _data.ulist[i].password_md5 = md5(password_new);
            csave();
            return true;
        }
        return false;
    }

    this.adduser = (uid, password, uname) => {
        password = password + "";
        if(getIndexByUid(uid) == -1 && password.length > 7){
            _data.ulist.push(new uduser(uid, password, uname));
            csave();
            return true;
        }
        return false;
    }

    this.rename = (uid, uname) => {
        uname = uname + "";
        var i = getIndexByUid(uid);
        if(i != -1 && uname.length > 0) {
            _data.ulist[i].uname = uname;
            csave();
            return true;
        }
        return false;
    }

    this.befriend = (uid1, uid2) => {
        uid1 = uid1+"";
        uid2 = uid2+"";
        var i1 = getIndexByUid(uid1);
        var i2 = getIndexByUid(uid2);
        if(i1!=i2&&i1!=-1&&i2!=-1) {
            if(_data.ulist[i1].flist.indexOf(uid2) == -1) _data.ulist[i1].flist.push(uid2);
            if(_data.ulist[i2].flist.indexOf(uid1) == -1) _data.ulist[i2].flist.push(uid1);
            csave();
            return true;
        }
        return false;
    }

    this.unfriend = (uid1, uid2) => {
        uid1 = uid1+"";
        uid2 = uid2+"";
        var i1 = getIndexByUid(uid1);
        var i2 = getIndexByUid(uid2);
        if(i1!=i2&&i1!=-1&&i2!=-1) {
            var fi1 = _data.ulist[i1].flist.indexOf(uid2);
            var fi2 = _data.ulist[i2].flist.indexOf(uid1);
            if(fi1 != -1) _data.ulist[i1].flist.splice(fi1, 1);
            if(fi2 != -1) _data.ulist[i2].flist.splice(fi2, 1);
            csave();
            return true;
        }
        return false;
    }

    this.deluser = (uid) => {
        var i = getIndexByUid(uid);
        if(i != -1) {
            var frids = _data.ulist[i].flist;
            var len = frids.length;
            for(var j = 0;j<len;j++){
                op_count--;  // 不需要执行保存操作
                this.unfriend(uid, frids[0]);
            }
            _data.ulist.splice(i, 1);
            csave();
            return true
        }
        return false;
    }

    this.isfriend = (uid1, uid2) => {
        uid1 = uid1+"";
        uid2 = uid2+"";
        var i = getIndexByUid(uid1);
        if(i!=-1){
            flist = _data.ulist[i].flist;
            if(flist.indexOf(uid2) != -1) return true;
            return false;
        }
    }

    this.getfriendlist = (uid) => {
        var i = getIndexByUid(uid);
        if(i!= -1) {
            return _data.ulist[i].flist;
        }
        return new Array();
    }

    this.getuname = (uid) => {
        var i = getIndexByUid(uid);
        if(i!=-1) {
            return _data.ulist[i].uname;
        }
        return;
    }

    this.getalluid = () => {
        var uids = new Array();
        for(var i =0;i<_data.ulist.length;i++){
            uids.push(_data.ulist[i].uid);
        }
        return uids;
    }

    this.print_ulist = () => {
        var table = new xtable();
        table.setHeading("uid", "password_md5", "uname", "fnum");
        for(var i=0;i<_data.ulist.length;i++){
            table.addRow(_data.ulist[i].uid, _data.ulist[i].password_md5, _data.ulist[i].uname, _data.ulist[i].flist.length);
        }
        console.log(table.toString());
        return this;
    }

    this.done = () => {
        op_count != 0 && savedata();
        op_count = 0;
        return this;
    }

    var isave_timer = null;

    this.close = () => {
        isave_timer != null && clearInterval(isave_timer);
        return this;
    }
    this.start = (m) => {
        m = m || 10;
        this.close();
        isave_timer = setInterval(isave, 1000*60*m);  // 5分钟自动保存一次
        // console.log('自动保存已启动');
        return this;
    }

    readdata();
    this.start(15);
    return this;
}

module.exports = uddata;