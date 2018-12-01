$(function () {
    $(".explore-link").click(function (event) {
        event.preventDefault();
        var target = $(this.hash);
        $('html, body').animate({
            scrollTop: target.offset().top
        }, 500, function () {
        });
    });
    $('[data-toggle="popover"]').popover();

    var baseJsonUrl = "../json/CITL_Comparison_";
    var jsonUrl = "";
    var os = "All"; //default

    var comparisonType = getUrlParameter('comparisonType');
    if (comparisonType == "browser") {
        os = getUrlParameter('operatingSystem');
        jsonUrl = baseJsonUrl + comparisonType + "_" + os + ".json";
    }
    else {
        if (comparisonType == "smarttv")
            os = "Linux";
        else if (comparisonType == "microsoftoffice")
            os = "OSX";

        jsonUrl = baseJsonUrl + comparisonType + ".json";
    }

    Comparison.LoadData(jsonUrl, comparisonType, os);

});