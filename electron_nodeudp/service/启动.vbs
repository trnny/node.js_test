server_dir = createobject("Scripting.FileSystemObject").GetFolder(".").Path&"\"
'Wscript.echo server_dir
start_data_bat_path = server_dir&"�������ݷ�����.bat"
start_route_bat_path = server_dir&"����·�ɷ�����.bat"
CreateObject("WScript.Shell").Run start_data_bat_path,0,false '�����ҷǹ���
WScript.Sleep 1000 ' ��1s
CreateObject("WScript.Shell").Run start_route_bat_path,0,false
CreateObject("WScript.Shell").PopUp"2����Զ��ر���ʾ",2,"�����������ɹ�",0+64 '3����Զ��ر�