::echo %~dp0
@cd /d %~dp0
node a.suda.login.js
@TIMEOUT /T 3
::等待3秒自动关闭或点击任意键关闭
::pause