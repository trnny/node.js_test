<?php
// http://xxxxxx/nuc/update/check

namespace app\controllers;

use fastphp\base\Controller;
// use app\models\NucModel;

//ini_set("error_reporting","E_ALL & ~E_NOTICE");
 
class NucController extends Controller
{
    // 获取用户头像
    public function head()
    {
        $uid = isset($_GET['uid']) ? $_GET['uid'] : '';
        $size = empty($_GET['size']) ? '48' : $_GET['size'];
        $img_src = APP_PATH . 'app/views/' . $this->_controller . '/files/head/head_' . $size . '_' . $uid . '.png';
        if(is_file($img_src)){
            @ header("Content-Type:image/png;charset=utf-8");
            echo file_get_contents($img_src);
        }else{
            header("HTTP/1.1 404 Not Found");
            header("Status: 404 Not Found");
            exit;
        }
    }
    
    // 获取更新信息
    public function update()
    {
        $update_path = APP_PATH . 'app/views/' . $this->_controller . '/files/update/update.json';
        if(is_file($update_path)){
            @header('Content-type: text/plain');
            echo file_get_contents($update_path);
        }else{
            header("HTTP/1.1 404 Not Found");
            header("Status: 404 Not Found");
            exit;
        }
    }

    // 获取更新文件
    public function file(){  // src\js\vmsgb.js  // src\img\head\head_default.png
        if(!empty($_GET['url'])){
            $file_path = APP_PATH . 'app/views/' . $this->_controller . '/files/update/app/' . $_GET['url'];
            if(is_file($file_path)){
                @header('Content-type: text/plain');
                echo file_get_contents($file_path);
            }else{
                header("HTTP/1.1 404 Not Found");
                header("Status: 404 Not Found");
                exit;
            }
        }
    }

    public function upload($arg){
        $arg_1 = empty($arg) ? "" : $arg[0];
        if(isset($_FILES['file'])){
            $filedir = APP_PATH . "app/views/$this->_controller/files/$arg_1";
            foreach($_FILES['file'] as $name => $value){
                echo "$name: $value\n";
            }
            $file=$_FILES['file'];
            //获取文件名
            $fileName=$file['name'];
            //移动文件到当前目录 
            move_uploaded_file($file['tmp_name'],$filedir. $fileName);
        }
        if(isset($_FILES['media'])){
            echo "media\n";
            foreach($_FILES['media'] as $name => $value){
                echo "$name: $value\n";
            }
        }
        if($arg_1 == "head"){
            if(isset($_POST['uid']) && isset($_POST['base64'])){
                $fname = APP_PATH . "app/views/$this->_controller/files/head/head_48_".$_POST['uid'].".png";
                $image = $_POST['base64'];
                if (strstr($image,",")){
                    $image = explode(',',$image);
                    $image = $image[1];
                }
                $r = file_put_contents($fname, base64_decode($image));//返回的是字节数
                if (!$r) {
                    $tmparr1=array('data'=>null,"code"=>1,"msg"=>"图片生成失败");
                    echo json_encode($tmparr);
                }else{
                    $tmparr2=array('data'=>1,"code"=>0,"msg"=>"图片生成成功");
                    echo json_encode($tmparr2);
                }
            }
        }
    }
}
