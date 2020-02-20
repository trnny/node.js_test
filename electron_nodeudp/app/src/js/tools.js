(function(){
    var _TU = function(){
        var alert_e,
            alert_c,
            alert_shadow_e,
            alert_shadow_c;

        alert_c = 0;
        alert_shadow_c = 0;
        alert_e = document.body;
        alert_shadow_e = document.createElement('div');
        alert_shadow_e.className = 'alert_shadow_e';
        var styleLink = document.createElement('link');
        styleLink.rel = "stylesheet";
        styleLink.type = "text/css";
        styleLink.href = "src/css/tools_alert.css";
        document.head.appendChild(styleLink);
        alert_e.appendChild(alert_shadow_e);
    
        var move = (o) => {
            var x, y, lx, ly, 
                m_cbf = (e) => {
                    x += e.x -lx;
                    y += e.y -ly;
                    lx = e.x;
                    ly = e.y;
                    o.style.left = x + 'px';
                    o.style.top = y + 'px';
                }
            o.onmousedown = (e) => {
                // e.preventDefault(); // 会阻止input获取焦点
                x = o.offsetLeft;
                y = o.offsetTop;
                lx = e.x;
                ly = e.y;
                window.addEventListener('mousemove', m_cbf);
                var rem = (e) => {
                    window.removeEventListener('mousemove', m_cbf);
                    window.removeEventListener('mouseup', rem);
                }
                window.addEventListener('mouseup', rem);
            }
        }

        var checkShadowShow = ()=>{
            if(!alert_shadow_c++){
                alert_shadow_e.style.display = 'block';
            }
        }

        var checkShadowHide = ()=>{
            if(!--alert_shadow_c){
                alert_shadow_e.style.display = 'none';
            }
        }

        var checkShow = ()=>{
            alert_c ++;
        }

        var checkHide = ()=>{
            alert_c --;
        }
        /**
         * 提示框
         */
        this.alert = function(str, opt){
            str = str === undefined ? '' : str;
            opt = opt || {};

            opt.shadow && checkShadowShow();
            checkShow();

            var o = document.createElement('div'),      // 该框的对象
                p = document.createElement('h4'),       // 显示的字
                b1 = document.createElement('p'),       // 关闭按钮
                b2 = document.createElement('input');   // 确认按钮

            o.className = 'tools_alert_a';
            o.style.zIndex = 12 + alert_c;
            p.innerText = str;
            b1.innerText = "✕";
            b2.type = 'button';
            b2.value = '确定';
            alert_e.appendChild(o);
            o.appendChild(p);
            o.appendChild(b1);
            o.appendChild(b2);
            var _timer = null;
            b1.onclick = ()=>{
                _timer != null && clearTimeout(_timer);
                alert_e.removeChild(o);
                opt.shadow && checkShadowHide();
                checkHide();
                opt.onclose && opt.onclose();
                opt.callback && opt.callback(false);
            }
            b2.onclick = ()=>{
                _timer != null && clearTimeout(_timer);
                alert_e.removeChild(o);
                opt.shadow && checkShadowHide();
                checkHide();
                opt.onconfirm && opt.onconfirm();
                opt.callback && opt.callback(true);
            }
            b2.focus();
            if(opt.center){
                o.style.left = (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px';
                o.style.top = (alert_e.offsetHeight - o.offsetHeight) /2 + 'px';
            }else if(opt.topCenter){
                o.style.left = (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px';
                o.style.top = '0px';
            }else{
                o.style.left = opt.x === undefined ? (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px' : opt.x + 'px';
                o.style.top = opt.y === undefined ? (alert_e.offsetHeight - o.offsetHeight) /2 + 'px' : opt.y +'px';
            }
            if(opt.textSelect) p.style.userSelect = 'text';
            opt.moveable && move(o);
            if(opt.timeOut){
                _timer = setTimeout(()=>{
                    b1.onclick();
                },opt.timeOut);
            }
            return this;
        }
        /**
         * 确认框
         */
        this.confirm = function(str, opt){
            str = str === undefined ? "确定当前操作？" : str;
            opt = opt || {};

            opt.shadow && checkShadowShow();
            checkShow();

            var o = document.createElement('div'),      // 该框的对象
                p = document.createElement('h4'),       // 显示的字
                b1 = document.createElement('p'),       // 关闭按钮
                bY = document.createElement('input'),   // 确认按钮
                bN = document.createElement('input');   // 取消按钮
            o.className = 'tools_alert_c';
            o.style.zIndex = 12+alert_c;
            p.innerText = str;
            b1.innerText = "✕";
            bY.type = bN.type = 'button';
            bY.value = '确定';
            bN.value = '取消';
            alert_e.appendChild(o);
            o.appendChild(p);
            o.appendChild(b1);
            o.appendChild(bY);
            o.appendChild(bN);
            b1.onclick = bN.onclick = ()=>{
                alert_e.removeChild(o);
                opt.shadow && checkShadowHide();
                checkHide();
                opt.onclose && opt.onclose();
                opt.callback && opt.callback(false);
            }
            bY.onclick = ()=>{
                alert_e.removeChild(o);
                opt.shadow && checkShadowHide();
                checkHide();
                opt.onconfirm && opt.onconfirm();
                opt.callback && opt.callback(true);
            }
            bN.focus();
            if(opt.center){
                o.style.left = (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px';
                o.style.top = (alert_e.offsetHeight - o.offsetHeight) /2 + 'px';
            }else if(opt.topCenter){
                o.style.left = (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px';
                o.style.top = '0px';
            }else{
                o.style.left = opt.x === undefined ? (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px' : opt.x + 'px';
                o.style.top = opt.y === undefined ? (alert_e.offsetHeight - o.offsetHeight) /2 + 'px' : opt.y +'px';
            }
            if(opt.textSelect) p.style.userSelect = 'text';
            opt.moveable && move(o);
            return this;
        }
        /**
         * 输入框
         */
        this.prompt = function(str, opt){
            str = str === undefined ? '请输入:' : str;
            opt = opt || {};

            opt.shadow && checkShadowShow();
            checkShow();
            
            var o = document.createElement('div'),      // 该框的对象
                p = document.createElement('h4'),       // 显示的字
                i1 = document.createElement('input'),   // 单行输入
                b1 = document.createElement('p'),       // 关闭按钮
                b2 = document.createElement('input');   // 确认按钮
            o.className = 'tools_alert_p';
            o.style.zIndex = 12 + alert_c;
            p.innerText = str;
            i1.type = opt.inputType || 'text';
            b1.innerText = "✕";
            b2.type = 'button';
            b2.value = '确定';
            alert_e.appendChild(o);
            o.appendChild(p);
            o.appendChild(i1);
            o.appendChild(b1);
            o.appendChild(b2);
            b1.onclick = ()=>{
                alert_e.removeChild(o);
                opt.shadow && checkShadowHide();
                checkHide();
                opt.onclose && opt.onclose();
                opt.callback && opt.callback(false);
            }
            b2.onclick = ()=>{
                var i = i1.value;
                alert_e.removeChild(o);
                opt.shadow && checkShadowHide();
                checkHide();
                opt.onconfirm && opt.onconfirm(i);
                opt.callback && opt.callback(i);
            }
            i1.onkeydown = (e)=>{
                if(e.keyCode == 13){
                    // Enter
                    b2.onclick();
                    i1.onkeydown = null;
                    return false;
                }else if(e.keyCode == 27){
                    // Esc
                    b1.onclick();
                    i1.onkeydown = null;
                    return false;
                }
            }
            i1.focus();
            if(opt.center){
                o.style.left = (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px';
                o.style.top = (alert_e.offsetHeight - o.offsetHeight) /2 + 'px';
            }else if(opt.topCenter){
                o.style.left = (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px';
                o.style.top = '0px';
            }else{
                o.style.left = opt.x === undefined ? (alert_e.offsetWidth - o.offsetWidth) / 2 + 'px' : opt.x + 'px';
                o.style.top = opt.y === undefined ? (alert_e.offsetHeight - o.offsetHeight) /2 + 'px' : opt.y +'px';
            }
            if(opt.textSelect) p.style.userSelect = 'text';
            opt.moveable && move(o);
            return this;
        }
        return this;
    };
    window.TU = new _TU();
})();

/**
 * 统计掉包率 心跳包
 */
var diaobao = function(){
}
diaobao.prototype = {
    timer: null,
    dcount: 0,
    fcount: 1,
    bili: 0,
    init: function(){
        this.bili = 0;
        this.dcount = 0;
        this.fcount = 1;
        return this;
    },
    update: function(){     // 返回掉包率
        this.bili = ++this.dcount / this.fcount;
        return this.bili;
    },
    _t: function(){
    },
    start: function(){
        this.timer != null && clearInterval(this.timer);
        this.timer = setInterval(()=>{
            if(++this.fcount > 99){
                this.bili = this.dcount / this.fcount;
                this.dcount = 0;
                this.fcount =1;
            }
        }, 2000);
        return this;
    },
    stop: function(){
        this.timer != null && clearInterval(this.timer);
        this.timer = null;
        return this;
    }
}