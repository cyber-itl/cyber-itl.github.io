$(function () { 
    var hash = window.location.hash;
    if (hash == "#code-hygiene" || hash == "#code-complexity") {
        var target = $("#static-analysis");
        $('html, body').animate({
            scrollTop: target.offset().top
        }, 1000, function () {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
                return false;
            } else {
                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
            };
            if (hash == "#code-hygiene") {
                $(".tabs .selected").removeClass("selected");
                $(".show-tab").removeClass("show-tab");
                $("#code-hygiene").addClass("show-tab");
                $(".tabs a").eq(1).addClass("selected");
            }
            else if (hash == "#code-complexity") {
                $(".tabs .selected").removeClass("selected");
                $(".show-tab").removeClass("show-tab");
                $("#code-complexity").addClass("show-tab");
                $(".tabs a").eq(2).addClass("selected");
            };
            });


    };
			 $(".tabs a").click(function(event){
				 event.preventDefault();
				 if(!$(this).hasClass("selected")){
					 $(".tabs .selected").removeClass("selected");
					 $(".show-tab").removeClass("show-tab");
					 var tab = $(this).attr("href");
				 	$(tab).addClass("show-tab");
                     $(this).addClass("selected");
                     Waypoint.refreshAll();
					 }
			 });
			 			 $(".sticky-nav a").click(function(event){
				 event.preventDefault();
                                 var target = $(this.hash);
				 $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
			 });
			 
			 			 var menu1 = $('#scoring').waypoint({
  handler: function(direction) {
	  if(direction == 'down'){
	 $('.sticky-nav a').eq(0).addClass('selected');
	  }
  }
});
			 
			 var menu2 = $('#static-analysis').waypoint({
  handler: function(direction) {
	  if(direction == 'down'){
	  $('.sticky-nav a').eq(0).removeClass('selected');
	 $('.sticky-nav a').eq(1).addClass('selected');
	  }
	    else if(direction == 'up'){
	 $('.sticky-nav a').eq(1).removeClass('selected');
	 $('.sticky-nav a').eq(0).addClass('selected');
		}
  }
});
			 
			 var menu3 = $('#crash-testing').waypoint({
  handler: function(direction) {
	  if(direction == 'down'){
	  $('.sticky-nav a').eq(1).removeClass('selected');
	 $('.sticky-nav a').eq(2).addClass('selected');
	  }
	    else if(direction == 'up'){
	 $('.sticky-nav a').eq(2).removeClass('selected');
	 $('.sticky-nav a').eq(1).addClass('selected');
		}
  }
});
			 
	var menu4 = $('#data-sources').waypoint({
  handler: function(direction) {
	  if(direction == 'down'){
	  $('.sticky-nav a').eq(2).removeClass('selected');
	 $('.sticky-nav a').eq(3).addClass('selected');
	  }
	    else if(direction == 'up'){
	 $('.sticky-nav a').eq(3).removeClass('selected');
	 $('.sticky-nav a').eq(2).addClass('selected');
		}
  }
});
			 
var menu5 = $('#analysis-tools').waypoint({
  handler: function(direction) {
	  if(direction == 'down'){
	  $('.sticky-nav a').eq(3).removeClass('selected');
	 $('.sticky-nav a').eq(4).addClass('selected');
	  }
	  	    else if(direction == 'up'){
	 $('.sticky-nav a').eq(4).removeClass('selected');
	 $('.sticky-nav a').eq(3).addClass('selected');
		}
  }
});
			 

		 });