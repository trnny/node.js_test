/**
 * 控制显示页面
 * @param {*} o 
 * @param {page} prev 
 * @param {*} fa
 */
var page = function (o, prev, fa) {
    var prev = prev;
    var father = fa || document.body;
    this.loaded = false;
    this.o = o;
    this.set = (o) => {
        this.o = o;
        return this;
    }
    this.back = () => {
        this.remove();
        prev && prev.load();
        return prev;
    }
    this.remove = () => {
        if(this.o && father && this.loaded){
            father.removeChild(this.o);
            this.loaded = false;
        }
    }
    this.load = () => {
        if(this.o && father) {
            prev && prev.remove();
            father.appendChild(this.o);
            this.loaded = true;
        }
        return this;
    }
    return this;
}
/**
 * 3个页面的元素
 */
var entry_div = document.createElement('div'),
    main_div = document.createElement('div'), 
    register_div = document.createElement('div');
/**
 * 切换登录和注册页面的按钮
 */
var register_btn = document.createElement('span'), 
    entry_btn = document.createElement('span');
/**
 * 登录页面输入框 按钮等
 */
var e_id_ipt = document.createElement('input'), 
    e_password_ipt = document.createElement('input'), 
    e_remember_ckb = document.createElement('input'), 
    e_submit_btn = document.createElement('input');
/**
 * 注册页面输入框 按钮等
 */
var r_uname_ipt = document.createElement('input'),
    r_password_ipt = document.createElement('input'),
    r_password_ipt2 = document.createElement('input'),
    r_submit_btn = document.createElement('input');
/**
 * 消息页 好友列表 消息显示 消息编辑 消息发送
 */
var m_div_flist = document.createElement('div'),
    m_div_msgbox = document.createElement('div'),
    m_div_msgedit = document.createElement('div'),
    m_div_msgsend = document.createElement('div');
/**
 * 3个页面
 */
var entry_page, 
    main_page, 
    register_page;
/**
 * 其他共用数据
 */
var flist_element = new Array(), // 可能没用用到，保存好友列表的document元素
    win_h = document.body.clientHeight, // 页面高
    msblk; // 浮动设置或其他杂项功能
/**
 * 浮动设置中的一些对象
 */
var ms_lgout,  // 登出
    ms_addf,   // 加联系人
    ms_frfl,   // 刷新列表
    ms_rena,   // 更名
    ms_delf,   // 删联系人
    ms_clmsg,  // 清空聊天
    ms_chead;  // 换头像
/**
 * 数据初始化 加载各页面等
 */
var init = () => {
    entry_div.id = "entry_div";
    main_div.id = "main_div";
    register_div.id = "register_div";
    /**
     * 页面数据
     */
    var adj_l = 140, 
        adj_b = 200;

    var e_center_div = document.createElement('div'), 
        e_title = document.createElement('h3'), 
        e_remember_lab = document.createElement('span');

    entry_div.appendChild(e_center_div);
    e_center_div.appendChild(e_title);
    e_center_div.appendChild(e_id_ipt);
    e_center_div.appendChild(e_password_ipt);
    e_center_div.appendChild(e_remember_ckb);
    e_center_div.appendChild(e_remember_lab);
    e_center_div.appendChild(e_submit_btn);
    e_center_div.id = 'e_center_div';
    e_title.innerText = "登录";
    register_btn.innerText = '/注册';
    e_title.appendChild(register_btn);
    e_id_ipt.placeholder = 'ID';
    e_id_ipt.className = "ipt";
    e_password_ipt.placeholder = '密码';
    e_password_ipt.className = "ipt";
    e_password_ipt.type = 'password';
    e_remember_ckb.type = 'checkbox';
    e_remember_ckb.value = '记住密码';
    e_remember_lab.innerText = '记住密码';
    e_submit_btn.className = "btn";
    e_submit_btn.value = '登录';
    e_submit_btn.type = 'button';


    var r_center_div = document.createElement('div'), 
        r_title = document.createElement('h3');

    register_div.appendChild(r_center_div);
    r_center_div.appendChild(r_title);
    r_center_div.appendChild(r_uname_ipt);
    r_center_div.appendChild(r_password_ipt);
    r_center_div.appendChild(r_password_ipt2);
    r_center_div.appendChild(r_submit_btn);
    r_center_div.id = 'r_center_div';
    r_title.innerText = '注册';
    entry_btn.innerText = '/登录';
    r_title.appendChild(entry_btn);
    r_uname_ipt.placeholder = '昵称';
    r_uname_ipt.className = 'ipt';
    r_password_ipt.placeholder = '密码';
    r_password_ipt.className = 'ipt';
    r_password_ipt.type = 'password';
    r_password_ipt2.placeholder = '确认密码';
    r_password_ipt2.className = 'ipt';
    r_password_ipt2.type = 'password';
    r_submit_btn.className = "btn";
    r_submit_btn.value = '注册';
    r_submit_btn.type = 'button';


    var m_adjust_width = document.createElement('div'),
        m_adjust_height = document.createElement('div');

    main_div.appendChild(m_div_flist);     // 对象列表
    main_div.appendChild(m_adjust_width);
    main_div.appendChild(m_div_msgbox);    // 消息显示
    main_div.appendChild(m_adjust_height); //
    main_div.appendChild(m_div_msgedit);   // 消息编辑
    main_div.appendChild(m_div_msgsend);   // 消息发送
    m_div_flist.id = 'm_div_flist';
    m_adjust_width.id = 'm_adjust_width';
    m_div_msgbox.id = 'm_div_msgbox';
    m_div_msgedit.id = 'm_div_msgedit';
    m_adjust_height.id = 'm_adjust_height';
    m_div_msgsend.id = 'm_div_msgsend';
    m_div_msgsend.innerText = '发送';

    window.onresize = () => {
        win_h = document.body.clientHeight;
    }
    var ms_last_x, ms_last_y, move_cbk_x = (e) =>{
        e.preventDefault();
        e.stopPropagation();
        adj_l += e.x - ms_last_x;
        ms_last_x = e.x;
        if(adj_l > 69 && adj_l < 201) {
            var px = adj_l + 'px';
            m_adjust_width.style['left'] = px;
            m_div_flist.style['width'] = px;
            m_div_msgbox.style['left'] = px;
            m_div_msgedit.style['left'] = px;
            m_adjust_height.style['left'] = px;
        }
    }, move_cbk_y = (e) => { // 用function和 ()=> 都行
        e.preventDefault();
        e.stopPropagation();
        adj_b += ms_last_y - e.y;
        ms_last_y = e.y;
        if(adj_b > 99 && win_h - adj_b > 69){
            var px = adj_b + 'px';
            m_adjust_height.style['bottom'] = px;
            m_div_msgbox.style['bottom'] = px;
            m_div_msgedit.style['height'] = px;
            // 添加对v滚动的判断
            if(vfblk.lastActive){
                vfblk.lastActive.v.maxScroll = m_div_msgbox.scrollHeight - m_div_msgbox.clientHeight;  // 被卷去的部分高度
                if(vfblk.lastActive.v.maxScroll == 0){
                    vfblk.lastActive.v.scroll = true;    // 消息框变大时能够显示全部消息咋开启滚动
                }
            }
        }
    };
    m_adjust_height.onmousedown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        ms_last_y = e.y;
        window.addEventListener('mousemove', move_cbk_y);
        var rem = function(e) {
            window.removeEventListener('mousemove', move_cbk_y);
            window.removeEventListener('mouseup', rem);
        }
        window.addEventListener('mouseup', rem);
    }
    m_adjust_width.onmousedown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        ms_last_x = e.x;
        window.addEventListener('mousemove', move_cbk_x);
        var rem = function(e) {
            window.removeEventListener('mousemove', move_cbk_x);
            window.removeEventListener('mouseup', rem);
        }
        window.addEventListener('mouseup', rem);
    }
};
init();
/**
 * 好友列表中的好友标签 及信息
 * @param {*} uid 
 */
var vfblk = function(uid, f){
    this.uid = uid;
    this.ele = null;
    this.f = f || document.body;
    this.v = null;
    this.e = null;
    this.init();
}
vfblk.mList = [];   // 接受消息的好友
vfblk.sList = [];   // 在显示的好友
vfblk.lastActive = null;
vfblk.lempty = true;
vfblk.cl = function(){  // 取消正激活的标签的激活状态
    vfblk.lastActive && vfblk.lastActive.cold();
}
vfblk.remove = function(e){  // 移除标签  移除后将不能显示对话
    for(var i=0;i<vfblk.mList.length;i++){
        if(vfblk.mList[i]==e){
            e.remove();
            delete vfblk.mList[i];
            if(vfblk.lastActive == e){  // 激活下一个
                vfblk.lastActive = null;
                var j = i + 1;
                for(;j<vfblk.mList.length;j++){
                    if(vfblk.mList[j]){
                        vfblk.mList.active();
                        return;
                    }
                }
                j-=2;
                for(;j>=0;j--){
                    if(vfblk.mList[j]){
                        vfblk.mList.active();
                        return;
                    }
                }
                view_fept(m_div_flist);
            }
        }
    }
}
vfblk.add = function(e){    // 往mList里塞入
    var i = 0;
    for(;i<vfblk.mList.length;i++){
        if(!vfblk.mList[i])
            break;
    }
    vfblk.mList[i] =  e;
}
vfblk.hide = function(e){       //  隐藏 能接收消息 从dom中移除,但不从消息列里移除(考虑使用style隐藏)
    for(var i = 0;i<vfblk.mList.length;i++){
        if(vfblk.mList[i]==e){
            e.remove();
            if(vfblk.lastActive == e){
                vfblk.lastActive = null;
                var j = i +1;
                for(;j<vfblk.mList.length;j++){
                    if(vfblk.mList[j] && vfblk.mList[j].isShow){
                        vfblk.mList.active();
                        return;
                    }
                }
                j-=2;
                for(;j>=0;j--){
                    if(vfblk.mList[j] && vfblk.mList[j].isShow){
                        vfblk.mList.active();
                        return;
                    }
                }
                view_fept(m_div_flist);
            }
        }
    }
}
vfblk.show = function(e){
    e.f.appendChild(e.ele);
    e.isShow = true;
}
vfblk.showAll = function(){
    for(var i =0;i<vfblk.mList.length;i++){
        if(vfblk.mList[i] && !vfblk.mList[i].isShow){
            vfblk.show(vfblk.mList[i]);
        }
    }
}
vfblk.onsend = function(){
    if(vfblk.lastActive != null){
        vfblk.lastActive.send();
    }
}
/**
 * 分发消息 uid 来自 msg 消息
 * @param {string} uid 消息的来自方
 * @param {object} msg 消息的结构 {body:消息字符串,date:消息时间(字符串)}
 * 执行的是vfblk的recv 参数同 msg结构
 */
vfblk.onrecv = function(uid, msg){
    for(var i=0;i<vfblk.mList.length;i++){
        if(vfblk.mList[i] && vfblk.mList[i].uid == uid){
            vfblk.mList[i].recv(msg);
            break;
        }
    }
}

onrecv((obj)=>{
    switch (obj.body.type){
    case 'msg':  //   {type: , msg: }
        vfblk.onrecv(obj.headers.from, {body:obj.body.msg, date:obj.date});
        break;
    case 'addfriend':
        procss_friend_require(obj);
        break;
    }
});

var nucvad = {   // 本地验证 (暂未完成)
    uid: (uid)=>{
        return true;
    },
    password: (password)=>{
        return true;
    },
    uname: (uname)=>{
        return true;
    },
    isFriend: (uid)=>{  // 是否是好友
        for(var i=0;i<self_flist.length;i++){
            if(uid==self_flist[i]) return true;
        }
        return false;
    }
}

var procss_friend_require=(obj)=>{
    if(!obj.body.back){  // 是接收申请
        TU.confirm(obj.headers.from+'请求添加好友',{
            moveable: true,
            onconfirm: ()=>{
                sendMsg(obj.headers.from,{type: 'addfriend', back: true, pass: true},(back)=>{
                    if(back){   // 你同意别人的申请发送成功
                        TU.alert('已通过好友申请',{
                            center: true,
                            timeOut: 3000
                        });
                        if(self_flist.push(obj.headers.from) ==1) view_flist(self_flist);
                        else {
                            if(vfblk.lempty){
                                m_div_flist.innerHTML = '';
                            }
                            view_flist_single(obj.headers.from);
                        }
                    }else{
                        TU.alert('发送失败!\n可能是网络不稳定',{
                            topCenter: true,
                            shadow: true
                        });
                    }
                });
            },
            onclose: ()=>{
                sendMsg(obj.headers.from,{type: 'addfriend', back: true, pass: false},(back)=>{
                    if(back){
                        TU.alert('已拒绝好友申请',{
                            center: true,
                            timeOut: 3000
                        });
                    }else{
                        TU.alert('发送失败!\n可能是网络不稳定',{
                            topCenter: true,
                            shadow: true
                        });
                    }
                })
            }
        });
    }else{  // 是申请返回
        if(obj.body.pass){  // 别人通过了你的申请
            addfriend(obj.headers.from, (back)=>{
                if(!back) return TU.alert('未知错误!');
                TU.alert(obj.headers.from+'通过了你的好友申请',{
                    topCenter: true,
                    timeOut: 3000
                });
                if(self_flist.push(obj.headers.from) == 1) view_flist(self_flist) // 之前没有好友
                else {  // 之前有好友
                    if(vfblk.lempty){   // 之前显示列表空
                        m_div_flist.innerHTML = '';
                    }
                    view_flist_single(obj.headers.from);
                }
            });
        }else{   // 别人拒绝了你的申请  
            TU.alert(obj.headers.from+'拒绝了你的好友申请',{
                topCenter: true,
                shadow: true
            });
        }
    }
}

var getHeadSrc = (uid, size)=>{  // 获取头像的src(本地) 参数空时返回默认头像
    if(!uid) return "src/img/head/head_default.png";
    size = size || 48;
    return "src/img/head/head_"+size+"_"+uid+".png";
}

var _getHeadSrc = (uid, size)=>{    // 获取头像src(在线) 并保存到本地
    size = size || 48;
    return  "http://" + data_service_ip + "/nuc/head?uid=" + uid +"&size=" + size;
}

vfblk.prototype = {
    isActive: false,    // 是否是激活(当前聊天)
    isShow: false,             // 是否可见
    mleftcount: 0,      // 未读消息数
    mleftblk: null,     // 显示未读消息数
    statu: 0,           // 好友状态 0 初始化 1 在线 2 隐身等
    init: function(){
        this.ele = document.createElement('div');
        this.ele.className = 'm_fblk';
        var e_head = document.createElement('img'),     // 头像 
            e_name = document.createElement('p'),       // 名
            e_lmsg = document.createElement('p'),       // 消息缩略
            e_ctrl = document.createElement('div'),     // 控制区 消息数 关闭等
            e_ctrl_cls = document.createElement('p');   // 关闭

        this.mleftblk = document.createElement('p');   // 未读消息数
        this.mleftblk.className = 'm_fblk_msc';
        var _local_head = true, _down_head = true;
        e_head.onerror = (e)=> {
            _down_head = false;
            if(_local_head){ // 服务器不存在
                e_head.src = getHeadSrc(this.uid, 48);  // 从本地获取
                _local_head = false;  // 本地已尝试
            }else{  // 本地也不存在
                e_head.src = getHeadSrc();  // 使用本地的默认头像
                e_head.onerror = null;
            }
            return false;
        };
        e_head.onload = (e)=>{
            if(_down_head){
                get_Down(_getHeadSrc(this.uid, 48), getHeadSrc(this.uid, 48));
            }
        }
        e_head.src = _getHeadSrc(this.uid, 48);     // 优先获取服务器
        e_name.innerText = this.uid === undefined ? '' : this.uid;
        e_ctrl_cls.innerText = '✕';
        e_ctrl_cls.onclick = (e)=>{
            e.stopPropagation();  // 阻止冒泡
            this.cold();
            vfblk.remove(this);
        }
        
        this.ele.appendChild(e_head);
        this.ele.appendChild(e_name);
        this.ele.appendChild(e_lmsg)
        this.ele.appendChild(e_ctrl);
        e_ctrl.appendChild(e_ctrl_cls);
        e_ctrl.appendChild(this.mleftblk);

        this.ele.onclick = () =>{
            cur_id = this.uid;  // 没有用到该变量
            if(!this.isActive){
                vfblk.cl();
                this.active();
            }
        }
        this.ele.onmouseover = ()=>{
            this.ele.style.backgroundColor = '#ebebec';
            this.mleftblk.style.display = 'none';
            e_ctrl_cls.style.display = 'block';
        }
        this.ele.onmouseout = ()=>{
            if(!this.isActive){
                this.ele.style.backgroundColor = '#fafafa';
                if(this.mleftcount > 0)
                    this.mleftblk.style.display = 'block';
            }
            e_ctrl_cls.style.display = 'none';
        }
        this.f.appendChild(this.ele);
        this.isShow = true;
        vfblk.add(this);
    },
    remove: function(){
        this.cold();
        this.f.removeChild(this.ele);
        this.isShow = false;
        ms_frfl.changeStatu(2);
        return this;
    },
    changeStatu: function(s){
        if(this.statu != s){
            this.statu = s;
            this.onStatuChange();
        }
    },
    onStatuChange: function(){
        // 状态
    },
    active: function(){  // 激活 换背景色、加载
        this.isActive = true;
        this.ele.style.backgroundColor = '#ebebec';
        this.load();
        this.mleftcount = 0;
        ms_clmsg.changeStatu(2);
        return this;
    },
    cold: function(){
        if(this.isActive){
            this.isActive = false;
            this.ele.style.backgroundColor = '#fafafa';
        }
        return this;
    },
    load: function(v,e){    // 设置和加载消息框和编辑框 (参数空时加载,有参数则设置)
        if(v) this.v = v;
        if(e) this.e = e;
        if(!v && !e && this.v && this.e){
            vfblk.lastActive = this;
            this.v.load();
            this.e.load();
        }
        return this;
    },
    /**
     * 
     * @param {object} msg {body: , date: }
     */
    recv: function(msg){    // 接收到消息
        if(!this.isActive){         // 非激活状态显示消息数
            this.mleftblk.innerText = ++this.mleftcount > 99 ? '99+' : this.mleftcount;
            this.mleftblk.style.display = 'block';
            ms_clmsg.changeStatu(2);
        }
        if(!this.isShow){
            this.f.appendChild(this.ele);
            this.isShow = true;
        }
        this.v.recv(this.uid, msg);
    },
    send: function(){       // 发出消息
        var msg_str = this.e.e.innerHTML;
        if(msg_str.length > 0){
            var msg = new smsg(msg_str);
            this.e.send(this.uid, msg);
            this.v.send(msg);
        }
    }
}

var view_fept = (f) => { // 好友空时加载空界面
    vfblk.lempty = true;
    f = f || document.body;
    ms_clmsg.changeStatu(1);  // 空界面禁用清除消息
    ms_frfl.changeStatu(2);   // 启用刷新好友列表
    var ele = document.createElement('div');
    var h3 = document.createElement('h3');
    ele.appendChild(h3);
    h3.innerText = '暂时无会话';
    h3.className = 'empty_flist';
    f.appendChild(ele);
}

var view_flist = (flist) => { // 加载好友列表 其他初始化操作 相当于重新加载了
    m_div_flist.innerHTML = '';
    m_div_msgsend.onclick = ()=>{
        vfblk.onsend();
    };
    vfblk.mList = [];  // 把接收消息列表清空
    if(flist.length == 0){
        view_fept(m_div_flist);
    }else {
        // nuc_cache.search.byUids(self_flist);  // 打算放到v的初始化里
        ms_clmsg.changeStatu(2);
        ms_frfl.changeStatu(1);   // 禁用刷新好友列表
        vfblk.lempty = false;
        for(var i =0;i<flist.length;i++){
            var f = new vfblk(flist[i], m_div_flist);
            var v = new vmsgb(m_div_msgbox, flist[i]);
            var e = new emsgb(m_div_msgedit, flist[i]);
            f.load(v, e);
            i == 0 && f.active(); // 激活第一个 也可以用load()只加载 激活包括加载
        }
    }
}

var view_flist_single = (uid) => {  // 只加载一个
    var f = new vfblk(uid, m_div_flist);
    var v = new vmsgb(m_div_msgbox, uid);
    var e = new emsgb(m_div_msgedit, uid);
    f.load(v, e);
    ms_clmsg.changeStatu(2);
    ms_frfl.changeStatu(1);
    if(vfblk.lempty){
        vfblk.lempty = false;
        f.active();
    }
}

entry_page = new page(entry_div);
register_page = new page(register_div, entry_page);
main_page = new page(main_div, entry_page);

entry_page.load(); // 登录页面
register_btn.onclick = () => {  // 注册页面按钮
    register_page.load(); 
};
entry_btn.onclick = () => {  // 登录页面按钮
    register_page.back();
};
var xt_diaobao;  //  给心跳统计掉包率
e_submit_btn.onclick = () => { // 登录按钮点击 登录
    var uid = e_id_ipt.value, 
        password = e_password_ipt.value;
    if(uid.length > 0 && password.length > 6) {
        e_submit_btn.value = '登录中';
        e_submit_btn.disabled = true;
        login(uid, password, (succ)=>{
            e_submit_btn.value = '登录';
            e_submit_btn.disabled = false;
            if(succ) {
                // e_remember_ckb
                nuc_config.config.set("lastuid", uid);
                if(e_remember_ckb.checked){
                    nuc_config.config.set('password', password);
                    nuc_config.config.set("remeber", true);
                }else{
                    nuc_config.config.set('password', "");
                    nuc_config.config.set("remeber", false);
                }
                nuc_config.config.save();
                main_page.load();
                nuc_cache.init(uid);
                view_flist(self_flist);
                xt_diaobao = new diaobao();  //  给心跳统计掉包率
                xt_diaobao.init().start();
                keep_alive(() => {
                    if(xt_diaobao.update() >= 0.1 && xt_diaobao.dcount >= 5){
                        xt_diaobao.stop() && stop_alive() && main_page.back();  
                        nuc_cache.save();
                    }
                    // 心跳掉包率超标返回登录页(相当于没有告知服务器的退出登录)
                    xt_diaobao.dcount == 3 && TU.alert('与服务器连接状况不稳定...',{center: true, timeOut: 4000, moveable: true});
                    console.log('掉包次数',xt_diaobao.dcount,'统计次数',xt_diaobao.fcount);
                });
            }else {
                e_password_ipt.value = '';      // 密码错误、网络错误、服务器未开启等
                e_password_ipt.focus();
            }
        });
    }
};
r_submit_btn.onclick = () => {
    var uname = r_uname_ipt.value,
        password = r_password_ipt.value,
        password2 = r_password_ipt2.value;
    if(uname.length > 0&&password.length>0&&password2.length>0){
        if(password!=password2){
            TU.alert('两次密码不一致!',{topCenter:true,shadow:true});
            r_password_ipt.value = '';
            r_password_ipt2.value = '';
        }else{
            r_submit_btn.value = "请稍等";
            r_submit_btn.disabled = true;
            register(uname, password, (back)=>{
                r_submit_btn.value = "注册";
                r_submit_btn.disabled = false;
                if(back){
                    TU.confirm("注册成功你的id: "+back+"\n是否立即前往登录",{
                        moveable: true,
                        onconfirm: ()=>{
                            register_page.back();
                            e_id_ipt.value = back;
                            e_password_ipt.value = password;
                            e_submit_btn.focus();
                        }
                    })
                }else{
                    TU.alert("注册失败!", {topCenter:true, shadow: true, moveable: true});
                }
            });
        }
    }
}