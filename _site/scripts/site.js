function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

$(function () {
    $("#nav-toggle").click(function () {
        if ($("body").hasClass("mobile-menu-open")) {
            $("header #nav-toggle").removeClass("close-toggle");
            $("#mobile-nav").slideUp("fast", function () {
                $("body").removeClass("mobile-menu-open");              
            });
        }
        else {
            $("body").addClass("mobile-menu-open");
            $("header #nav-toggle").addClass("close-toggle");
            $("#mobile-nav").slideDown("fast");
        }
    });
    $("#mobile-nav > ul > li > a").click(function (event) {
        if (!$(this).parent("li").hasClass("open")) {
            event.preventDefault();
            $(this).next("ul").slideDown("fast");
            $(this).parent("li").addClass("open");
        }
        else {
            event.preventDefault();
            $(this).next("ul").slideUp("fast");
            $(this).parent("li").removeClass("open");
        }
    });
});