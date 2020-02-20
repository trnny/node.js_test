/**
 * curversion 在此方便修改检查更新
 */
var curversion = "0.0.0.8";  //  更新了文件写入问题 文件路径检测问题
/**
 * 该页为更新页
 */

window.onload = function(){
    // console.log(curversion);
    if(nuc_config.config.get("data_service_ip")) data_service_ip = nuc_config.config.get("data_service_ip");
    if(nuc_config.config.get("data_service_port")) data_service_port = nuc_config.config.get("data_service_port");
    checkUpdate_src = "http://"+data_service_ip+"/nuc/update";
    checkUpdate();
    if(nuc_config.config.get("remeber")){
        e_remember_ckb.checked = true;
        if(nuc_config.config.get('lastuid')){
            e_id_ipt.value = nuc_config.config.get('lastuid');
            if(nuc_config.config.get('password')){
                e_password_ipt.value = nuc_config.config.get('password');
                e_submit_btn.onclick();
            }
        }
    }
}