/**
 * 在消息显示的框中把消息按照格式显示出来
 */

 var vmsgb = function (f, uid){
     this.f = f || document.body;
     this.e = null;
     this.uid = uid;
     this.init();
 }

 vmsgb.prototype = {
     // msgList: [],
     scroll: true,  // 滚动
     maxScroll: 0,  // 记录用户有没有滚动
     init: function(){
        this.e = document.createElement('div');
        this.e.className = 'msgbox_div_class';
        //  开始加载缓存消息
        var m_cache = nuc_cache.search.byUid(this.uid);
        m_cache.forEach((v)=>{
           this.e.innerHTML += v[4];
        });
        this.scroll = true;
        this.maxScroll = 0;
     },
     send: function(msg){  // 此msg为对象 显示发送给别人的消息
         msg.show(this.e);
         ms_clmsg.changeStatu(2);
         this.scroll = true;  // 发送消息后开启滚动
         this.f.scrollTop = this.f.scrollHeight;
         this.maxScroll = this.f.scrollTop
     },
     recv: function(uid, msg){  // 暂时此msg只是字符串  显示接收自别人的消息
         var m_recv = document.createElement('div'); // 消息的框
         m_recv.className = 'smsg_div_recv';  // 发送的消息的样式
         var t = document.createElement('h4'),
             b = document.createElement('div');
         t.innerText = msg.date;
         b.innerHTML = msg.body;
         t.className = 'smsg_t_recv';
         b.className = 'smsg_b_recv';
         m_recv.appendChild(t);
         m_recv.appendChild(b);
         this.e.appendChild(m_recv);
         nuc_cache.recv(this.uid, msg.date, m_recv.outerHTML);   // 缓存一下消息
         ms_clmsg.changeStatu(2);
         if(this.scroll){
            this.f.scrollTop = this.f.scrollHeight;
            this.maxScroll = this.f.scrollTop
         }
     },
     clean: function(){
        this.e.innerHTML = '';
        this.scroll = true;
        this.maxScroll = 0;
     },
     load: function(){
        this.f.innerHTML = '';
        this.f.appendChild(this.e);
        this.scroll = true;
        this.f.scrollTop = this.f.scrollHeight;
        this.maxScroll = this.f.scrollTop
        this.f.onscroll = ()=>{
           this.scroll = this.f.scrollTop == this.maxScroll;  // 开或关滚动
        }
     },
     remove: function(){  // 保留

     }
 }

/**
 * 消息的编辑框
 */
 var emsgb = function (f, uid){
     this.f = f || document.body;
     this.e = null;
     this.uid = uid;
     this.init();
 }

 emsgb.prototype = {
     init: function(){
        this.e = document.createElement('div');
        this.e.className = 'msgedit_div_class';
        this.e.contentEditable = true;
        this.e.spellcheck = false;
        this.e.onkeypress = (e)=>{
            if(e.ctrlKey && (e.key == "↵" || e.keyCode == 10 || e.code == "Enter")){
               vfblk.onsend();
               return false;  // 相当于 e.preventDefault() + e.cancelBubble = false + e.stopPrapagation() 的集合
            }
        }
     },
     load: function(){
        this.f.innerHTML = '';
        this.f.appendChild(this.e);
        this.e.focus();
     },
     clean: function(){
        this.e.innerHTML = '';
     },
     send: function(uid, msg){
         this.clean();
         msg.changeStatu(1);
         sendMsg(uid, {type:'msg',msg:msg.msg}, (back) => {
            if(back) {msg.changeStatu(3);nuc_cache.send(uid, new Date().toLocaleString('chinese', { hour12: false }),msg.e.outerHTML)}
            else msg.changeStatu(2);
         });
     },
     remove: function(){ // 保留

     }
 }

 /**
  * 消息的结构
  */
 var smsg = function(msg){
    this.msg = msg;
    this.statu = 0; // 0 初始化 1 发送送中 2 发送失败 3 发送成功 ....之后会完善 4 超时 5 已发送但好友不在 等状态
    this.e = null;
    this.f = null;
    this.init();
 }

 smsg.prototype = {
    init: function(){
       this.e = document.createElement('div'); // 消息的框
       this.e.className = 'smsg_div_send';  // 发送的消息的样式
       var t = document.createElement('h4'), 
           b = document.createElement('div');
       t.innerText = new Date().toLocaleString('chinese', { hour12: false });
       b.innerHTML = this.msg;
       t.className = 'smsg_t_send';
       b.className = 'smsg_b_send';
       this.e.appendChild(t);
       this.e.appendChild(b);
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
          this.e.firstElementChild.style.color = '#fff';
          break;
       case 2:    //    发送失败
          this.e.firstElementChild.style.color = 'red';
          var resend = () => {  // 重发
            this.f != null && this.f.removeChild(this.e);
            var s = vfblk.lastActive;
            s.e.send(s.uid, this);
            s.v.send(this);
            this.e.removeEventListener('click', resend);
          }
          this.e.addEventListener('click', resend);
          break;
       case 3:   //    发送成功
          this.e.firstElementChild.style.color = '#22db41';
          break;
       default:
       }
    },
    show: function(f){
      this.f = f || document.body;
      this.f.appendChild(this.e);
    },
 }