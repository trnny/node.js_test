var xTable = require("./xtable");

var styles = {
    'bold'          : ['\x1B[1m',  '\x1B[22m'],
    'italic'        : ['\x1B[3m',  '\x1B[23m'],
    'underline'     : ['\x1B[4m',  '\x1B[24m'],
    'inverse'       : ['\x1B[7m',  '\x1B[27m'],
    'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
    'white'         : ['\x1B[37m', '\x1B[39m'],
    'grey'          : ['\x1B[90m', '\x1B[39m'],
    'black'         : ['\x1B[30m', '\x1B[39m'],
    'blue'          : ['\x1B[34m', '\x1B[39m'],
    'cyan'          : ['\x1B[36m', '\x1B[39m'],
    'green'         : ['\x1B[32m', '\x1B[39m'],
    'magenta'       : ['\x1B[35m', '\x1B[39m'],
    'red'           : ['\x1B[31m', '\x1B[39m'],
    'yellow'        : ['\x1B[33m', '\x1B[39m'],
    'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
    'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG'       : ['\x1B[40m', '\x1B[49m'],
    'blueBG'        : ['\x1B[44m', '\x1B[49m'],
    'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
    'greenBG'       : ['\x1B[42m', '\x1B[49m'],
    'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
    'redBG'         : ['\x1B[41m', '\x1B[49m'],
    'yellowBG'      : ['\x1B[43m', '\x1B[49m']
};

/**
 * 
 * @param {string} str 字符串
 * @param {string} style 样式
 * @returns {string} 加样式后的字符串
 */
var str_style = (str, style) => {
    style = style || "white";
    return styles[style][0]+str+styles[style][1];
}

console.time("xtable");
var table = new xTable();
table.setHeading("","userName","password")
    .addRow("01","creating-t","1234567890abc")
    .addRow("xxxx","110","10086","false")
    .addRow("02","15895567150@gmail.com","123456")
    .setAlign(xTable.Body,xTable.Left);
console.log("01:没有标题,表头部分缺失,但前面的项需用空字符串(\"\")占位\n"+table.toString());

console.log("02:只有表干没有标题和表头\n"+new xTable().addRow("1","Bob","52").addRow("2","Trnny","19").addRow("3","crystle","20","sss").toString()); // 没有标题和表头，只有行

table = table.fromJSON({     // 从JSON对象创建表(此为实例方法，并非静态方法)
    title: str_style('xtable', "cyan")   // 表内文字可以加 style
    , heading: [ 'id', 'name', '', "年龄" ]   // 出现中文会导致表格不会很好的对齐(和显示的字体有关)
    , rows: [
        [ "1", 'Bob', '', '', "emmmmmm..." ]
        , [ "2", 'Jak', 'yes' ,'19' ]
        , [ "3", 'Steve' ]
    ]
});
console.log("03:从JSON(非静态)\n"+table.toString());

table = xTable.fromJSON({  // 从JSON对象创建表(此为静态方法)
    title: str_style('xtable', "cyan")
    , heading: [ 'id', 'name', '', "年龄" ]
    , rows: [
        [ "1", 'Bob', '', '', "emmmmmm..." ]
        , [ "2", 'Jak', 'yes' ,'19' ]
        , [ "3", 'Steve' ]
    ]
    , borders: {
        Top: "*"
        , Bottom: "~"
    }
});
console.log("03:从JSON(静态)\n"+table.toString());

table = new xTable("a text table!!")
    .setHeading("NO.", "name", "class", "pro", "age")
    .addRow('a', "tuhuawu123456", "3", "", "19")
    .addRow('b', "b'name", "b'class", "b'professional", 99)
    .setAlign(xTable.Body, xTable.Left)
    .setAlign(xTable.Head, xTable.Center)
    .setAlign(xTable.Title, xTable.Right)
    .setBorder(["-","|"," "]);
console.log("04:有标题且设置样式\n"+ table.toString());

console.log("05:只拥有标题的空表 (隐式调用toString()方法)\n"+ new xTable("only have a title").setMargin(5,0,1));

// console.log(table.toHTML("tab")+"\n");  // 转成HTML DOM字符串
console.timeEnd("xtable");


// console.log(new xTable().toString());
// console.log(table.clear().toString());
// console.clear();   // 在vscode里无效，在cmd里有效

// console.time("reg_ip");
// var str = "ashdskjhfdfkdshk[fjfdhfjkd5555dhdhd[127.0.0.1]dshgfhdskhfgka[]dhsjhfkds55.035fkdjsh0.25";
// var reg = /\d+\.\d+\.\d+\.\d/;
// console.log(str.match(reg));
// console.timeEnd("reg_ip");
