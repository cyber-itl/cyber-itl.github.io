var secure = [
			[
					{ axis: "Safety Features", value: 100 },
					{ axis: "Code Complexity", value: 100 },
					{ axis: "Code Hygiene", value: 100 }
			]
	];
	var somewhatsecure = [
			[
					{ axis: "Safety Features", value: 60 },
					{ axis: "Code Complexity", value: 60 },
					{ axis: "Code Hygiene", value: 60 }
			]
	];
	var insecure = [
			[
					{ axis: "Safety Features", value: 20 },
					{ axis: "Code Complexity", value: 20 },
					{ axis: "Code Hygiene", value: 20 }
			]
	];
	var compared = [
			[
					{ axis: "Safety Features", value: 25 },
					{ axis: "Code Complexity", value: 57 },
					{ axis: "Code Hygiene", value: 95 }
        ],
        [
            { axis: "Safety Features", value: 53 },
            { axis: "Code Complexity", value: 80 },
            { axis: "Code Hygiene", value: 65 }
        ]
	];

	var currentTime = new Date();
	var year = currentTime.getFullYear();
document.getElementById("year").innerHTML = year;
var selectedBrowserComparisonOS = "Windows";
	
	$(function () {

			Index.LoadData();
			

        var browserWidth = $(window).width();

        if (browserWidth > 991) {
            largeScreen();
        }
        else {
            smallScreen();
        }


			$("#comparison-menu").hover(function () {
					$(this).addClass("open-nav");
			},
					function () {
							$(this).removeClass("open-nav");
					});

			$(".explore-link").click(function (event) {
					event.preventDefault();
					var target = $(this.hash);
					$('html, body').animate({
							scrollTop: target.offset().top
					}, 500, function () {
					});
			});


			


		
				
			

});

function smallScreen() {
    RadarChart.draw("#chart-a1", secure, introcfg);
    RadarChart.draw("#chart-a2", somewhatsecure, introcfg);
    RadarChart.draw("#chart-a3", insecure, introcfg);
    RadarChart.draw("#chart-a4", compared, introcfg);
    CITL_RadarChart.draw(ComparisonTypes.OS, "#chart-t1", "#chart-1");
    CITL_RadarChart.draw(ComparisonTypes.browserOSX, "#chart-t3", "#chart-2", "#browser-comparison-osx");
    CITL_RadarChart.draw(ComparisonTypes.browserLinux, "#chart-t4", "#chart-2", "#browser-comparison-linux");

    CITL_RadarChart.draw(ComparisonTypes.smarttv, "#chart-t5", "#chart-3");
    CITL_RadarChart.draw(ComparisonTypes.microsoftoffice, "#chart-t6", "#chart-4");
    CITL_RadarChart.draw(ComparisonTypes.browserWindow, "#chart-t2", "#chart-2", "#browser-comparison-windows");

    $("#browser-comparison button").click(function () {
        $("#browser-comparison button").removeClass("selected");
        $(this).addClass("selected");
        let os = this.innerHTML;
        if (os.startsWith("Windows")) {
            $("#browser-comparison-windows").show();
            $("#browser-comparison-osx").hide();
            $("#browser-comparison-linux").hide();
            selectedBrowserComparisonOS = "Windows";
        }
        else if (os.startsWith("mac")) {
            $("#browser-comparison-windows").hide();
            $("#browser-comparison-osx").show();
            $("#browser-comparison-linux").hide();
            selectedBrowserComparisonOS = "OSX";
        }
        else if (os.startsWith("Linux")) {
            $("#browser-comparison-windows").hide();
            $("#browser-comparison-osx").hide();
            $("#browser-comparison-linux").show();
            selectedBrowserComparisonOS = "Linux";
        }

        RenderBrowserComparisonRadarChartSm();
    });
};

function largeScreen() {



    RadarChart.draw("#chart", secure, introcfg);
    var fixedExplainer = $('#chart-explainer').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('main').addClass('fixed-explainer');
            }
            else if (direction == 'up') {
                $('main').removeClass('fixed-explainer');
            };
        }
    });
    var accordion1 = $('#chart-explainer').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('.accordion-1').removeClass('open');
                $('.accordion-2').addClass('open');
                RadarChart.draw("#chart", somewhatsecure, introcfg);
            }
            else if (direction == 'up') {
                $('.accordion-2').removeClass('open');
                $('.accordion-1').addClass('open');
                RadarChart.draw("#chart", secure, introcfg);
            }
        },
        offset: '-50%'
    });
    var accordion2 = $('#chart-explainer').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('.accordion-2').removeClass('open');
                $('.accordion-3').addClass('open');
                RadarChart.draw("#chart", insecure, introcfg);
            }
            else if (direction == 'up') {
                $('.accordion-3').removeClass('open');
                $('.accordion-2').addClass('open');
                RadarChart.draw("#chart", somewhatsecure, introcfg);
            }
        },
        offset: '-100%'
    });
    var accordion3 = $('#chart-explainer').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('.accordion-3').removeClass('open');
                $('.accordion-4').addClass('open');
                RadarChart.draw("#chart", compared, introcfg);
            }
            else if (direction == 'up') {
                $('.accordion-4').removeClass('open');
                $('.accordion-3').addClass('open');
                RadarChart.draw("#chart", insecure, introcfg);
            }
        },
        offset: '-150%'
    });

    $(".accordion-1 button").click(function () {
        $('html, body').animate({
            scrollTop: $("#chart-explainer").offset().top
        }, 100);
    });

    $(".accordion-2 button").click(function () {
        var halfHeight = $(window).height() / 2;
        $('html, body').animate({
            scrollTop: ($("#chart-explainer").offset().top + halfHeight)
        }, 100);
    });
    $(".accordion-3 button").click(function () {
        var fullHeight = $(window).height();
        $('html, body').animate({
            scrollTop: ($("#chart-explainer").offset().top + fullHeight + 1)
        }, 100);
    });
    $(".accordion-4 button").click(function () {
        var fullHalfHeight = $(window).height() + $(window).height() / 2;
        $('html, body').animate({
            scrollTop: ($("#chart-explainer").offset().top + fullHalfHeight)
        }, 100);
    });
    var fixedChart = $('#chart-explainer').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('#chart').addClass("fixed-chart");
                $('#chart-explainer .fixed-wrapper').addClass('after');
            }
            else if (direction == 'up') {
                $('#chart-explainer .fixed-wrapper').removeClass('after');
                $('#chart').removeClass("fixed-chart");

            }
        },
        offset: '-200%'
    });
    var fixedHeader = $('#risk-comparison').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('#risk-comparison h2').addClass("fixed-header");


            }
            else if (direction == 'up') {
                $('#risk-comparison h2').removeClass("fixed-header");

            }
        },
        offset: 80

    });
    var stopFixed = $('#chart-4').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $('#risk-comparison h2').addClass("stop-fixed-header");
                $('#chart').addClass("stop-fixed-chart");
                $('#comparison-menu').addClass("stop-fixed-menu");


            }
            else if (direction == 'up') {
                $('#risk-comparison h2').removeClass("stop-fixed-header");
                $('#chart').removeClass("stop-fixed-chart");
                $('#comparison-menu').removeClass("stop-fixed-menu");

            }
        }

    });
    var topChart1 = $('#chart-1').waypoint({
        handler: function (direction) {
            if (direction == 'down') {
                $("#comparison-menu").addClass("fixed-menu");
            }
            else if (direction == 'up') {
                $("#comparison-menu").removeClass("fixed-menu");
                $('#risk-comparison h2').removeClass("show-header");

            }
        }
    });

    var loadChart1Dwn = new Waypoint({
        element: document.getElementById('chart-1'),
        handler: function (direction) {
            if (direction == 'down') {
                $("#chart-1 .score-list .selected").removeClass("selected");
                $("#chart-1 .score-list button:first").addClass("selected");
                $('html, body').animate({
                    scrollTop: $("#chart-1").offset().top
                }, 700, function () {
                });
                setTimeout(function () { CITL_RadarChart.draw(ComparisonTypes.OS, "#chart", "#chart-1") }, 200);
                $("#comparison-menu").addClass("fixed-menu");
                $('#risk-comparison h2').addClass("show-header");
            }
        },
        offset: '90%',
        continuous: false

    });
    var loadChart1Up = new Waypoint({
        element: document.getElementById('chart-1'),
            handler: function (direction) {
                if (direction == 'up') {
                $('html, body').animate({
                    scrollTop: $("#chart-explainer").offset().top
                }, 500, function () {
                });
                RadarChart.draw("#chart", compared, introcfg);
            }
        },
        offset: '10%'

    });
    var loadChart2Dwn = new Waypoint({
        element: document.getElementById('chart-2'),
        handler: function (direction) {
            if (direction == 'down') {
                $("#chart-2 .score-list .selected").removeClass("selected");
                $("#chart-2 .score-list button:first").addClass("selected");
                $(".current-tab").removeClass("current-tab");
                $("#tab-2").addClass("current-tab");
                $('html, body').animate({
                    scrollTop: $("#chart-2").offset().top
                }, 500, function () {
                    });
                setTimeout(RenderBrowserComparisonRadarChart, 200);
            }
        },
        offset: '90%',
        continuous: false
    });
    var loadChart2Up = new Waypoint({
        element: document.getElementById('chart-2'),
        handler: function (direction) {
            if (direction == 'up') {
                $('html, body').animate({
                    scrollTop: $("#chart-1").offset().top
                }, 500, function () {
                });
                $("#chart-1 .score-list .selected").removeClass("selected");
                $("#chart-1 .score-list button:first").addClass("selected");
                CITL_RadarChart.draw(ComparisonTypes.OS, "#chart", "#chart-1");
                $(".current-tab").removeClass("current-tab");
                $("#tab-1").addClass("current-tab");
            }
        },
        offset: '10%'
    });
    var loadChart3Dwn = new Waypoint({
        element: document.getElementById('chart-3'),
        handler: function (direction) {
            if (direction == 'down') {
                $("#chart-3 .score-list .selected").removeClass("selected");
                $("#chart-3 .score-list button:first").addClass("selected");
                $('html, body').animate({
                    scrollTop: $("#chart-3").offset().top
                }, 500, function () {
                });
                setTimeout(function () { CITL_RadarChart.draw(ComparisonTypes.smarttv, "#chart", "#chart-3") }, 200);
                $(".current-tab").removeClass("current-tab");
                $("#tab-3").addClass("current-tab");
            }
        },
        offset: '90%',
        continuous: false

    });
    var loadChart3Up = new Waypoint({
        element: document.getElementById('chart-3'),
        handler: function (direction) {
            if (direction == 'up') {
                $("#chart-2 .score-list .selected").removeClass("selected");
                $("#chart-2 .score-list button:first").addClass("selected");
                $('html, body').animate({
                    scrollTop: $("#chart-2").offset().top
                }, 500, function () {
                });
                RenderBrowserComparisonRadarChart();
                $(".current-tab").removeClass("current-tab");
                $("#tab-2").addClass("current-tab");
            }
        },
        offset: '10%'

    });
    var loadChart4Dwn = new Waypoint({
        element: document.getElementById('chart-4'),
        handler: function (direction) {
            if (direction == 'down') {
                $("#chart-4 .score-list .selected").removeClass("selected");
                $("#chart-4 .score-list button:first").addClass("selected");
                $('html, body').animate({
                    scrollTop: $("#chart-4").offset().top
                }, 500, function () {
                });
                setTimeout(function () {
                    CITL_RadarChart.draw(ComparisonTypes.microsoftoffice, "#chart", "#chart-4") }, 200);
                $(".current-tab").removeClass("current-tab");
                $("#tab-4").addClass("current-tab");
            }
        },
        offset: '90%',
        continuous: false

    });

    var loadChart4Up = new Waypoint({
        element: document.getElementById('chart-4'),
        handler: function (direction) {
            if (direction == 'up') {
                $("#chart-3 .score-list .selected").removeClass("selected");
                $("#chart-3 .score-list button:first").addClass("selected");
                $('html, body').animate({
                    scrollTop: $("#chart-3").offset().top
                }, 500, function () {
                });
                CITL_RadarChart.draw(ComparisonTypes.smarttv, "#chart", "#chart-3");
                $(".current-tab").removeClass("current-tab");
                $("#tab-3").addClass("current-tab");
            }
        },
        offset: '10%'

    });

    $("#comparison-menu a").each(function (index) {
        $(this).click(function (event) {
            event.preventDefault();
            index++;
            if (index == 1) {
                loadChart2Dwn.disable();
                loadChart3Dwn.disable();
                loadChart4Dwn.disable();
                loadChart1Up.disable();
                loadChart3Up.disable();
                loadChart4Up.disable();
            }
            else if (index == 2) {
                loadChart1Dwn.disable();
                loadChart3Dwn.disable();
                loadChart4Dwn.disable();
                loadChart1Up.disable();
                loadChart2Up.disable();
                loadChart4Up.disable();
            }
            else if (index == 3) {
                loadChart1Dwn.disable();
                loadChart2Dwn.disable();
                loadChart4Dwn.disable();
                loadChart3Up.disable();
                loadChart2Up.disable();
                loadChart1Up.disable();
            }
            else if (index == 4) {
                loadChart1Dwn.disable();
                loadChart2Dwn.disable();
                loadChart3Dwn.disable();
            }
            var target = $(this.hash);
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 1000, function () {
                if (index == 1) {
                    loadChart2Dwn.enable();
                    loadChart3Dwn.enable();
                    loadChart4Dwn.enable();
                    loadChart1Up.enable();
                    loadChart3Up.enable();
                    loadChart4Up.enable();
                }
                else if (index == 2) {
                    loadChart1Dwn.enable();
                    loadChart3Dwn.enable();
                    loadChart4Dwn.enable();
                    loadChart1Up.enable();
                    loadChart2Up.enable();
                    loadChart4Up.enable();
                }
                else if (index == 3) {
                    loadChart1Dwn.enable();
                    loadChart2Dwn.enable();
                    loadChart4Dwn.enable();
                    loadChart3Up.enable();
                    loadChart2Up.enable();
                    loadChart1Up.enable();
                }
                else if (index == 4) {
                    loadChart1Dwn.enable();
                    loadChart2Dwn.enable();
                    loadChart3Dwn.enable();
                }
            });

        });
    });

    $("#browser-comparison button").click(function () {
        $("#browser-comparison button").removeClass("selected");
        $(this).addClass("selected");
        let os = this.innerHTML;
        if (os.startsWith("Windows")) {
            $("#browser-comparison-windows").show();
            $("#browser-comparison-osx").hide();
            $("#browser-comparison-linux").hide();
            selectedBrowserComparisonOS = "Windows";
        }
        else if (os.startsWith("mac")) {
            $("#browser-comparison-windows").hide();
            $("#browser-comparison-osx").show();
            $("#browser-comparison-linux").hide();
            selectedBrowserComparisonOS = "OSX";
        }
        else if (os.startsWith("Linux")) {
            $("#browser-comparison-windows").hide();
            $("#browser-comparison-osx").hide();
            $("#browser-comparison-linux").show();
            selectedBrowserComparisonOS = "Linux";
        }

        RenderBrowserComparisonRadarChart();
    });

}

function RenderBrowserComparisonRadarChart() {

    if (selectedBrowserComparisonOS == "Windows") {
        $("#chart-2 #browser-comparison-windows .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-windows .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserWindow, "#chart", "#chart-2", "#browser-comparison-windows");
    }
    else if (selectedBrowserComparisonOS == "OSX") {
        $("#chart-2 #browser-comparison-osx .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-osx .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserOSX, "#chart", "#chart-2", "#browser-comparison-osx");
    }
    else if (selectedBrowserComparisonOS == "Linux") {
        $("#chart-2 #browser-comparison-linux .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-linux .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserLinux, "#chart", "#chart-2", "#browser-comparison-linux");
    }
    else {
        $("#chart-2 #browser-comparison-windows .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-windows .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserWindow, "#chart", "#chart-2", "#browser-comparison-windows");
    }

}

function RenderBrowserComparisonRadarChartSm() {

    if (selectedBrowserComparisonOS == "Windows") {
        $("#chart-2 #browser-comparison-windows .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-windows .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserWindow, "#chart-t2", "#chart-2", "#browser-comparison-windows");
    }
    else if (selectedBrowserComparisonOS == "OSX") {
        $("#chart-2 #browser-comparison-osx .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-osx .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserOSX, "#chart-t3", "#chart-2", "#browser-comparison-osx");
    }
    else if (selectedBrowserComparisonOS == "Linux") {
        $("#chart-2 #browser-comparison-linux .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-linux .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserLinux, "#chart-t4", "#chart-2", "#browser-comparison-linux");
    }
    else {
        $("#chart-2 #browser-comparison-windows .score-list .selected").removeClass("selected");
        $("#chart-2 #browser-comparison-windows .score-list button:first").addClass("selected");
        CITL_RadarChart.draw(ComparisonTypes.browserWindow, "#chart-t2", "#chart-2", "#browser-comparison-windows");
    }

}