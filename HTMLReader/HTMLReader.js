var sTag = function(str){
    var reg = /^< *([A-z]+\w*) *[^>]*?\/ *>/i;
    return reg.test(str.trim());
}

var dTag = function(str){
    var reg = /^< *([A-z]+\w*) *[^>]*?>([^]*)< *\/ *\1 *>/ig;
    return reg.test(str.trim());
}

var HTMLReaderHelper = {
    /**
     * 
     * @param {string} str 
     */
    hideString: function(str){
        var reg = /'([^']*?)'|"([^"]*?)"|`([^`]*?)`/g;
        var o = {count:0,list:[],back:''};
        o.back = str.replace(reg, (rs, $1, $2, $3)=>{
            o.list.push($1 || $2 || $3 || '');
            return '$' + o.count++;
        });
        return o;
    },
    /**
     * 
     * @param {string} str 
     */
    delSpace : function(str){
        return str.replace(/ +/g, ' ').replace(/ ?= ?/g, '=').trim();
    },
}

var sTagReader = {
    /**
     * 
     * @param {string} str 
     */
    a: function(str){
        var reg = /^< *([A-z]+\w*){1}? *([_A-z]+\w*[^>]*)*?\/ *>/ig;
        var res = reg.exec(str);
        var t = {tag: '',attrs: ''};
        if(res && res.length > 1){
            t.tag = res[1];
            if(res.length > 2){
                t.attrs = res[2];
            }
        }
        return t;
    },
    b: function(t){
        var attrs = {};
        var _a = HTMLReaderHelper.hideString(t.attrs);
        HTMLReaderHelper.delSpace(_a.back).replace(/([^ =]+)=([^ =]*)/g, (rs, $1, $2)=>{
            if($2[0] == '$'){
                $2 = $2.replace(/^\$(\d+)$/, (rs, $1) => {
                    return _a.list[$1];
                });
            }
            attrs[$1] = $2;
            return '';
        }).replace(/[^=]?(\w+)[^=]?/g, (rs, $1)=>{
            attrs[$1] = true;
            return '';
        });
        return {tag: t.tag, attrs: attrs, type: 1};
    },
    /**
     * 
     * @param {string} str 
     */
    c: function(str){
        return str.replace(/^< *([A-z]+\w*) *[^>]*?\/ *>/i, '');
    }
}

var dTagReader = {
    /**
     * 
     * @param {string} str 
     */
    a: function(str){
        var reg = /^< *([A-z]+\w*){1}? *([_A-z]+\w*[^>]*?)>([^]*)< *\/ *\1 *>$/ig;
        var res = reg.exec(str);
        var t = {tag: '',attrs: '',inner: ''};
        if(res && res.length > 1){
            t.tag = res[1];
            if(res.length > 2){
                t.attrs = res[2];
                if(res.length > 3){
                    t.inner = res[3].trim();
                }
            }
        }
        return t;
    },
    b: function(t){
        var attrs = {};
        var _a = HTMLReaderHelper.hideString(t.attrs);
        HTMLReaderHelper.delSpace(_a.back).replace(/([^ =]+)=([^ =]*)/g, (rs, $1, $2)=>{
            if($2[0] == '$'){
                $2 = $2.replace(/^\$(\d+)$/, (rs, $1) => {
                    return _a.list[$1];
                });
            }
            attrs[$1] = $2;
            return '';
        }).replace(/[^=]?(\w+)[^=]?/g, (rs, $1)=>{
            attrs[$1] = true;
            return '';
        });
        return {tag: t.tag, attrs: attrs, inner: t.inner, type: 2};
    },
    /**
     * 
     * @param {string} str 
     */
    c: function(str){
        return str.replace(/^< *([A-z]+\w*) *[^>]*?>([^]*)< *\/ *\1 *>/i, '');
    }
}

const HTMLReader = {
    /**
     * 删除html注释
     * @param {string} str 
     */
    delComment: function(str){
        var reg = /<!--.*?-->/g;
        return str.replace(reg, '');
    },
    /**
     * 
     * @param {string} str 
     */
    checkReadable: function(str){
        var s = sTag(str);
        var d = dTag(str);
        if(s || !d)
            return {able: true, type: 1};
        else if(!s || d)
            return {able: true, type: 2};
        else
            return {able: false, type: 0};
    },
    /**
     * 
     * @param {string} str 
     */
    simpleReader: function(str){
        str = HTMLReader.delComment(str).trim();
        var cr = HTMLReader.checkReadable(str);
        var t;
        if(!cr.able) return {res: false, input: str}
        if(cr.type == 1){
            t = sTagReader.b(sTagReader.a(str));
            return {res: true, input: str, tag: t.tag, attrs: t.attrs, type: t.type};
        }else if(cr.type == 2){
            t = dTagReader.b(dTagReader.a(str));
            return {res: true, input: str, tag: t.tag, attrs: t.attrs, type: t.type, inner: t.inner};
        }
    },
    multiReader: function(str){

    }
}

if(module) {
    module.exports = HTMLReader;
}