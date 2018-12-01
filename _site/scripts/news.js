jQuery(document).ready(function( $ ) {
window.mySwipe = new Swipe(document.getElementById('quote-slider'), {
  startSlide: 2,
  speed: 400,
  auto: 15000,
  continuous: true,
  disableScroll: false,
  stopPropagation: false,
  callback: function(index, elem) {
	  $("#quote-slider .indicator .active").removeClass("active");
	  $("#quote-slider .indicator button").eq(index).addClass("active");
  },
  transitionEnd: function(index, elem) {}
});

	$("#quote-slider .indicator button").each(function( index ) {

		$(this).click(function(){

			mySwipe.slide(index, 400);

		})

	
	});
});