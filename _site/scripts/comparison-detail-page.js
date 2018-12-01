$(function () {
    var comparisonType = getUrlParameter('comparisonType');
    var device = getUrlParameter('device');
    var os = "";

    if (comparisonType == "browser")
        os = getUrlParameter('operatingSystem');

    BrowserDetailShowHide();
    ComparisonDetail.LoadData(comparisonType, device, os);
});

function BrowserDetailShowHide() {
    $(".score-dist button").each(function (index) {
        $(this).click(function (event) {
            event.preventDefault();
            $(".score-dist .tabs .selected").removeClass("selected");
            $(this).addClass("selected");
            if (index == 0) {
                $(".score-dist table").hide();
                $(".side-note").hide();
                $("#scores").show();
                $(".score-dist ol").show();
                $("#binary-range-header").show();
            }
            else if (index == 1) {
                $(".score-dist table").hide();
                $("#safety").show();
                $(".side-note").show();
                $(".score-dist ol").hide();
                $("#binary-range-header").hide();
            }
            else if (index == 2) {
                $(".score-dist table").hide();
                $(".side-note").hide();
                $("#hygiene").show();
                $(".score-dist ol").hide();
                $("#binary-range-header").hide();
            }
        });
    });
}