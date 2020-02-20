/**
 * xTable , easier to make a table by text!!
 * @module xTable
 * @version 0.9.16
 */

var xTable = function(title) {

    /**
     * 删掉str中的linux文字样式字符
     * @param {string} str string
     */
    var _unstl_str = (str) => {
        var _str = str === undefined ? "" : str;
        var patt = /\x1B[[0-9;]+m/;
        while(_str.search(patt) != -1){
            _str = _str.replace(patt,"");
        }
        return _str;
    }

    /**
     * 中文等非ascii的字符宽度按2计算
     * @param {string} str string
     */
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
     * 用c填一个长度为n的字符串出来
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
     * 把str按照a的对齐方式用c填充成一个长度为l的字符串
     * @param {string} str The string to be lengthened
     * @param {number} l The length of lengthened string
     * @param {number} a The alignment of lengthened string [0] center [1] left [2] right
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
    var _border_type;
    var _border_style;
    var _Row_n = 1;
    var _Clum_l;
    var _Row = new Array();
    var _align = [0,0,1];
    var _margin = [0,0,0];
    var _string = "";

    var _top_str = () => {
        _string = _fill(_margin[1], '\n') + _fill(_margin[0]) + ".";
        var char_l = 3*_Row_n - 1;
        for(var i=0;i<_Row_n;i++){
            char_l += _Clum_l[i];
        }
        if(_title){
            var len = _len_asc(_title) + 2;
            char_l = char_l > len ? char_l : len;
        }
        _string += _fill(char_l, "-")+".\n";
    };

    var _title_str = () => {
        if(!_title) return;
        _string += _fill(_margin[0]) + "| ";
        var char_l = 3*_Row_n - 1;
        for(var i=0;i<_Row_n;i++){
            char_l += _Clum_l[i];
        }
        var len = _len_asc(_title) + 2;
        char_l = char_l > len ? char_l : len;
        _string += _al_fill(_title, char_l - 2, _align[1]) + " |\n" + _fill(_margin[0]) + "|" + _fill(char_l, "-") + "|\n";
    };

    var _head_str = () => {
        if(!_heading) return;
        _string += _fill(_margin[0]) + "|";
        var len = 0;
        for(var i =0;i<_Row_n;i++){
            len += _Clum_l[i] + 3;
            if(i<_heading.length){
                _string += " "+_al_fill(_heading[i], _Clum_l[i], _align[2])+" |";
            }else{
                _string += " "+_fill( _Clum_l[i])+" |";
            }
        }
        if(_title&&_len_asc(_title)>len) _string += _fill(_len_asc(_title) - len + 2) + "|";
        _string += "\n"+_fill(_margin[0]) +"|";
        for(var i =0;i<_Row_n;i++){
            _string += _fill( _Clum_l[i] + 2, "-")+"|";
        }
        if(_title&&_len_asc(_title)>len) _string += _fill(_len_asc(_title) - len + 2, "-") + "|";
        _string += "\n";
    };

    var _body_str = () => {
        for(var i = 0;i < _Row.length;i++){
            _string += _fill(_margin[0]) + "|";
            var len = 0;
            for(var j = 0;j <_Row_n;j++){
                len += _Clum_l[j] + 3;
                if(j<_Row[i].length){
                    _string += " " + _al_fill(_Row[i][j], _Clum_l[j], _align[0]) + " |";
                }else{
                    _string += " " + _fill(_Clum_l[j]) + " |";
                }
            }
            if(_title&&_len_asc(_title)>len) _string += _fill(_len_asc(_title) - len + 2) + "|";
            _string += "\n";
        }
    };

    var _bottom_str = () => {
        _string += _fill(_margin[0]) + "'";
        var char_l = 3*_Row_n - 1;
        for(var i=0;i<_Row_n;i++){
            char_l += _Clum_l[i];
        }
        if(_title){
            var len = _len_asc(_title) + 2;
            char_l = char_l > len ? char_l : len;
        }
        _string += _fill(char_l, "-")+"'" + _fill(_margin[2], '\n');
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

    this.setTitle = (title) => {
        _title = title;
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

    this.toHTML = () => {
        var html = "";
        if(_title){
            html += "<div><h3>" + _unstl_str(_title) + "</h3>";
        }
        html += "<table border='1'>";
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
        return obj;
    };

    this.fromJSON = (obj) => {
        this.clear();
        this.setTitle(obj.title);
        this.setHeading(obj.heading);
        for(var i =0;i<obj.rows.length;i++){
            this.addRow(obj.rows[i]);
        }
        return this;
    };

    this.clear = () => {
        this.clearRows();
        _title = null;
        _border_style = null;
        _border_type = null;
        _heading = null;
        _align = [0,0,1];
        _margin = [0,0,0];
        return this;
    };

    this.clearRows = () => {
        _Row = new Array();
        _Row_n = 0;
        _Clum_l = null;
        _string = "";
        return this;
    };

    return this;
};

if(module) {
    module.exports = xTable;
}