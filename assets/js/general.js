MarcusPi = (function ($, global) {
    var $that = this;

    this.xhrRootUrl = "/xhr/php/";

    this.logger = {//self implement
        info: function($msg){},
        error: function($msg){},
        warn: function($msg){},
        fatal: function($msg){}
    };

    this.cachedMachineInformation = null;
    this.requestMachineInformation = function(){
        $.ajax({
            url: $that.xhrRootUrl+"system/machine_info.php",
            async: false,
            dataType: "json",
            success: function($ret){
                if(typeof $ret == "string"){
                    $ret = $.parseJSON($ret);
                }
                if($ret.status){
                    $that.cachedMachineInformation = $ret.data;
                }
            },
            error: function(xhr, stat, err){
                $that.logger.error("Unable to load machine info, "+stat);
            }
        });
    };

    this.round = function(num, dec){
        return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    };

    this.kbToSuitable = function(raw){
        return raw < 1000 ? raw + " KB" :
            raw < 1048000 ? $that.round(raw / 1024, 2) + " M" :
            raw < 1073000000 ? $that.round(raw / 1048576, 2) + " G" :
            $that.round(raw / 1073741824, 2) + " T";
    };

    this.requireLogin = function () {
        $.ajax({
            url: $that.xhrRootUrl+"auth/is_authorized.php",
            async: false,
            dataType: "json",
            success: function($ret){
                if(typeof $ret == "string"){
                    $ret = $.parseJSON($ret);
                }
                if($ret.status){
                    if(!$ret.data){
                        $that.redirect("/login.html");
                    }
                }
            },
            error: function(xhr, stat, err){
                $that.logger.error("Unable to load authorization info, "+stat+" Please reload the page");
            }
        });
    };

    this.getPiName = function () {
        if(!$that.cachedMachineInformation)$that.requestMachineInformation();
        return $that.cachedMachineInformation[0];
    };

    this.redirect = function($page){
        window.location.href = $page;
    };

    return $that;
})(jQuery, window);