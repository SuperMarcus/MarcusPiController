$(document).ready(function(){(function ($, $that){
    $that.logger = {
        info: function($msg){
            this.setText("<i class='fa fa-info' aria-hidden='true'></i> "+$msg);
        },
        error: function($msg){
            this.setText("<i class='fa fa-times' aria-hidden='true'></i> "+$msg);
        },
        warn: function($msg){
            this.setText("<i class='fa fa-exclamation' aria-hidden='true'></i> "+$msg);
        },
        fatal: function($msg){
            this.setText("<i class='fa fa-frown-o' aria-hidden='true'></i> "+$msg);
        },
        setText: function($ct){
            this.outElement.hide();
            this.outElement.get(0).innerHTML = $ct;
            this.outElement.fadeIn();
        },
        outElement: $("#logger-out")
    };

    document.title = "Login | " + $that.getPiName();

    var username = $("#username");
    var password = $("#password");

    var inProgress = false;

    $("#reset-btn").on('click', function(){
        username.val("");
        password.val("");
    });

    $("#login-btn").on('click', function(){
        if(inProgress)return;

        var $username = username.val();
        var $password = password.val();

        if($username.length <= 0){
            $that.logger.warn("Please input your username");
            return;
        }

        if($password.length <= 0){
            $that.logger.warn("Please input your password");
            return;
        }

        inProgress = true;
        $("#login-btn").addClass("disabled");
        $("#reset-btn").addClass("disabled");

        $that.logger.setText("<i class='fa fa-circle-o-notch fa-spin fa-fw margin-bottom'></i> Loading...");

        $.ajax({
            url: $that.xhrRootUrl+"auth/login.php",
            data: {
                username: $username,
                password: $password
            },
            dataType: "json",
            async: true,
            type: "POST",
            success: function($ret){
                if(typeof $ret == "string"){
                    $ret = $.parseJSON($ret);
                }
                if($ret.status){
                    $that.redirect("/");
                }else{
                    $that.logger.error($ret.message);
                }
                inProgress = false;
                $("#login-btn").removeClass("disabled");
                $("#reset-btn").removeClass("disabled");
            },
            error: function(xhr, stat, err){
                $that.logger.error("Failed to login, "+stat);
                inProgress = false;
                $("#login-btn").removeClass("disabled");
                $("#reset-btn").removeClass("disabled");
            }
        });
    });
})(jQuery, MarcusPi);});