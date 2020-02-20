/**
 * 登录页的设置菜单
 * @param {*} f 
 */
function lsetb(f){
    this.f = f || document.body;
    this.e = null;
}
lsetb.prototype = {
    show: false,
    init: function(){
        this.show = false;
        this.e = document.createElement('div');
        this.e.id = 'lsetb';
        var s_btn = document.createElement('img');
        s_btn.onload = ()=>{
            s_btn.width = 32;
            s_btn.height = 32;
            s_btn.onclick = ()=>{
                this.open() && this.close();
            }
            this.e.appendChild(s_btn);
            var b = document.createElement('div');
            b.id = 'lsetb_b';
            this.e.appendChild(b);
            b.innerHTML = `<label for='lsetb_b_ip'>ip: </label><input id='lsetb_b_ip' type='text' placeholder='127.0.0.1'/><label for='lsetb_b_port'>port: </label><input id='lsetb_b_port' type='text' placeholder='7777'/><input id='lsetb_b_cg' type='button' value='更改'>`;
            var cg = document.getElementById('lsetb_b_cg');
            cg.onclick = ()=>{
                var b_ip = document.getElementById('lsetb_b_ip').value;
                var b_port = document.getElementById('lsetb_b_port').value;
                if(b_ip){
                    data_service_ip = b_ip;
                    nuc_config.config.set("data_service_ip", b_ip);
                } 
                if(b_port){
                    data_service_port = b_port;
                    nuc_config.config.set("data_service_port", b_port)
                }
                checkUpdate_src = "http://"+data_service_ip+"/nuc/update";
                this.close();
            }
        };
        s_btn.src = 'src/img/settings.png';

        this.f.appendChild(this.e);
    },
    close: function(){
        var b = document.getElementById('lsetb_b');
        b.style.display = 'none';
        this.show = false;
    },
    open: function(){
        if(this.show){
            return true;
        }
        var b = document.getElementById('lsetb_b');
        b.style.display = 'block';
        this.show = true;
        return false;
    },
    destory: function(){
        this.f.removeChild(this.e);
        this.e = null;
    }
}

var setblk = new lsetb(entry_div);
setblk.init();

var litem = function(){
    this.init();
}
litem.prototype = {
    e: null,
    init: function(){
        this.e = document.createElement('p');
        this.e.className = 'mset_b_line';
    },
    onclean: function(){

    }
}

var mitem = function(text){
    this.text = text;
    this.init();
}
mitem.prototype = {
    e: null,
    statu: 0,  // 0 初始化 1 禁止 2 就绪
    init: function(){
        this.e = document.createElement('p');
        this.e.innerText = this.text;
        this.e.className = 'mset_b_item_0';
    },
    onclean: function(){
        this.statu = 0;
    },
    changeStatu: function(s){
        if(this.statu != s){
            this.statu = s;
            this.onStatuChange();
        }
    },
    onStatuChange: function(){
        switch (this.statu){
        case 1:
            this.e.className = 'mset_b_item_1';
            break;
        case 2:
            this.e.className = 'mset_b_item_2';
            break;
        default:
        }
    },
    disabled: function(){
        if(this.statu == 1) return true;
        return false;
    }
}


/**
 * 漂浮菜单 装入操作的功能
 * @param {*} f 
 */
var msetb = function(f){
    this.f = f || document.body;
    this.e = null;
    this.b = null;
}

msetb.prototype = {
    items: [],
    showing: false,
    init: function(){
        this.showing = false;
        this.e = document.createElement('div');
        this.f.appendChild(this.e);
        this.e.id = 'msetb';
        var s_btn = document.createElement('img');
        this.e.appendChild(s_btn);
        this.b = document.createElement('div');
        this.b.id = 'msetb_b';
        this.e.appendChild(this.b);
        s_btn.onload = ()=>{
            s_btn.width = 32;
            s_btn.height = 32;
            this.e.style['top'] = (win_h / 2 + 30) + 'px';
            var mov = 0;    // 用于判断用户是点击还是拖动
            var x, y, lx, ly, 
                m_cbf = (e) => {
                    mov++;
                    x += e.x - lx;
                    y += e.y - ly;
                    lx = e.x;
                    ly = e.y;
                    //if
                    var px = x + 'px',
                        py = y + 'px';
                    this.e.style['left'] = px;
                    this.e.style['top'] = py;
                }
            s_btn.onmousedown = (e)=>{
                e.preventDefault();
                mov = 0;
                x = this.e.offsetLeft;
                y = this.e.offsetTop;
                lx = e.x;
                ly = e.y;
                window.addEventListener('mousemove', m_cbf);
                var rem = (e) => {
                    window.removeEventListener('mousemove', m_cbf);
                    window.removeEventListener('mouseup', rem);
                    mov < 3 && this.show() && this.hide();
                }
                window.addEventListener('mouseup', rem);
            }
        };
        s_btn.src = 'src/img/settings.png';
        return this;
    },
    addItem: function(item){
        this.items.push(item);
        return this;
    },
    addItems: function(items){
        items.forEach((t)=>{
            this.items.push(t);
        });
        return this;
    },
    removeItem: function(item){
        var t = [];
        for(var i = 0;i<this.items.length;i++){
            if(this.items[i]==item){
                this.b.removeChild(item.e);
                item.onclean();
            }else{
                t.push(this.items[i]);
            }
        }
        this.items = t;
        return this;
    },
    removeItems: function(items){
        var t = [];
        for(var i = 0;i<this.items.length;i++){
            var j=0;
            for(;j<items.length;j++){
                if(this.items[i]==items[j]){
                    this.b.removeChild(items[j].e);
                    items[j].onclean();
                    j += items.length + 1;
                    break;
                }
            }
            if(j == items.length){
                t.push(this.items[i]);
            }
        }
        this.items = t;
        return this;
    },
    load: function(){
        this.b.innerHTML = '';
        this.items.forEach((t)=>{
            this.b.appendChild(t.e);
        });
        return this;
    },
    show: function(){
        if(this.showing){
            return true;
        }
        this.b.style.display = 'block';
        this.showing = true;
        return false;
    },
    hide: function(){
        this.b.style.display = 'none';
        this.showing = false;
    },
    clean: function(){
        this.b.innerHTML = '';
        for(var i = 0; i<this.items.length;i++){
            this.items[i].onclean();
        }
        return this;
    },
    destory: function(){  // 保留

    }
}

/**
 * 杂项操作的菜单
 */
msblk = new msetb(main_div);
msblk.init();

/**
 * 添加功能
 */
ms_lgout = new mitem('退出登录');
ms_lgout.e.onclick = ()=>{
    if(!ms_lgout.disabled()){
        ms_lgout.changeStatu(1);
        logout((back)=>{
            ms_lgout.changeStatu(2);
            msblk.hide();
            if(back){main_page.back();nuc_cache.save();}
            else{}
        });
    }
}
ms_addf = new mitem('添加好友');
ms_addf.e.onclick = ()=>{   // 只负责发送好友请求
    if(!ms_addf.disabled()){
        ms_addf.changeStatu(1);
        TU.prompt('请输入对方id:', {
            shadow: true,
            topCenter: true,
            onconfirm: (va)=>{
                if(va && va.length > 4 && va.length <= 10){
                    // 对方是否是好友
                    if(nucvad.isFriend(va)){
                        ms_addf.changeStatu(2);
                        return TU.alert(va+'已经是你的好友!',{topCenter: true});
                    }else if(va == self_id){
                        ms_addf.changeStatu(2);
                        return TU.alert("请不要添加自己为好友",{topCenter: true});
                    }
                    sendMsg(va, {type: 'addfriend', by: 'id', back: false}, (back)=>{
                        ms_addf.changeStatu(2);
                        if(back){
                            TU.alert('好友请求已发送',{
                                center: true,
                                moveable: true,
                                timeOut: 4000
                            });
                        }else{
                            TU.alert('好友请求发送失败!',{
                                topCenter: true
                            });
                        }
                    });
                }else{
                    ms_addf.changeStatu(2);
                    TU.alert('请输入正确的好友id',{shadow:true});
                }
            }
        });
    }
}

ms_frfl = new mitem('刷新列表');    // 隐藏的是否需要显示出来
ms_frfl.e.onclick = ()=>{
    if(!ms_frfl.disabled()){
        ms_frfl.changeStatu(1);
        var c = self_flist.length - vfblk.mList.length;
        if(c >0){
            if(vfblk.mList.length == 0)
                view_flist(self_flist);
            else
                self_flist.forEach((uid)=>{
                    var h = false;
                    if(c>0){
                        vfblk.mList.forEach((t)=>{
                            if(t && uid == t.uid) h = true;
                        });
                        if(!h){
                            view_flist_single(uid);
                            c--;
                        }
                    }
                });
        }
    }
}

ms_rena = new mitem('更换昵称');
ms_rena.changeStatu(1);

ms_clmsg = new mitem('清空聊天记录');
ms_clmsg.e.onclick = ()=>{
    !ms_clmsg.disabled() && vfblk.lastActive && vfblk.lastActive.v && vfblk.lastActive.isShow && vfblk.lastActive.v.clean();
    msblk.show() && msblk.hide();
    ms_clmsg.changeStatu(1);
}

ms_chead = new mitem('更换头像');
ms_chead.e.onclick = ()=>{
    if(ms_chead.disabled()) return;
    // ms_chead.changeStatu(1);
    var chead_div = document.createElement('div');
    chead_div.id = 'chead_div';

    var fileEle = document.createElement('input');
        fileEle.type = 'file';
        fileEle.style.display = 'none';
        // fileEle.id = "file_input_head";
    var c_div = document.createElement('div'),
        p_div = document.createElement('div'),
        p_img = document.createElement('img'),
        p_rect = document.createElement('div');

    var reader = new FileReader();
    var file = null;

    var canvas = document.createElement('canvas');
        canvas.width = 180;
        canvas.height = 180;
        canvas.style.width = "180px";
        canvas.style.height = "180px";
        canvas.id = 'canvas_head';
    var ctx = canvas.getContext('2d');
    c_div.appendChild(canvas);
    c_div.id = "c_div";
    p_div.id = "p_div";
    p_rect.id="p_rect";

    var pickRect = 0,           // 框真实大小
        max_pickRect = 0,       // 最大框
        min_pickRect = 0,       // 最小框
        _left = 0,               // 左距
        _top = 0,                // 上距
        imgwidth = 0,           // 图片宽
        imgheight = 0,          // 图片高
        max_size = 240,         // 最大显示
        _zoom = 1;              // 缩放

    var ctxdraw = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(p_img, _left/_zoom, _top/_zoom, pickRect/_zoom, pickRect/_zoom, 0, 0, 180, 180);
    }

    p_div.appendChild(p_img);
    p_div.appendChild(p_rect);
    p_img.onload = function(){
        _zoom = 1;
        imgwidth = this.width;
        imgheight = this.height;
        max_pickRect = imgheight > imgwidth ? imgwidth : imgheight;
        var _max_size = imgheight > imgwidth ? imgheight : imgwidth;
        if(_max_size > max_size){
            _zoom = max_size / _max_size;
            max_pickRect = max_pickRect * _zoom;
            imgwidth = imgwidth * _zoom;
            imgheight = imgheight * _zoom;
            // console.log(max_pickRect, imgheight, imgwidth);
        }
        this.style.width = imgwidth + 'px';
        this.style.height = imgheight + 'px';
        pickRect = max_pickRect;
        min_pickRect = 24;
        p_rect.style.width = pickRect+'px';
        p_rect.style.height = pickRect+'px';
        p_rect.style.display = 'block';
        _left = (imgwidth - pickRect) /2 -1;
        _top = (imgheight - pickRect) /2 -1;
        p_rect.style.left =  _left + 'px';
        p_rect.style.top =  _top + 'px';
        ctxdraw();
    };
    reader.onload = function(e){
        p_img.src = e.target.result;
    };
    fileEle.addEventListener('change', function(event){
        file = event.target.files[0];
        if(file.type.indexOf('image')==0) {
            reader.readAsDataURL(file);
            document.body.appendChild(chead_div);
            chead_div.style.display = 'block';
            ms_chead.changeStatu(1);
        }else{
            TU.alert('请选择一张图片');
        }
    });
    chead_div.appendChild(fileEle);
    chead_div.appendChild(c_div);
    chead_div.appendChild(p_div);

    var _sub,_cls;
        _sub = document.createElement('input');
        _sub.type = 'button';
        _sub.value = "确定";
        _cls = document.createElement('input');
        _cls.type = 'button';
        _cls.value = "取消";
    chead_div.appendChild(_sub);
    chead_div.appendChild(_cls);
    _sub.onclick = ()=>{
        var base64Data = canvas.toDataURL("image/png");
        var opt = {url: "http://10.70.66.115/nuc/upload/head/"};
        var form = {
            uid: self_id,
            type: 'png',
            base64: base64Data
        }
        TUPostAsync({form: form}, opt, (err, res, body)=>{
            document.body.removeChild(chead_div);
            reader = null;
            ms_chead.changeStatu(2);
            if(err)
                return TU.alert('修改头像失败!');
            if(body){
                var r = JSON.parse(body);
                if(r.code == 0)
                return TU.alert('修改头像成功!');
            }
            return TU.alert('修改头像失败,未知错误!');
        });
    }
    _cls.onclick = ()=>{
        document.body.removeChild(chead_div);
        reader = null;
        ms_chead.changeStatu(2);
    }

    var lastx,lasty;
    p_rect.onmousedown = function(e){
        lastx = e.x;
        lasty = e.y;
        var t_left = _left, t_top = _top;
        var mclb = (e)=>{
            var _move = false;
            t_left += e.x - lastx;
            lastx = e.x;
            t_top += e.y - lasty;
            lasty =e.y;
            if(t_left>= -1 && t_left < imgwidth-pickRect){
                p_rect.style.left = t_left+'px';
                _left = t_left;
                _move = true;
            }
            if(t_top>=-1 && t_top < imgheight-pickRect){
                p_rect.style.top = t_top+'px';
                _top = t_top;
                _move = true;
            }
            if(_move){
                // 画画布
                ctxdraw();
            }
        }
        var remb = ()=>{
            window.removeEventListener('mousemove', mclb);
            window.removeEventListener('mouseup', remb);
        }
        window.addEventListener('mousemove', mclb);
        window.addEventListener('mouseup', remb);
        return false;
    }
    p_rect.onmousewheel = function(e){
        var _move = false;
        if(e.wheelDelta>0){ // 向上
            if(pickRect +4 <= max_pickRect && _left < imgwidth-pickRect-4 && _top < imgheight-pickRect-4){  // 放大
                pickRect += 4;
                p_rect.style.width = pickRect+'px';
                p_rect.style.height = pickRect+'px';
                _move = true;
            }
        }else{      // 向下
            if(pickRect-4>=min_pickRect){   // 缩小
                pickRect -= 4;
                p_rect.style.width = pickRect+'px';
                p_rect.style.height = pickRect+'px';
                _move = true;
            }
        }
        if(_move){
            // 画画布
            ctxdraw();
        }
    }
    var a = document.createEvent("MouseEvents");
    a.initEvent('click', true, true);
    fileEle.dispatchEvent(a);
}

msblk.addItems([ms_lgout, new litem(),ms_addf, ms_clmsg, ms_rena, ms_frfl, new litem(), ms_chead]);
msblk.load();

var dataURItoBlob = function(base64Data){
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(base64Data.split(',')[1]);
    else
        byteString = unescape(base64Data.split(',')[1]);
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    console.log(ia);
    var _buff = new Buffer(ia);
    console.log(_buff);
    return new Blob([ia], {type: mimeString});
}
