/**
 * 变量声明
 */
var curversion = "0.0.0.3";
var deversion = "0.0.0.2";
var curip = "10.70.66.115";
var http_root = "http://"+curip+"/nuc/file?url=";
var nuc_root = 'app/';
var update_json_path = './update.json';
var ignore_file = [];       // 在文件夹遍历时选择忽略的文件的路径
var update_file = [];       // 在列表遍历时需遍历的文件的路径
var obj = {
    files: [],
    curversion: curversion,  // 最新版本
    deversion: deversion,   // 最低版本要求
}
var _up = 0;            // 改动 (遍历时即时原文件一点不变也算)
var _add = 0;           // 新增
var _wait = false;      // 等待遍历结束
/**
 * 模块引入
 */
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
/**
 * 初始化
 */
var init = ()=>{
    console.time('update');
    _up = 0;
    _add = 0;
    _wait = false;
    var _obj = JSON.parse(fs.readFileSync(update_json_path));
    if(_obj.curversion) obj.curversion = _obj.curversion;
    if(_obj.deversion) obj.deversion = _obj.deversion;
    if(_obj.files) obj.files = _obj.files;
}
init();
/**
 * 
 * @param {string} src 
 */
var file_md5 = (src) => {
    var buffer = fs.readFileSync(nuc_root + src);   // 被检测文件的目录
    var fsHash = crypto.createHash('md5');
    fsHash.update(buffer);
    return fsHash.digest('hex');
}
// var _obj = {
//   files: [{
//     md5: "",
//     f_src: "",  // 文件应该存在的位置
//     w_src: "",  // 文件的下载链接
//   }],
//   curversion: ""
// }
var file = function(src){ 
    return {
        md5: file_md5(src),
        w_src: http_root + src,
        f_src: src
    };
}
var add_to_obj = (file)=>{
    var f = true;
    for(var i =0;i<obj.files.length;i++){
        if(!path.relative(obj.files[i].f_src, file.f_src)){
            obj.files[i] = file;
            _up ++;
            f = false;
            break;
        }
    }
    if(f) {obj.files.push(file);_add++;}
}
var isIgnoreFile = (src)=>{
    var _is = false;
    ignore_file.forEach((v)=>{
        if(!path.relative(v,src))  // 路径相同
            _is = true
    });
    return _is;
}
var add_update_file = (file_path)=>{
    update_file.push(nuc_root + file_path);
}
var add_ignore_file = (file_path)=>{
    file_path = file_path || '';
    ignore_file.push(nuc_root + file_path);
}
var setDeVersion = (v)=>{
    deversion = v;
    obj.deversion = deversion;
}
var setCurVersion = (v)=>{
    curversion = v;
    obj.curversion = curversion;
}
var setCurIp = (ip)=>{
    curip = ip;
    http_root = "http://"+curip+"/nuc/file?url=";
}
var fina_callback;
var set_fina_callback = (callback)=>{
    fina_callback = callback;
}
/**
 * 遍历更新目标文件夹中全部文件
 * @param {string} update_path 启动的目录 以`nuc_root`作根目录
 */
var all_update = (update_path)=>{
    _wait = true;
    var c = 0;
    var readdir = (_path)=>{
        if(!fs.lstatSync(_path).isDirectory()) return;
        if(isIgnoreFile(_path)) return ;
        c++;
        fs.readdir(_path, (err, files)=>{
            if(err) return console.error(err);
            if(isIgnoreFile(_path)) return ;
            files.forEach( (filename) => {
                var p = (_path[_path.length-1] == '/' ? _path : _path + '/') + filename;
                if(isIgnoreFile(p)) return;
                if(fs.lstatSync(p).isDirectory()) {
                    return readdir(p);
                }
                // 符合的文件
                add_to_obj(file(path.relative(nuc_root, p)));
            });
            if(--c == 0){
                fina_callback && fina_callback();  // 遍历结束
                _wait = false;      // 可有可无 ,异步，一定后执行到这里
            }
        });
    }
    update_path = update_path || "";
    readdir(nuc_root + update_path);
}
/**
 * 更新添加到更新列表里的文件
 */
var list_update = ()=>{
    update_file.forEach((v)=>{  // 在添加时已经是加上`nuc_path`了
        if(fs.lstatSync(v).isDirectory()) return;
        add_to_obj(file(path.relative(nuc_root, v)));
    });
    !_wait && fina_callback && fina_callback();
}

var _fina = function(){
    console.log('serverIp', curip, "\ncurVersion", curversion, "\ndeVersion", deversion, "\nup", _up, " add", _add, "\ntottle", obj.files.length);
    fs.writeFileSync(update_json_path, JSON.stringify(obj));
    console.timeEnd('update');
}

var _test = function(){
    console.log(JSON.stringify(obj));
}

//  Worker 0 通用改动

setCurIp("10.70.66.115");
setCurVersion("0.0.0.9");
setDeVersion("0.0.0.1");
set_fina_callback(_fina);

//  Worker 1 大量代码改动       添加为忽略更新

// add_ignore_file('src/img/head/');
// add_ignore_file('src/img/');
// add_ignore_file('src/css/');
// add_ignore_file('src/js/')
// add_ignore_file('view.html');
// add_ignore_file('udmsg.js');
// add_ignore_file('main.js');
// add_ignore_file();                                  // 全部忽略
// all_update();

//  Worker 2 少量代码改动       添加为需要更新

add_update_file('src/js/nuc_up.js');        //  一般该文件都需引入
// add_update_file('src/img/head/head_default.png');
// add_update_file('src/img/settings.png');
add_update_file('src/js/view.js');
list_update();

// 