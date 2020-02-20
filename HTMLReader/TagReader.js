const TagTree = require('./TagTree');
const Tag = require('./Tag');
const Stack = require('./Stack');

// module.exports = {
// }

function one(str){
    var dtt = new TagTree();
    var root = new Tag('root');
    var lst_stack = new Stack();
    lst_stack.push(root);
    var reg_d = /^\s*< *([A-z]+\w*) *[^>\/]*>\s*/i;
    var reg_s = /^\s*< *([A-z]+\w*) *[^>]*?\/ *>\s*/i;
    var reg_e = /^\s*< *\/ *([A-z]+\w*) *>\s*/i;
    var reg_t = /^\s*([^><]+?)\s*/i;
    while(str.length>0){
        var doi = true;
        if(doi)
        str = str.replace(reg_d, (rs, $1)=>{
            var t = new Tag($1);
            t.set({type:2});
            t.addHtml(rs.trim());
            var lst = lst_stack.peek();
            lst.addChild(t.tag()).addInnerHTML(rs.trim());
            lst_stack.push(t);
            dtt.add(t.tag());
            //console.log(t.tag().tag, 'enter');
            doi = false;
            return '';
        });
        if(doi)
        str = str.replace(reg_s, (rs, $1)=>{
            var t = new Tag($1).set({type:1, html: rs.trim()});
            var lst = lst_stack.peek();
            lst.addChild(t).addInnerHTML(rs.trim());
            doi = false;
            return '';
        });
        if(doi)
        str = str.replace(reg_e, (rs, $1)=>{
            var t = new Tag($1);
            //console.log(t.tag, "close");
            lst_stack.pop().addHtml(rs.trim());
            lst_stack.peek().addInnerHTML(rs.trim());
            dtt.remove(t.tag());
            doi = false;
            return '';
        });
        if(doi)
        str = str.replace(reg_t, (rs, $1)=>{
            var lst = lst_stack.peek();
            lst.addInnerText($1).addInnerHTML(rs.trim());
            doi = false;
            return '';
        });
    }
    return root.tag();
}

var txt = "\
012345678\
<one id=1>\
    <singletag2 />\
    <two kks>\
        djfkgjdlfsjglfdg5465456\
        <three kfkdhgjskfdhjkf hfdjhgdj id fjjfjj= 45456 hfdhfjd = 'hdhsjd'>\
            fjfjfjjfj\
        </three>\
        <three></three>\
        <single />\
    </two>\
</one>\
"

var ro = one(txt);
console.log(JSON.stringify(ro));