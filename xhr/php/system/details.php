<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/cgi-root/supermarcus/PiController.php";

$main = \supermarcus\PiController::getInstance();
\supermarcus\util\Utils::requireAuthenticated();

$handle = @\popen("/usr/bin/env ps aux", 'r');
$process = [];
@\fgets($handle);
while(!@\feof($handle)){
    $split = \explode(' ', @\fgets($handle));
    if(\count($split) > 10){
        $proc = [];
        foreach($split as $item){
            if($item !== ""){
                if(\count($proc) <= 10){
                    $proc[] = $item;
                }else{
                    $proc[10] .= $item.' ';
                }
            }
        }
        $proc[10] = \trim($proc[10]);
        $process[] = $proc;
    }
}
@\pclose($handle);

$handle = @\fopen("/proc/meminfo", 'r');
$meminfo = [];
while(!@\feof($handle)){
    $item = \explode(':', @\fgets($handle));
    if(\count($item) == 2){
        $meminfo[$item[0]] = \intval(\trim(\str_replace("kb", '', strtolower($item[1]))));
    }
}
@\fclose($handle);

$boardTemp = \intval(\file_get_contents("/sys/class/thermal/thermal_zone0/temp")) / 1000;

$main->sendResult([$process, $meminfo, $boardTemp]);
