<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/cgi-root/supermarcus/PiController.php";

$main = \supermarcus\PiController::getInstance();
if(!$main->getCurrentSession()->isAuthorized()){
    $username = \supermarcus\util\Utils::requireElement($_POST, "username");
    $password = \supermarcus\util\Utils::requireElement($_POST, "password");

    if(!isset(\supermarcus\Constants::$userList[$username]) or \supermarcus\Constants::$userList[$username] !== $password){
        $main->sendFail("Username or password incorrect");
    }
}
$main->getCurrentSession()->setAuthorized(true);
$main->sendOK();
