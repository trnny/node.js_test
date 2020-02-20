/**
 * xTable , easier to make a table by text!!
 * @module xTable
 * @version 1.19.2.27
 */

const xTable = function(title) {

    var _unstl_str = (str) => {
        var _str = str === undefined ? "" : str;
        var patt = /\x1B[[0-9;]+m/;
        while(_str.search(patt) != -1){
            _str = _str.replace(patt,"");
        }
        return _str;
    }

    var _len_asc = (str) => {
        var len = 0;
        var _str = _unstl_str(str);
        for(var i = 0;i<_str.length;i++){
            var ascii = _str.charCodeAt(i);
            if(ascii>=0&&ascii<129){
                len += 1;
            }else{
                len += 2;
            }
        }
        return len;
    }

    /**
     * 
     * @param {number} n The length of the string
     * @param {char} c The char to fill the string
     */
    var _fill = (n, c) => {
        _n = n || 0;
        _c = c == undefined ? " " : c;
        var r = "";
        for(var i = 0;i < _n;i++){
            r += _c;
        }
        return r;
    }

    /**
     * 
     * @param {string} str The string to be lengthened
     * @param {number} l The length of lengthened string
     * @param {number} a The alignment of lengthened string
     * @param {char} c The char to fill the string
     */
    var _al_fill = (str, l, a, c) => {
        var dis = l - _len_asc(str);
        if(dis <= 0) return str;
        if(a==0){
            var ll = parseInt(dis/2);
            var rl = dis - ll;
            return _fill(ll, c) + str + _fill(rl, c);
        }else if(a==1){
            return str+_fill(dis, c);
        }else{
            return _fill(dis, c)+str;
        }
    }

    var _title = title;
    var _heading;
    var _border_obj;
    var _Row_n = 1;
    var _Clum_l;
    var _Row = new Array();
    var _align = [0,0,1];
    var _margin = [0,0,0];
    var _string = "";

    var _set_border = (li) => {
        li = li ? li : xTable.ThinBorder;
        var o = {
            LeftTop:"",RightTop:"",RightBottom:"",LeftBottom:"",Top:"",Right:"",Bottom:"",Left:"",Hori:"",Vert:""
        }
        if(li.length == 10){
            var i = 0;
            for(var a in o){
                o[a] = li[i++];
            }
        }else if(li.length == 2){
            o.Top = o.Hori = o.Bottom = li[0];
            o.Left = o.Vert = o.Right = li[1];
        }else if(li.length == 3){
            o.Top = o.Hori = o.Bottom = li[0];
            o.Left = o.Vert = o.Right = li[1];
            o.LeftTop = o.RightTop = o.RightBottom = o.LeftBottom = li[2];
        }
        else if(li.length == 1){
            var i = 0;
            for(var a in o){
                o[a] = li[0];
            }
        }else{
            return;
        }
        _border_obj = o;
    };

    _set_border();

    var _top_str = () => {
        _string = _fill(_margin[1], '\n') + _fill(_margin[0]) + _border_obj.LeftTop;
        var char_l = 3*_Row_n - 1;
        for(var i=0;i<_Row_n;i++){
            char_l += _Clum_l[i];
        }
        if(_title){
            var len = _len_asc(_title) + 2;
            char_l = char_l > len ? char_l : len;
        }
        _string += _fill(char_l, _border_obj.Top)+_border_obj.RightTop+"\n";
    };

    var _title_str = () => {
        if(!_title) return;
        _string += _fill(_margin[0]) + _border_obj.Left +" ";
        var char_l = 3*_Row_n - 1;
        for(var i=0;i<_Row_n;i++){
            char_l += _Clum_l[i];
        }
        var len = _len_asc(_title) + 2;
        char_l = char_l > len ? char_l : len;
        _string += _al_fill(_title, char_l - 2, _align[1]) + " "+_border_obj.Right+"\n" + _fill(_margin[0]) + _border_obj.Left + _fill(char_l, _border_obj.Hori) + _border_obj.Right+"\n";
    };

    var _head_str = () => {
        if(!_heading) return;
        _string += _fill(_margin[0]) + _border_obj.Left;
        var len = 0;
        for(var i =0;i<_Row_n;i++){
            len += _Clum_l[i] + 3;
            if(i<_heading.length){
                _string += " "+_al_fill(_heading[i], _Clum_l[i], _align[2])+" "+ (i == _Row_n - 1 ? _border_obj.Right : _border_obj.Vert);
            }else{
                _string += " "+_fill( _Clum_l[i])+" "+_border_obj.Right;
            }
        }
        if(_title&&_len_asc(_title)>len) _string += _fill(_len_asc(_title) - len + 2) + _border_obj.Right;
        _string += "\n"+_fill(_margin[0]) +_border_obj.Left;
        for(var i =0;i<_Row_n;i++){
            _string += _fill( _Clum_l[i] + 2, _border_obj.Hori)+(i == _Row_n - 1 ? _border_obj.Right : _border_obj.Vert);
        }
        if(_title&&_len_asc(_title)>len) _string += _fill(_len_asc(_title) - len + 2, _border_obj.Hori) + _border_obj.Right;
        _string += "\n";
    };

    var _body_str = () => {
        for(var i = 0;i < _Row.length;i++){
            _string += _fill(_margin[0]) + _border_obj.Left;
            var len = 0;
            for(var j = 0;j <_Row_n;j++){
                len += _Clum_l[j] + 3;
                if(j<_Row[i].length){
                    _string += " " + _al_fill(_Row[i][j], _Clum_l[j], _align[0]) + " "+(j == _Row_n - 1 ? _border_obj.Right : _border_obj.Vert);
                }else{
                    _string += " " + _fill(_Clum_l[j]) + " "+_border_obj.Right;
                }
            }
            if(_title&&_len_asc(_title)>len) _string += _fill(_len_asc(_title) - len + 2) + _border_obj.Right;
            _string += "\n";
        }
    };

    var _bottom_str = () => {
        _string += _fill(_margin[0]) + _border_obj.LeftBottom;
        var char_l = 3*_Row_n - 1;
        for(var i=0;i<_Row_n;i++){
            char_l += _Clum_l[i];
        }
        if(_title){
            var len = _len_asc(_title) + 2;
            char_l = char_l > len ? char_l : len;
        }
        _string += _fill(char_l, _border_obj.Bottom)+_border_obj.RightBottom + _fill(_margin[2], '\n');
    };

    this.setTitle = (title) => {
        _title = title;
        return this;
    };

    this.setHeading = function () {
        var arg = new Array();
        if(arguments.length == 1 && arguments[0] instanceof Array) {
            _Row_n = arguments[0].length > _Row_n ? arguments[0].length : _Row_n;
            for(var i =0;i<arguments[0].length;i++){
                arg[i] = arguments[0][i] === undefined ? "" : arguments[0][i]+"";
            }
            _heading = arg;
            return this;
        }
        _Row_n = arguments.length > _Row_n ? arguments.length : _Row_n;
        for(var i =0;i<arguments.length;i++){
            arg[i] = arguments[i] === undefined ? "" : arguments[i]+"";
        }
        _heading = arg;
        return this;
    };

    /**
     * 
     * @param {number} t [1] body [2] title [3] head 的对齐方式
     * @param {number} w [0] center [1] left [2] right 对齐方向
     */
    this.setAlign = (t, w) => {
        if(typeof t === 'number' && t % 1 === 0 && t > 0 && t < 4) {
            _align[t-1] = w;
        }
        return this;
    };

    /**
     * 
     * @param {number} l leftMargin, if not set, it will be 0
     * @param {number} t topMargin, if not set, it will be 0
     * @param {number} b bottomMargin, if not set, it will be 0
     */
    this.setMargin = (l, t, b) => {
        _margin[0] = l || 0;
        _margin[1] = t || 0;
        _margin[2] = b || 0;
        return this;
    }

    /**
     * 
     * @param {(Object|Array)} obj - 更改border的字符 1.参数为对象可设置以下属性LeftTop,RightTop,RightBottom,LeftBottom,Top,Right,Bottom,Left,Hori,Vert
     * 2.参数为数组时按数组设置 3.参数为空时恢复默认
     */
    this.setBorder = (obj) => {
        if(Array.isArray(obj))
            _set_border(obj);
        else if(typeof obj === "undefined")
            _set_border();
        else if(typeof obj === "object"){
            for(a in obj){
                _border_obj[a] = obj[a];
            }
        }
        return this;
    }

    this.addRow = function () {
        var arg = new Array();
        if(arguments.length == 1&& arguments[0] instanceof Array) {
            _Row_n = arguments[0].length > _Row_n ? arguments[0].length : _Row_n;
            for(var i =0;i<arguments[0].length;i++){
                arg[i] = arguments[0][i] === undefined ? "" : arguments[0][i]+"";
            }
            _Row.push(arg);
            return this;
        }
        _Row_n = arguments.length > _Row_n ? arguments.length : _Row_n;
        for(var i =0;i<arguments.length;i++){
            arg[i] = arguments[i] === undefined ? "" : arguments[i]+"";
        }
        _Row.push(arg);
        return this;
    };

    this.toString = () => {
        _Clum_l = new Array(_Row_n);
        for(var i = 0;i<_Row_n;i++){
            _Clum_l[i] = 0;
        }
        if(_heading){
            for(var i = 0;i<_heading.length;i++){
                _Clum_l[i] = _len_asc(_heading[i]);
            }
        }
        for(var i = 0;i<_Row.length;i++){
            for(var j=0;j<_Row[i].length;j++){
                _Clum_l[j] = _len_asc(_Row[i][j]) > _Clum_l[j] ? _len_asc(_Row[i][j]) : _Clum_l[j];
            }
        }
        
        _top_str();
        _title_str();
        _head_str();
        _body_str();
        _bottom_str();
        return _string;
    };

    this.toHTML = (id) => {
        var html = "";
        if(_title){
            html += "<div><h3>" + _unstl_str(_title) + "</h3>";
        }
        html += "<table" + (id ? " id='" + id + "'" : "")+" border='1'>";
        if(_heading){
            html+="<tr>";
            for(var i=0;i<_Row_n;i++){
                html += "<th>" + _unstl_str(_heading[i]) + "</th>";
            }
            html += "</tr>";
        }
        for(var i = 0;i<_Row.length;i++){
            html+="<tr>";
            for(var j=0;j<_Row_n;j++){
                html += "<td>"+ _unstl_str(_Row[i][j]) + "</td>";
            }
            html += "</tr>";
        }
        html += "</table>";
        if(_title){
            html += "</div>";
        }
        return html;
    }

    this.toJSON = () => {
        var obj = new Object();
        obj.title = _title;
        obj.heading = _heading;
        obj.rows = _Row;
        obj.borders = _border_obj;
        return obj;
    };

    this.fromJSON = (obj) => {
        this.clear();
        this.setTitle(obj.title);
        this.setHeading(obj.heading);
        for(var i =0;i<obj.rows.length;i++){
            this.addRow(obj.rows[i]);
        }
        this.setBorder(obj.borders);
        return this;
    };

    this.clear = () => {
        this.clearRows();
        _title = null;
        _heading = null;
        _align = [0,0,1];
        _margin = [0,0,0];
        return this;
    };

    this.clearRows = () => {
        _Row = new Array();
        _Row_n = 1;
        _Clum_l = null;
        _string = "";
        return this;
    };

    return this;
};

xTable.Center = 0;
xTable.Left = 1;
xTable.Right = 2;
xTable.Body = 1;
xTable.Title = 2;
xTable.Head = 3;
xTable.ThinBorder = [".",".","'","'","-","|","-","|","-","|"];
xTable.StarBorder = ["*"];
xTable.fromJSON = (obj) => {
    var t = new xTable();
    t.setTitle(obj.title);
    t.setHeading(obj.heading);
    for(var i =0;i<obj.rows.length;i++){
        t.addRow(obj.rows[i]);
    }
    t.setBorder(obj.borders);
    return t;
};

if(module) {
    module.exports = xTable;
}