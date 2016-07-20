<?php
namespace supermarcus\util;
require_once "Utils.php";

class AutoLoader{
    private $sourceRoot;
    private $references = null;

    public function __construct($sourceRoot = null){
        if($sourceRoot){
            $this->sourceRoot = Utils::requireDirectory($sourceRoot);
        }else{
            $this->sourceRoot = \dirname(\dirname(\realpath(__DIR__)));
        }
    }

    public function registerClass($class, $path){
        $this->references[$class] = $path;
    }

    public function load($class){
        if($this->references === null)throw new \BadMethodCallException("Uninitialized loader");
        if(isset($this->references[$class])){
            /** @noinspection PhpIncludeInspection */
            require $this->references[$class];
        }
    }

    public function register(){
        $this->references = [];
        Utils::iterateDirectoryFiles($this->getSourceRoot(), function($path, AutoLoader $ref){
            if(\substr($path, -4) === ".php"){
                $fp = @\fopen($path, 'r');
                if($fp){
                    $chars = \strtolower(\trim(@\fread($fp, 32)));
                    if(\strpos($chars, "<?php") === 0 and \strpos($chars, "//noinclude") === false){
                        $start = \strlen(\realpath($ref->getSourceRoot())) + 1;
                        $len = \strlen($path) - $start - 4;
                        $ref->registerClass(\str_replace('/', "\\", \substr($path, $start, $len)), $path);
                    }
                }
                @\fclose($fp);
            }
        }, $this);
        \spl_autoload_register([$this, "load"]);
    }

    /**
     * @return string
     */
    public function getSourceRoot(){
        return $this->sourceRoot;
    }
}
