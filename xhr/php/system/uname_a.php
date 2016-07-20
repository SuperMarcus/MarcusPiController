<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/cgi-root/supermarcus/PiController.php";

$main = \supermarcus\PiController::getInstance();
\supermarcus\util\Utils::requireAuthenticated();

$handle = @\popen("/usr/bin/env uname -a", 'r');
$unameResult = @\stream_get_contents($handle, 2048);
@\fclose($handle);
$main->sendResult($unameResult);
