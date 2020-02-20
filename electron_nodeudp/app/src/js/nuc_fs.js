/**
 * 文件方面的操作 或者http的一些操作 提供更新的接口
 */
var fs = require('fs');
var request = require('request');
var path = require('path');
var os = require('os');
const crypto = require('crypto');  // 此处使用var会报错 可能是有另处使用该变量
/**
 * 
 *  全局对象 
 *          __dirname 当前执行脚本所在目录 结尾没有/     目前测试发现均为html所在目录
 *          __filename 表示当前正在执行的脚本的文件名
 */
var curversion = "0.0.0.4"; //  每次修改代码修改这个字符串 与服务器作对比(暂)

var EOL = os.EOL;
/**
 * 检查文件夹路径是否存在
 * @param {string} folderpath  传过来是绝对路径
 */
var checkDirExist=(folderpath)=>{
  if(fs.existsSync(folderpath)) return;    // 此时是绝对路径
  // 应该转为相对路径   ********************************************
  folderpath = path.relative(__dirname, folderpath);      //  此时是相对路径
  const pathArr=folderpath.split(/[\\/]/);
  let _path=__dirname;    //  ************************************
  for(let i=0;i<pathArr.length;i++){
    if(pathArr[i]){
      _path +=`${path.sep}${pathArr[i]}`;
      // console.log(_path);
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
      }
    }
  }
}
/**
 * 用get的方式将isrc目标保存到ssrc
 * @param {string} isrc 文件的http地址
 * @param {string} ssrc 文件需存放的地址  注意，必须是相对路径
 */
var get_Down = (isrc, ssrc)=>{
  ssrc = __dirname+path.sep+ssrc;  //  绝对路径
  checkDirExist(path.dirname(ssrc));  //   *******************
  request
    .get(isrc)
    .pipe(fs.createWriteStream(ssrc))   // 绝对路径写入 应该没问题 
    .on("error", (e) => {
      console.log(e.stack);
    });
}
/**
 * 获取目标文件的md5
 * @param {string} src 目标文件的路径
 */
var file_md5 = (src) => {  // 应该没问题
  var buffer = fs.readFileSync(__dirname+path.sep+src);
  var fsHash = crypto.createHash('md5');
  fsHash.update(buffer);
  return fsHash.digest('hex');
}

var checkUpdate_src = "";
var checkUpdate = function(){  // 从src检查文件更新
  request(checkUpdate_src, (err, res, body)=>{
    if(!err && res.statusCode == 200){
      if(!body){
        console.log("服务器有响应但无返回数据!!"); // 仅在debug下查看即可
        return;
      }
      var obj = JSON.parse(body);
      if(obj){
        if(obj.curversion != curversion){
          // 要更新
          TU.alert('正在更新,请留意更新结果通知',{moveable:true,topCenter:true,timeOut:1500});
          var _files = obj.files;
          var _add = 0, _change = 0;
          _files.forEach((v)=>{
            if(!fs.existsSync(__dirname+path.sep+v.f_src)){   //  应该没问题
              get_Down(v.w_src, v.f_src);
              _add++;
            }else{
              if(file_md5(v.f_src) != v.md5){
                get_Down(v.w_src, v.f_src);  // 传入的是相对路径，应该没问题
                _change++;
              }
            }
          });
          TU.confirm(`检查更新完毕!新增${_add}项 更改${_change}项\n点击确定重启`,{
            topCenter:true,
            shadow: true,
            onconfirm: ()=>{
              // 重启
              location.replace(location.href);  // 伪重启
            },
            onclose: ()=>{
              // 不重启
            }
          });
        }else{
          // 是最新版本
          // console.log('是最新版本...');
        }
      }else{
        TU.confirm("检查更新失败!\n请修改服务器地址后重试~",{
          moveable: true,
          onconfirm: function(){
            checkUpdate();
          },
          onclose: ()=>{
            TU.alert('检查更新失败!\n程序可能无法正常运行~',{
              topCenter: true
            })
          }
        });
      }
    }else{
      TU.alert('服务器错误...\n请更换服务器地址后重试',{moveable:true});
    }
  })
}


var nuc_cache = {};         // 保存方法和变量的容器
nuc_cache.caList = [];      // 已写入
nuc_cache.raList = [];      // 还未写入
nuc_cache.path_c = null;    // 保存的文件夹路径
nuc_cache.path_f = null;    // 保存的文件的路径
nuc_cache.s_id = null;      // 
nuc_cache.max_buffer = 30;  // 最多缓存
nuc_cache.max_log = 1000;   // 最多纪录
nuc_cache.max_save = 2000;  // 最大保存 纪录到2000以后 清除前1000条记录后1000条
nuc_cache.number = 0;       // 纪录的编号

nuc_cache.init = (uid)=>{
  uid = uid || "username";
  nuc_cache.path_c = __dirname + path.sep + "cache" + path.sep + uid + path.sep ;   // 绝对路径
  nuc_cache.path_f = nuc_cache.path_c + 'log1.txt';
  checkDirExist(nuc_cache.path_c);
  if(!fs.existsSync(nuc_cache.path_f)){
      fs.writeFileSync(nuc_cache.path_f,"");
  }
  nuc_cache.read();
}
nuc_cache.read = ()=>{
  nuc_cache.caList = fs.readFileSync(nuc_cache.path_f).toString().trim().split(EOL);  // 空时会返回一个长度为1数组 空
  nuc_cache.number = nuc_cache.parseLine(nuc_cache.caList[nuc_cache.caList.length-1])[3] || 0;
  nuc_cache.number = nuc_cache.number * 1;
}
nuc_cache.parse = ()=>{
}
/**
 * @param {string} str 要解析的字符串 不能为空
 */
nuc_cache.parseLine = (str)=>{
  return str.substring(1, str.length-1).split('][');
}

/**
 * 将保存在数组中的记录写入文件 返回写入长度
 */
nuc_cache.save = ()=>{
  var str = '';
  var len = nuc_cache.raList.length;
  nuc_cache.raList.forEach((v)=>{
      if(!v) return;
      str += v + EOL;
      nuc_cache.caList.push(v);
  });
  nuc_cache.raList = [];  // 清空
  if(str) fs.writeFileSync(nuc_cache.path_f,str,{flag:'a'});
  // console.log(`${len}条记录已保存 已有${nuc_cache.caList.length}条记录`);
  nuc_cache.clean_old();
  return len;
}
nuc_cache.resave = ()=>{    // 将所有数据重新保存  // 比如中间有记录被删除时
}
nuc_cache.clean_old = ()=>{
  if(nuc_cache.caList.length >= nuc_cache.max_save){
      var _cl = nuc_cache.max_save - nuc_cache.max_log;
      nuc_cache.caList.splice(0, _cl);
      var _calist = [];
      nuc_cache.number = 0;
      var str = "";
      nuc_cache.caList.forEach((v)=>{
          if(!v) return;
          var li = nuc_cache.parseLine(v);
          var lo = `[${li[0]}][${li[1]}][${li[2]}][${++nuc_cache.number}][${li[4]}]`;
          str += lo + EOL;
          _calist.push(lo);
      });
      nuc_cache.caList = _calist;
      if(str) fs.writeFileSync(nuc_cache.path_f, str);
  }
}

nuc_cache.search = (function(){
  return {
      byUid: (uid)=>{ // 返回数组  结尾坐标
          uid = (uid || 0) + "";
          var res = [];
          nuc_cache.caList.forEach((v, i)=>{
              if(!v) return;
              var li = nuc_cache.parseLine(v);
              if(li[2]==uid){
                  li.push(i);
                  res.push(li);
              }
          });
          nuc_cache.raList.forEach((v, i)=>{
              if(!v) return;
              var li = nuc_cache.parseLine(v);
              if(li[2]==uid){
                  li.push(i+nuc_cache.caList.length);
                  res.push(li);
              }
          });
          return res;
      },
      byUids: (uids)=>{   // 返回对象
          var res = {};
          uids.forEach((v, i)=>{
              uids[i] = (v || 0) + "";
              res[uids[i]] = [];
          });
          nuc_cache.caList.forEach((v, i)=>{
              if(!v) return;
              var li = nuc_cache.parseLine(v);
              if(res[li[2]]){
                  li.push(i);
                  res[li[2]].push(li);
              }
          });
          nuc_cache.raList.forEach((v, i)=>{
              if(!v) return;
              var li = nuc_cache.parseLine(v);
              if(res[li[2]]){
                  li.push(i);
                  res[li[2]].push(li);
              }
          });
          return res;
      },
      lastIndex: 0,
      byNumber: (number)=>{
          var res;
          if(number >= nuc_cache.caList.length){
              nuc_cache.raList.forEach((v, i)=>{
                  if(!v) return;
                  var li = nuc_cache.parseLine(v);
                  if(number == li[3]*1){
                      res = li;
                      this.lastIndex = nuc_cache.caList.length + i;
                      res.push(this.lastIndex);
                  }
              });
              if(res) return res;
          }else{
              var i = number - 1;
              i = i < nuc_cache.caList.length ? i : nuc_cache.caList.length - 1;
              for(;i>=0;i--){
                  if(!nuc_cache.caList[i]) return;
                  var li = nuc_cache.parseLine(nuc_cache.caList[i]);
                  if(number == li[3]*1){
                      this.lastIndex = i;
                      li.push(i);
                      return li;
                  }
              }
          }
          return null;
      }
  }
})();
nuc_cache.log = (obj)=>{
  if(nuc_cache.raList.push(`[${obj.date}][${obj.type}][${obj.uid}][${++nuc_cache.number}][${obj.inner}]`) >= nuc_cache.max_buffer){
      nuc_cache.save();
  }
}
nuc_cache.recv = (uid, date, msg)=>{
  nuc_cache.log({date: date, type: "recv", uid: uid, inner: msg});
}
nuc_cache.send = (uid, date, msg)=>{
  nuc_cache.log({date: date, type: "send", uid: uid, inner: msg});
}

// 用户登录成功后 init(uid)
// 用户退出登录后 save()
// 消息的清理暂时没有完成

var nuc_config = {};
nuc_config._config = {};
nuc_config._data = {};
nuc_config.config_dir = null;
nuc_config.config_path = null;
nuc_config.data_path = null;
nuc_config.s_id = null;

nuc_config.init = ()=>{
  nuc_config.config_dir = __dirname + path.sep + 'config' + path.sep;
  nuc_config.config_path = nuc_config.config_dir + 'config.json';
  nuc_config.data_path = nuc_config.config_dir + 'data.json';
  checkDirExist(nuc_config.config_dir);
  if(!fs.existsSync(nuc_config.config_path)){
      fs.writeFileSync(nuc_config.config_path,"");
  }
  if(!fs.existsSync(nuc_config.data_path)){
      fs.writeFileSync(nuc_config.data_path,"");
  }
  nuc_config.read();
}
nuc_config.read = ()=>{
  var _c = fs.readFileSync(nuc_config.config_path).toString().trim();
  if(_c){
      nuc_config._config = JSON.parse(_c);
  }
  var _d = fs.readFileSync(nuc_config.data_path).toString().trim();
  if(_d){
      nuc_config._data = JSON.parse(_d);
  }
}
nuc_config.config = (function(){
  return {
      get: (key)=>{
          key = (key || 0) + "";
          return nuc_config._config[key] || false;
      },
      set: function(key, value){
          if(arguments.length == 2){
              if(typeof key == 'string'){
                  nuc_config._config[key] = value;
                  // this.save();
              }else if(typeof key == 'object' && Array.isArray(key)){
                  key.forEach((v)=>{
                      nuc_config._config[v] = value;
                  });
                  this.save();  // 暂时设置自动保存
              }
          }
      },
      save: ()=>{
          var _s = JSON.stringify(nuc_config._config);
          fs.writeFileSync(nuc_config.config_path, _s);
      }
  }
})();
nuc_config.data = (function(){
  return {
      get: (uid)=>{
          uid = (uid || 0) + "";
          return nuc_config._data[uid] || {};
      },
      set: function(...arg){
          if(arguments.length > 1){
              var _o = nuc_config._data;
              for(var i = 0;i<arguments.length - 2;i++){
                  var _arg = arguments[i]+"";
                  _o[_arg] = typeof _o[_arg] == 'object' ? _o[_arg] : {};
                  _o = _o[_arg];
              }
              _o[arguments[arguments.length -2]+""] = arguments[arguments.length - 1];
              // this.save();  // 暂时不设置自动保存
          }
      },
      save: ()=>{
          var _s = JSON.stringify(nuc_config._data);
          fs.writeFileSync(nuc_config.data_path, _s);
      }
  }
})();
nuc_config.save = ()=>{   // 可能用不到
  nuc_config.data.save();
  nuc_config.config.save();
}
nuc_config.init();

///////  *******************  ************** 3.28更新 ***************** // //// 
var boundaryKey = Math.random().toString(16);

/**
 * 
 * @param {object} form {key: 'value'}
 */
var form2formData = (form)=>{
    var str = '';
    Object.keys(form).forEach((v)=>{
        if(!(typeof form[v] == 'string' || typeof form[v] == 'number' || typeof form[v] == 'boolean')) return;
        str += `--${boundaryKey}\r\n`  //  头
            +  `Content-Disposition: form-data;name="${v}"\r\n\r\n`  // 键  (注意,是两对`\r\n`)
            +  `${form[v]}`            // 值
            +  `\r\n--${boundaryKey}--\r\n`;    // 尾
    });
    return new Buffer(str);
}
/**
 * 
 * @param {Array} files 
 * files[] {name: 'field', filename: 'filename', fileBuffer: Buffer}
 */
var files2formData = (files)=>{
    var _front = `--${boundaryKey}\r\n`;
    var _tail = `\r\n--${boundaryKey}--\r\n`;
    var _buf = new Buffer(0);
    files.forEach((v)=>{
        if(!(typeof v.name == 'string' && typeof v.filename == 'string' && Buffer.isBuffer(v.fileBuffer))) return;
        var _d = `Content-Type:application/octet-stream\r\nContent-Disposition: form-data;name="${v.name}";filename="${v.filename}"\r\n`;
        var _f_buf = new Buffer(_front + _d);
        var _e_buf = new Buffer(_tail);
        _buf = Buffer.concat([_buf, _f_buf, v.fileBuffer, _e_buf]);
    });
    return _buf;
}

/**
 * 用POST传表单
 * @param {object} form_opt 
 * @param {object} request_opt 
 * @param {function} callback (`err`, `res`, `body`)=>{}
 */
var TUPostAsync = (form_opt, request_opt, callback)=>{
    boundaryKey = Math.random().toString(16);       // 更新一下
    var _buf = new Buffer(0);
    if(Array.isArray(form_opt.files)){     // 数组 有 name, filename, fileBuffer
        _buf = Buffer.concat([_buf, files2formData(form_opt.files)]);
    }
    if(typeof form_opt.form == 'object'){
        _buf = Buffer.concat([_buf, form2formData(form_opt.form)]);
    }
    var opt = {method: 'POST'};
    opt.url = request_opt.url;
    opt.headers = request_opt.headers || {};
    opt.headers['Content-Type'] = 'multipart/form-data; boundary='+boundaryKey;
    opt.body = _buf;
    request(opt, (err, res, body)=>{typeof callback == 'function' && callback(err, res, body);});
}