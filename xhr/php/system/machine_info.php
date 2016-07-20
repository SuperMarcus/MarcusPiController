<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/cgi-root/supermarcus/PiController.php";

$main = \supermarcus\PiController::getInstance();
if($main->getCurrentSession()->isAuthorized()){
    $main->sendResult([
        \supermarcus\Constants::PI_NAME,
        \supermarcus\util\Utils::getSystemStartUpTime()
    ]);
}else{
    $main->sendResult([\supermarcus\Constants::PI_NAME]);
}
