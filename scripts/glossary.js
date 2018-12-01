		 $(function(){ 
			 	$(".sticky-nav a").click(function(event){
				 event.preventDefault();
					$(".sticky-nav .selected").removeClass("selected");
					$(this).addClass("selected");
				 var target = $(this.hash);
				 $('html, body').animate({
          scrollTop: target.offset().top
        }, 500, function() {
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
		 });