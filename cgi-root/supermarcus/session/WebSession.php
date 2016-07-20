<?php
namespace supermarcus\session;

class WebSession{
    public function __construct(){
        session_start();
        if(!$this->contains("auth"))$this->put("auth", false);
    }

    public function isAuthorized(){
        return (bool) $this->get("auth");
    }

    public function setAuthorized($v){
        $this->put("auth", $v);
    }

    public function put($k, $v){
        $_SESSION[$k] = $v;
    }

    public function remove($k){
        unset($_SESSION[$k]);
    }

    public function get($k){
        return $_SESSION[$k];
    }

    public function contains($k){
        return isset($_SESSION[$k]);
    }
}