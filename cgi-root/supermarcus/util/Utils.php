<?php
namespace supermarcus\util;


use supermarcus\PiController;

class Utils{
    /**
     * @param string $path
     *
     * @return string
     */
    public static function requireDirectory($path){
        if(\is_dir($path)){
            return $path;
        }else{
            throw new \InvalidArgumentException("Argument '".$path."' must be the path of a directory");
        }
    }

    /**
     * @param string $path
     *
     * @return string
     */
    public static function requireFile($path){
        if(\is_file($path)){
            return $path;
        }else{
            throw new \InvalidArgumentException("Argument '".$path."' must be the path of a file");
        }
    }

    public static function requireAuthenticated(){
        if(!PiController::getInstance()->getCurrentSession()->isAuthorized()){
            PiController::getInstance()->sendFail("Not authorized");
        }
    }

    /**
     * @param string $root
     * @param string $child
     *
     * @return string
     */
    public static function pathAppendChild($root, $child){
        self::requireDirectory($root);

        return \substr($root, -1) === \DIRECTORY_SEPARATOR ? $root.$child : $root.\DIRECTORY_SEPARATOR.$child;
    }

    /**
     * @param string   $path
     * @param callable $callback
     * @param mixed    $argument
     */
    public static function iterateDirectory($path, $callback, $argument = null){
        self::requireDirectory($path);

        foreach(\scandir($path) as $child){
            if($child === "." or $child === "..")continue;
            \call_user_func_array($callback, [\realpath($path), $child, $argument]);
        }
    }

    /**
     * @param string   $path
     * @param callable $callback
     * @param mixed    $argument
     */
    public static function iterateDirectoryFiles($path, $callback, $argument = null){
        self::iterateDirectory($path, function($r, $c, $cb){
            $realPath = self::pathAppendChild($r, $c);
            if(\is_file($realPath))\call_user_func_array($cb[0], [$realPath, $cb[1]]);
            elseif(\is_dir($realPath))self::iterateDirectoryFiles($realPath, $cb[0], $cb[1]);
        }, [$callback, $argument]);
    }

    /**
     * @param array $array
     * @param mixed $key
     *
     * @return mixed
     */
    public static function requireElement($array, $key){
        if(isset($array[$key])){
            return $array[$key];
        }
        switch(PiController::getMode()){
            case PiController::MODE_XHR:
                PiController::getInstance()->sendFail("Argument ".$key." must be provided");
                break;
            default:
                throw new \BadMethodCallException("Argument ".$key." must be provided");
        }
        return null;
    }

    /**
     * @param string $path
     *
     * @return string
     */
    public static function readFileContents($path){
        return @\file_get_contents($path);
    }

    /**
     * @return int
     */
    public static function getSystemStartUpTime(){
        return \time() - \floatval(static::readFileContents("/proc/uptime"));
    }

    /**
     * @param $thing
     *
     * @return string
     */
    public static function getTypeString($thing){
        return \is_bool($thing) ? "boolean" :
            \is_callable($thing) ? "callable" :
            \is_array($thing) ? "array" :
            \is_integer($thing) ? "integer" :
            \is_double($thing) ? "double" :
            \is_object($thing) ? \get_class($thing) :
            \is_string($thing) ? "string" :
            "unknown";
    }
}
