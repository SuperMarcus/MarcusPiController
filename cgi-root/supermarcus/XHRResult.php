<?php
namespace supermarcus;

class XHRResult{
    private $data, $status, $message;

    public function __construct($data, $status = true, $message = ""){
        $this->data = $data;
        $this->status = $status;
        $this->message = $message;
    }

    public function sendJSONFormattedResult($exit = true){
        $this->sendRawResult(\json_encode(['status' => (bool) $this->status, 'data' => $this->data, 'message' => $this->message]));
        if($exit)exit(0);
    }

    private function sendRawResult($raw){
        echo $raw;
    }
}