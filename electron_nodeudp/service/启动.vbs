server_dir = createobject("Scripting.FileSystemObject").GetFolder(".").Path&"\"
'Wscript.echo server_dir
start_data_bat_path = server_dir&"启动数据服务器.bat"
start_route_bat_path = server_dir&"启动路由服务器.bat"
CreateObject("WScript.Shell").Run start_data_bat_path,0,false '隐身且非挂起
WScript.Sleep 1000 ' 等1s
CreateObject("WScript.Shell").Run start_route_bat_path,0,false
CreateObject("WScript.Shell").PopUp"2秒后将自动关闭提示",2,"服务器启动成功",0+64 '3秒后自动关闭