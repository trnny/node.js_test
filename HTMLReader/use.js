const htmlReader = require('./HTMLReader');
const html = require('fs').readFileSync('ul.txt').toString();

var txt = "\
<p id=1>\
    <p kks>\
        <p kfkdhgjskfdhjkf hfdjhgdj id fjjfjj= 45456 hfdhfjd = 'hdhsjd'>\
            fjfjfjjfj\
        </p>\
        <p></p>\
    </p>\
</p>\
"

var tf = function(html){
    var ul = htmlReader.simpleReader(html);
    console.log(JSON.stringify(ul.attrs));
    if(ul.inner){
        console.log(ul.inner);
        tf(ul.inner);
    }
}

tf(txt);

const Stack = require('./Stack');
var s = new Stack();
s.push("dhdjfhjfhgd");
s.print();