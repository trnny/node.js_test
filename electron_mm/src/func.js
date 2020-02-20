var mainBlock = document.getElementById("mainBlock"),
    prevBtn = document.getElementById("btn_p"),
    quitBtn = document.getElementById("btn_q"),
    ppcgBtn = document.getElementById("btn_c"),
    nextBtn = document.getElementById("btn_n"),
    Mhtitle = document.getElementById("M_title"),
    Mproblk = document.getElementById("M_progress"),
    Mprobar = document.getElementById("M_progress_left"),
    Mplayer = document.getElementById("M_player"),
    ThemeLink = document.getElementById("theme");

var playBtn = ppcgBtn.children[0],
    pauseBtn = ppcgBtn.children[1];

var cycleBtn = document.getElementById("cycleBtn").children[0];
var currentModel = 0;

cycleBtn.children[currentModel].style.display = "block";

mainBlock.addEventListener("mouseover", function(){
    quitBtn.style.display = "block";
    cycleBtn.style.display = "block";
});

mainBlock.addEventListener("mouseout", function(){
    quitBtn.style.display = "none";
    cycleBtn.style.display = "none";
});

cycleBtn.addEventListener("click", function(){
    cycleBtn.children[currentModel].style.display = "none";
    currentModel = ++currentModel < cycleBtn.children.length ? currentModel : 0;
    cycleBtn.children[currentModel].style.display = "block";
});

var musicList = [],  //歌曲url的列表
    musicNameList = [];  //歌曲名的列表

if(typeof require=="function"){
    var fs = require('fs');
    var path = require('path');
    var os = require('os');

    var filePath = path.resolve(os.homedir()+'/Music');

    fileDisplay(filePath, function(){
        total = musicList.length;
        if(musicList.length > 0){
            Mplayer.src = musicList[current];  //初始化加载歌曲
            Mhtitle.innerText = musicNameList[current];
        }
    });

    function fileDisplay(filePath, callback){
        fs.readdir(filePath,function(err,files){
            if(err){
                console.warn(err);
            }else{
                var count = 0;
                var checkEnd = function(){
                    ++count == files.length && callback();
                }
                files.forEach(function(filename){
                    var filedir = path.join(filePath,filename);
                    fs.stat(filedir,function(eror,stats){
                        if(eror){
                            console.warn('获取文件stats失败');
                        }else{
                            var isFile = stats.isFile();
                            var isDir = stats.isDirectory();
                            if(isFile){
                                if(filedir.slice(-4)==".mp3"){
                                    musicList.push(filedir);
                                    musicNameList.push(filename.slice(0, filename.length - 4));
                                }
                                checkEnd();
                            }
                            if(isDir){
                                fileDisplay(filedir);
                            }
                        }
                    })
                });
            }
        });
    };
}else{
    console.log("请检测当前运行环境");
    var script = document.createElement("script");
    script.src = "http://127.0.0.1/test/jsonp/musicList.jsonp";
    document.body.insertBefore(script, document.body.firstChild);
    function handleResponse(response){
        for(var i = 0;i < response.musicList.length && i < response.musicNameList.length;i++){
            musicList.push(response.musicList[i]);
            musicNameList.push(response.musicNameList[i]);
        }
        total = musicList.length;
        if(musicList.length > 0){
            Mplayer.src = musicList[current];  //初始化加载歌曲
            Mhtitle.innerText = musicNameList[current];
        }
    }
}

playBtn.style.display = "block";
pauseBtn.style.display = "none";
ThemeLink.href = "src/theme-color.css";

var total = 0,  //总歌曲数
    current = 0;  //当前播放
var regetProgress;  //获取播放进度的计时器

var palyAndPause = function(){
    if(Mplayer.readyState == 4){
        if(Mplayer.paused){
            Mplayer.play();
        }else{
            Mplayer.pause();
        }
    }
};

var playPrev = function(){
    current = --current < 0 ? total - 1 : current;
    Mplayer.src = musicList[current];
    Mhtitle.innerText = musicNameList[current];
    Mplayer.play();
};

var playNext = function(){
    current = ++current < total ? current : 0;
    Mplayer.src = musicList[current];
    Mhtitle.innerText = musicNameList[current];
    Mplayer.play();
};

Mplayer.onplaying = function(){
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
    regetProgress = setInterval(function(){
        Mprobar.style.width = Mplayer.currentTime/Mplayer.duration*100 + '%';
    },500);
};

Mplayer.onpause = function(){
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
    clearInterval(regetProgress);
};

Mplayer.onended = function(){
    switch(currentModel){
    case 0:
        break;
    case 1:
        current < total - 1 && playNext();
        break;
    case 2:
        current = parseInt(Math.random()*total);
        Mplayer.src = musicList[current];
        Mhtitle.innerText = musicNameList[current];
        Mplayer.play();
        break;
    case 3:
        playNext();
        break;
    default:
        Mplayer.play();
    }
};

ppcgBtn.addEventListener("click", function(){
    Mplayer.readyState == 4 && palyAndPause();
});

quitBtn.addEventListener("click", function(){
    window.close();
});

nextBtn.addEventListener("click", function(){
    Mplayer.readyState == 4 && playNext();
});

prevBtn.addEventListener("click", function(){
    Mplayer.readyState == 4 && playPrev();
});

Mproblk.addEventListener("click", function(event){
    var e = event || window.event;
    var x = e.clientX - Mproblk.offsetLeft - mainBlock.offsetLeft;
    Mprobar.style.width = x + 'px';
    if(Mplayer.readyState == 4){
        Mplayer.currentTime = x/Mproblk.clientWidth*Mplayer.duration;
    }
});