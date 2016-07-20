$(document).ready(function(){(function ($, $that){
    $that.requireLogin();
    document.title = "Home | " + $that.getPiName();
    $("#header-title").get(0).innerHTML = $that.getPiName();

    var tickCounter = 0;
    $that.ticker = function(){
        ++tickCounter;

        if(tickCounter % 2 == 1){
            $that.statistic.updateProcessesInfo();
        }
        $that.statistic.updateStatistics();

        setTimeout($that.ticker, 2000);
    };

    var memoryBarWrappedItems = {
        'MemFree':           ["Free",            ["#27ae60", "#2ecc71"], "memory-details-free",          "Sum of LowFree+HighFree (overall stat)"],
        'MemAvailable':      ["Available",       ["#333333", "#525252"], "memory-details-available",     "Memory available to use"],
        'Buffers':           ["Buffers",         ["#2c3e50", "#2c3e50"], "memory-details-buffers",       "Memory in buffer cache"],
        'Cached':            ["Cached",          ["#2980b9", "#3498db"], "memory-details-cached",        "Memory in the pagecache (diskcache) minus SwapCache"],
        'SwapCached':        ["Swapped Cache",   ["#d35400", "#e67e22"], "memory-details-swap-cached",   "Memory that once was swapped out, is swapped back in but still also is in the swapfile (if memory is needed it doesn't need to be swapped out AGAIN because it is already in the swapfile. This saves I/O)"],
        'Active':            ["Active",          ["#124e8c", "#4288d0"], "memory-details-active",        "Memory that has been used more recently and usually not reclaimed unless absolutely necessary"],
        'SwapFree':          ["Swap Free",       ["#46465e", "#5a68a5"], "memory-details-swap-free",     "Total amount of swap memory free"]
    };
    var DOMMemoryBarsContainer = $("#memory-details-container").get(0);
    $.each(memoryBarWrappedItems, function(k, desc){
        DOMMemoryBarsContainer.innerHTML += "<div class='skillbar clearfix' title='"+desc[3]+"'>" +
            "<div class='skillbar-title' style='background: "+desc[1][0]+";'><span>"+desc[0]+"</span></div>" +
            "<div class='skillbar-bar' id='"+desc[2]+"-bar' style='background: "+desc[1][1]+";'></div>" +
            "<div class='skill-bar-number' id='"+desc[2]+"-number'>0 B</div>" +
            "</div>";
    });

    $that.statistic = {
        elements: {
            upTimeStatElement: $("#statistic-up-time"),
            processesElement: $("#statistic-process"),
            memoryUsageElement: $("#statistic-memory-usage"),
            boardTemperatureElement: $("#statistic-board-temperature"),

            processesContainerElement: $("#processes-table-container"),
            processesCountElement: $("#processes-table-count"),
            memoryOthersContainerElement: $("#memory-details-others-container")
        },

        cachedProcesses: [],
        cachedMemoryInfo: {},
        cachedProcessingUnitTemperature: 0,

        updateStatistics: function(){
            this.elements.upTimeStatElement.get(0).innerHTML = $that.round(((new Date()).getTime() / 1000 - $that.cachedMachineInformation[1]) / 3600, 2);
            this.elements.processesElement.get(0).innerHTML = this.cachedProcesses.length;
            this.elements.memoryUsageElement.get(0).innerHTML = $that.round(
                (this.cachedMemoryInfo.MemTotal - this.cachedMemoryInfo.MemFree) / this.cachedMemoryInfo.MemTotal * 100,
                2) + "%";
            this.elements.boardTemperatureElement.get(0).innerHTML = $that.round(this.cachedProcessingUnitTemperature, 2);

            var generatedHtml = "";

            if($that.overflowWindows.processes.presenting){
                $(this.cachedProcesses).each(function (k, proc) {
                    generatedHtml += "<tr>";
                    for(var i = 0; i < proc.length; ++i){
                        generatedHtml += "<td>" + proc[i] + "</td>";
                    }
                    generatedHtml += "</tr>";
                });
                this.elements.processesContainerElement.get(0).innerHTML = generatedHtml;
                this.elements.processesCountElement.get(0).innerHTML = this.cachedProcesses.length;
            }

            if($that.overflowWindows.memory.presenting){
                $.each(memoryBarWrappedItems, function (k, desc) {
                    $('#'+desc[2]+'-bar').animate({
                        width: (($that.statistic.cachedMemoryInfo[k] / $that.statistic.cachedMemoryInfo['MemTotal']) * 100)+'%'
                    });
                    $('#'+desc[2]+'-number').get(0).innerHTML = $that.kbToSuitable($that.statistic.cachedMemoryInfo[k]);
                });
                generatedHtml = "<h3>Kernel Output</h3><div class='table-wrapper'><table><tbody>";
                $.each(this.cachedMemoryInfo, function (k, v) {
                    generatedHtml += "<tr><td>"+k+"</td><td><strong>"+$that.kbToSuitable(v)+"</strong></td></tr>";
                });
                generatedHtml += "</tbody></table></div>";
                this.elements.memoryOthersContainerElement.get(0).innerHTML = generatedHtml;
            }
        },

        updateProcessesInfo: function(){
            $.ajax({
                url: $that.xhrRootUrl+"system/details.php",
                dataType: "json",
                success: function($ret){
                    if(typeof $ret == "string"){
                        $ret = $.parseJSON($ret);
                    }
                    if($ret.status){
                        $that.statistic.cachedProcesses = $ret.data[0];
                        $that.statistic.cachedMemoryInfo = $ret.data[1];
                        $that.statistic.cachedProcessingUnitTemperature = $ret.data[2];
                    }else{
                        $that.logger.error($ret.message);
                    }
                },
                error: function(xhr, stat, err){
                    $that.logger.error("Unable to load details, "+stat);
                }
            });
        }
    };

    function OverflowWindow($element, $showBtn, $hideBtn){//Class for overflow window
        var $self = this;
        this.presenting = false;

        this.show = function(){
            $self.presenting = true;
            $that.overflowWindows.currentFlowWindow = $self;
            $that.overflowWindows.showMask();
            $element.fadeIn();
            $that.statistic.updateStatistics();
        };

        this.hide = function(){
            $self.presenting = false;
            $that.overflowWindows.currentFlowWindow = null;
            $that.overflowWindows.hideMask();
            $element.fadeOut();
        };

        $showBtn.on('click', this.show);
        $hideBtn.on('click', this.hide);
    }

    var $showUnameFlowBtn = $("#show-uname-info-btn");
    var $unameResultContainer = $("#uname-info-container");
    $showUnameFlowBtn.on('click', function(){
        $.ajax({
            url: $that.xhrRootUrl+"system/uname_a.php",
            async: true,
            dataType: "json",
            success: function($ret){
                if(typeof $ret == "string"){
                    $ret = $.parseJSON($ret);
                }
                if($ret.status){
                    $unameResultContainer.get(0).innerHTML = "<h4><pre><code>"+$ret.data+"</code></pre></h4>";
                }else{
                    $unameResultContainer.get(0).innerHTML = "<i class='fa fa-frown-o' aria-hidden='true'></i> Unable to load: "+$ret.message;
                }
            },
            error: function(xhr, stat, err){
                $unameResultContainer.get(0).innerHTML = "<i class='fa fa-frown-o' aria-hidden='true'></i> Request failed: "+stat;
                $that.logger.error("Unable to load uname info, "+stat);
            }
        });
    });

    $that.overflowWindows = {
        maskElement: $(".overflow-background"),

        currentFlowWindow: null,

        showMask: function(){
            this.maskElement.fadeIn();
            $("body").css('overflow', "hidden");
        },

        hideMask: function () {
            this.maskElement.fadeOut();
            $("body").css('overflow', "auto");
        },

        memory: new OverflowWindow($("#memory-details-flow"), $("#show-memory-details-btn"), $("#hide-memory-details-btn")),
        processes: new OverflowWindow($("#processes-details-flow"), $("#show-processes-details-btn"), $("#hide-processes-details-btn")),
        unameInfo: new OverflowWindow($("#uname-info-flow"), $showUnameFlowBtn, $("#hide-uname-info-btn"))
    };

    $that.ticker();
})(jQuery, MarcusPi);});
