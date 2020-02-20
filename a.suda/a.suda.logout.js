var xtable = require('./xtable');
var request = require('request');

var table_print = (body) => {
    var returnData = JSON.parse(body);
    var table = new xtable().setAlign(1,1);
    Object.keys(returnData).forEach(function (key) {
        table.addRow(key, '\x1B[35m'+returnData[key]+'\x1B[39m');
    });
    console.log(table.toString());
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

(function(){
    request.get("http://a.suda.edu.cn/index.php/index/logout",{},function(error, response, body){
        if (!error && response.statusCode == 200) {
            table_print(body);
            userGet();
        }else{
            console.log("请求失败:"+error);
        }
    });
}());