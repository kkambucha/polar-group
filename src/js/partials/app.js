$(function(){

    var mySwiper = new Swiper ('.swiper-container', {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      slidesPerView: 3,
      paginationClickable: true,
      spaceBetween: 5,

      // Navigation arrows
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',

    });


    $('.js-show-search-dialog').click(function () {
        showDialog({
            text: '\
			<form action="#" class="b-mobile-search-form">\
			  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\
			    <input class="mdl-textfield__input" type="text" id="sample3">\
			    <label class="mdl-textfield__label" for="sample3">Search</label>\
			  </div>\
			</form>\
            ',
            contentStyle: {'max-width': '100%'},
            cancelable: true
        });
    });



/* !-jQuery extensions */

	/* !- Check if element exists */
	$.fn.exists = function() {
		if ($(this).length > 0) {
			return true;
		} else {
			return false;
		}
	}

	/* !- Check if element is loaded */
	$.fn.loaded = function(callback, jointCallback, ensureCallback){
		var len	= this.length;
		if (len > 0) {
			return this.each(function() {
				var	el		= this,
					$el		= $(el),
					blank	= "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

				$el.on("load.dt", function(event) {
					$(this).off("load.dt");
					if (typeof callback == "function") {
						callback.call(this);
					}
					if (--len <= 0 && (typeof jointCallback == "function")){
						jointCallback.call(this);
					}
				});

				if (!el.complete || el.complete === undefined) {
					el.src = el.src;
				} else {
					$el.trigger("load.dt")
				}
			});
		} else if (ensureCallback) {
			if (typeof jointCallback == "function") {
				jointCallback.call(this);
			}
			return this;
		}
	};

/* jQuery extensions: end */


/* !-Royal Slider */
	if ($(".rsHomePorthole").exists()) {
		var portholeSlider = {};
			portholeSlider.container = $("#main-slideshow");
			portholeSlider.width = portholeSlider.container.attr("data-width") ? parseInt(portholeSlider.container.attr("data-width")) : 1280;
			portholeSlider.height = portholeSlider.container.attr("data-height") ? parseInt(portholeSlider.container.attr("data-height")) : 720;
			portholeSlider.autoslide = portholeSlider.container.attr("data-autoslide") && parseInt(portholeSlider.container.attr("data-autoslide")) > 999 ? parseInt(portholeSlider.container.attr("data-autoslide")) : 5000;
			portholeSlider.scale = portholeSlider.container.attr("data-scale") ? portholeSlider.container.attr("data-scale") : "fill";
			portholeSlider.paused = portholeSlider.container.attr("data-paused") ? portholeSlider.container.attr("data-paused") : true;
			portholeSlider.hendheld = $(window).width() < 740 && dtGlobals.isMobile ? true : false;
		$("#main-slideshow-content").appendTo(portholeSlider.container);

		portholeSlider.api = $(".rsHomePorthole").royalSlider({
			transitionType: 'fade',
			autoScaleSlider: true,
			autoScaleSliderWidth: portholeSlider.width,
			autoScaleSliderHeight: portholeSlider.height,
			autoPlay: {
				enabled: !portholeSlider.hendheld,
				stopAtAction: false,
				pauseOnHover: false,
				delay: portholeSlider.autoslide
			},
			imageScaleMode: portholeSlider.scale,
			imageScalePadding: 0,
			numImagesToPreload: 999,
			slidesOrientation: "horizontal",
			disableResponsiveness: false,
			loopRewind: true,
			arrowsNav: false,
			globalCaption: true,
			controlNavigation: !portholeSlider.hendheld ? 'porthole' : 'none',
			thumbs: {
				orientation: 'horizontal',
				drag: false,
				touch: false,
				spacing: 10,
				firstMargin: false,
				appendSpan: false
			},
			block: {
				fadeEffect: true,
				moveEffect: 'bottom',
				moveOffset: 5
			}
		}).data("royalSlider");
		var $_this = portholeSlider.container,
			$_this_childs = $_this.find(".rsSlide").size();
		if ($_this_childs < 2) {
			$(".rsThumbs", $_this).hide();
			portholeSlider.api._isMove = false;
			$_this.find(".rsOverflow").css("cursor", "auto")
		};

		if (portholeSlider.paused == "true") {
			$(".rsHomePorthole").royalSlider("stopAutoPlay");
		}
	};

	$(".slider-content .preload-me").loaded(null, function() {
		$(".slider-content").each(function(){
			var $this = $(this),
				autoslide = $this.attr("data-autoslide") && parseInt($this.attr("data-autoslide")) > 999 ? parseInt($this.attr("data-autoslide")) : 5000;
				hendheld = !($(window).width() < 740 && dtGlobals.isMobile) && $this.attr("data-autoslide") ? true : false;

			$this.royalSlider({
				autoPlay: {
					enabled: hendheld,
					stopAtAction: false,
					pauseOnHover: false,
					delay: autoslide
				},
				autoHeight: true,
				controlsInside: false,
				fadeinLoadedSlide: false,
				controlNavigationSpacing: 0,
				controlNavigation: 'bullets',
				imageScaleMode: 'none',
				imageAlignCenter:false,
				loop: false,
				loopRewind: true,
				numImagesToPreload: 6,
				keyboardNavEnabled: true

			}).data("royalSlider");
		});
	}, true);

	/* Royal Slider: end */


	/* Upload file */

	$(".b-tariff-requests__input-file").change(function(){
		var str = $(this).val();
		$(".b-tariff-requests__label-file").html(str);
	});
	$(".b-question__input-file").change(function(){
		var str = $(this).val();
		$(".b-question__label-file").html(str);
	});

	/* FAQ-accordeon*/

	$(".c-faq-link").on("click", function(e){
		e.preventDefault();

		var $this = $(this),
			item = $this.closest(".b-faq-acc__item"),
			list = $this.closest(".b-faq-acc__list"),
			items = list.find(".b-faq-acc__item"),
			content = $this.next(".b-faq-acc__item-content-wrap"),
			all = list.find(".b-faq-acc__item-content-wrap");

		if(!item.hasClass("active")) {

			items.removeClass("active");
			item.addClass("active");
			all.stop(true, true).slideUp(300);
            content.stop(true, true).slideDown(300);
		} else {
            content.stop(true, true).slideUp(300);
		    item.removeClass("active");
        };
	});


	/* Become polar partner - animation */

    $(document).ready( function () {
        var img = $(".b-vertex-background--partner"),
            head = $(".b-vertex-background__head--partner"),
            all = $(".c-layout--partner"),
            header = all.children(".mdl-layout__header"),
            content = $(".l-content--partner");

        //head.css("vertical-align", "top");

        header.css("opacity", 0);
        content.css("opacity", 0);
        head.css("top", "-370px");
        img.css("opacity", 0).animate({ opacity: 1}, 2000);
        header.delay(2000).animate({ opacity: 1}, 500);
        head.delay(2500).animate({ top: 0}, 2000);
        content.delay(4500).animate({ opacity: 1}, 500);
	});


	/* ShowPopup */

	$(".c-popup-show").on("click", function(e){
        e.stopPropagation();
		$(".b-popup").fadeIn(300);

		$(".b-popup__content").click(function(e) {
	       e.stopPropagation();
		});
	});

    $("body").on("click", function(e){
		$(".b-popup").fadeOut(300);
	});


	/* Contact Us */

	$(".b-contact__item").on("mouseenter", function(e){
		var $this = $(this),
			office = $this.children(".b-contact__office"),
			items = office.children(".b-contact__office-item"),
			head = office.children(".b-contact__office-head");

		office.stop(true, true).slideDown(700);
		items.stop(true, true).delay(700).fadeIn(1500);
		head.stop(true, true).delay(700).fadeIn(1500);
	});

	$(".b-contact__item").on("mouseleave", function(e){
		$(".b-contact__office").fadeOut(500);
	});


  /* Static main menu */
  var topScroll,
      topRowHeight = $('.b-top-row').height();

  $('body > .mdl-js-layout').on('scroll', function(){

    topScroll = $(this).scrollTop();

    if(topScroll > topRowHeight) {
      $('body').addClass('js-scrolling');
      $('.js-scrolling header').css({'right' : getScrollBarWidth() + 'px', 'padding-left' : '17px'});
      console.log('1');
    } else {

      setTimeout(function(){
        $('.js-scrolling header').css({'right' : 'auto', 'padding-left' : '0px'});
        $('body').removeClass('js-scrolling');
      }, 100);

    }

  });

  function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);

    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild (outer);

    return (w1 - w2);
  };

  // $('.js-main-menu-static').find('.b-top-row').hide();
  // $('.js-main-menu-static').css({
  //   'position' : 'fixed',
  //   'top' : 0,
  //   'left' : 0
  // });

	/* News-form */

	$(document).ready( function () {
		var input1 = $(".c-period-yes"),
		    input2 = $(".c-period-no"),
			select = $(".b-news-filters__period-select");

        $(input1).click(function(e) {
           select.prop('disabled', false);
        });
        $(input2).click(function(e) {
           select.prop('disabled', true);
        });
	});

});
