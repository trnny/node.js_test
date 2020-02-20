var request = require('request');
var fs = require('fs');
var xtable = require('./xtable');
var userdata;

var table_print = (body) => {
    var returnData = JSON.parse(body);
    var table = new xtable().setAlign(1,1);
    Object.keys(returnData).forEach(function (key) {
        table.addRow(key, '\x1B[35m'+returnData[key]+'\x1B[39m');
    });
    console.log(table.toString());
}

fs.readFile("data.json", function(err, data){
    if(err){
        console.log("文件data.json出错");
        return console.error(err);
    }
    userdata = JSON.parse(data.toString());
    userdata = formatdata(userdata);
    console.log("用户"+userdata.username+"正在登陆,请稍等...");
    userPost();
})

function formatdata(userdata){
    var returndata = new Object();
    returndata.username = userdata.username;
    returndata.password = base64encode(userdata.password);
    returndata.domain = userdata.username.length == 10 ? "" : "cmcc-suzhou";  // 学号10位 自动选择校园网登陆
    returndata.enablemacauth = 0;
    return returndata;
}

function userPost(){
    request.post('http://a.suda.edu.cn/index.php/index/login',
        {
            form:userdata
        },
        function(error, response, body){
            if (!error && response.statusCode == 200) {
                table_print(body);
                userGet();
            }else{
                console.log("请求失败:"+error);
            }
        }
    );
}

function userGet(){
    request.get("http://a.suda.edu.cn/index.php/index/init",{},function(error, response, body){
        if (!error && response.statusCode == 200) {
            table_print(body);
        }else{
            console.log("请求失败:"+error);
        }
    });
}

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
         c1 = str.charCodeAt(i++) & 0xff;
         if(i == len)
         {
             out += base64EncodeChars.charAt(c1 >> 2);
             out += base64EncodeChars.charAt((c1 & 0x3) << 4);
             out += "==";
             break;
         }
         c2 = str.charCodeAt(i++);
         if(i == len)
         {
             out += base64EncodeChars.charAt(c1 >> 2);
             out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
             out += base64EncodeChars.charAt((c2 & 0xF) << 2);
             out += "=";
             break;
         }
         c3 = str.charCodeAt(i++);
         out += base64EncodeChars.charAt(c1 >> 2);
         out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
         out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
         out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
         /* c1 */
         do {
             c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
         } while(i < len && c1 == -1);
         if(c1 == -1)
             break;
         /* c2 */
         do {
             c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
         } while(i < len && c2 == -1);
         if(c2 == -1)
             break;
         out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
         /* c3 */
         do {
             c3 = str.charCodeAt(i++) & 0xff;
             if(c3 == 61)
          return out;
             c3 = base64DecodeChars[c3];
         } while(i < len && c3 == -1);
         if(c3 == -1)
             break;
         out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
         /* c4 */
         do {
             c4 = str.charCodeAt(i++) & 0xff;
             if(c4 == 61)
          return out;
             c4 = base64DecodeChars[c4];
         } while(i < len && c4 == -1);
         if(c4 == -1)
             break;
         out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}