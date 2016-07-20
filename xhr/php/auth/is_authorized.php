<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/cgi-root/supermarcus/PiController.php";

$main = \supermarcus\PiController::getInstance();
$main->sendResult($main->getCurrentSession()->isAuthorized());
