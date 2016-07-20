<?php
namespace supermarcus;
require_once "util/AutoLoader.php";

use supermarcus\session\WebSession;
use supermarcus\util\AutoLoader;

class PiController{
    const MODE_XHR = 0;

    protected static $instance = null;
    protected static $mode = self::MODE_XHR;

    /**
     * @return PiController
     */
    public static function getInstance(){
        return static::$instance ? static::$instance : static::$instance = new PiController();
    }

    public static function getMode(){
        return static::$mode;
    }

    /** @var AutoLoader */
    private $loader;

    /** @var WebSession */
    private $session;

    public function __construct(){
        $this->loader = new AutoLoader();
        $this->getClassLoader()->register();
        @set_error_handler([$this, "onError"], E_ALL|E_STRICT);
    }

    public function sendResult($data){
        $ret = new XHRResult($data);
        $ret->sendJSONFormattedResult();
    }

    public function sendFail($message = ""){
        $ret = new XHRResult(null, false, $message);
        $ret->sendJSONFormattedResult();
    }

    public function sendOK($message = ""){
        $ret = new XHRResult(null, true, $message);
        $ret->sendJSONFormattedResult();
    }

    public function getCurrentSession(){
        return $this->session ? $this->session : $this->session = new WebSession();
    }

    public function onError($code, $str, $file, $line, $context){
        switch(static::$mode){
            case self::MODE_XHR:
                $this->sendFail("Error occurred when executing script \"".$file."\" on line ".$line.": [".$code."] ".$str.", trace: ".((new \Exception())->getTraceAsString()));
                break;
            default:
                echo "Error occurred when executing script \"".$file."\" on line ".$line.": [".$code."] ".$str.", trace: ".((new \Exception())->getTraceAsString());
        }
        return true;
    }

    /**
     * @return AutoLoader
     */
    public function getClassLoader(){
        return $this->loader;
    }
}
