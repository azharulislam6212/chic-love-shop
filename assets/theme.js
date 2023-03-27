
var slideWrapper = $(".main-slider"),
    iframes = slideWrapper.find('.embed-player'),
    lazyImages = slideWrapper.find('.slide-image'),
    lazyCounter = 0;

// POST commands to YouTube or Vimeo API
function postMessageToPlayer(player, command){
  if (player == null || command == null) return;
  player.contentWindow.postMessage(JSON.stringify(command), "*");
}

// When the slide is changing
function playPauseVideo(slick, control){
  var currentSlide, slideType, startTime, player, video;

    currentSlide = slick.find(".slick-current");
    if( currentSlide.length > 0 ){
      // slideType = currentSlide.attr("class").split(" ")[1];
      slideType = currentSlide.data('video-type');
    }

    player = currentSlide.find("iframe").get(0);
    startTime = currentSlide.data("video-start");



  if (slideType === "vimeo") {
    switch (control) {
      case "play":
        if ((startTime != null && startTime > 0 ) && !currentSlide.hasClass('started')) {
          currentSlide.addClass('started');
          postMessageToPlayer(player, {
            "method": "setCurrentTime",
            "value" : startTime
          });
        }
        postMessageToPlayer(player, {
          "method": "play",
          "value" : 1
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "method": "pause",
          "value": 1
        });
        break;
    }
  } else if (slideType === "youtube") {
    switch (control) {
      case "play":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "mute"
        });
        postMessageToPlayer(player, {
          "event": "command",
          "func": "playVideo"
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "pauseVideo"
        });
        break;
    }
  } else if (slideType === "video") {
    video = currentSlide.children("video").get(0);
    if (video != null) {
      if (control === "play"){
        video.play();
      } else {
        video.pause();
      }
    }
  }
}

// Resize player
function resizePlayer(iframes, ratio) {
  if (!iframes[0]) return;
  var win = $(".main-slider"),
      width = win.width(),
      playerWidth,
      height = win.height(),
      playerHeight,
      ratio = ratio || 16/9;

  iframes.each(function(){
    var current = $(this);
    if (width / ratio < height) {
      playerWidth = Math.ceil(height * ratio);
      current.width(playerWidth).height(height).css({
        left: (width - playerWidth) / 2,
         top: 0
        });
    } else {
      playerHeight = Math.ceil(width / ratio);
      current.width(width).height(playerHeight).css({
        left: 0,
        top: (height - playerHeight) / 2
      });
    }
  });
}



class SlideshowsComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');

    if (!this.slider) return;

    this.initPages();

    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);
  }

  initPages() {
    const sliderActive = this.slider.id;
    const slick = $('#' + sliderActive);

    if(slick.length > 0){

      setTimeout(function(){
        playPauseVideo(slick,"play");
      }, 1000);

    }

    resizePlayer(iframes, 16/9);


    $("#" + sliderActive)
      .not(".slick-initialized")
      .slick({
        prevArrow:
          '<div class="prev"><svg width="25" height="40" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 3L5 20L22 37" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></svg></div>',
        nextArrow:
          '<div class="next"><svg width="25" height="40" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 37L20 20L3 3" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></svg></div>',
      });

      slick.on("beforeChange", function(event, slick) {
        slick = $(slick.$slider);
  
        if(slick.length > 0){
          playPauseVideo(slick,"pause");
        }
  
        });
        slick.on("afterChange", function(event, slick) {
        slick = $(slick.$slider);
  
        if(slick.length > 0){
        playPauseVideo(slick,"play");
      }
  
        });
        slick.on("lazyLoaded", function(event, slick, image, imageSource) {
        lazyCounter++;
        if (lazyCounter === lazyImages.length){
          lazyImages.addClass('show');
          // slideWrapper.slick("slickPlay");
        }
        });


  }
}

customElements.define("slideshows-component", SlideshowsComponent);

$(window).on("resize.slickVideoPlayer", function(){  
  resizePlayer(iframes, 16/9);
});




let items = document
  .querySelector(".header__inline-menu")
  .querySelectorAll("details");

items.forEach((item) => {
  item.addEventListener("mouseover", () => {
    item.setAttribute("open", true);
    item.querySelector("ul").addEventListener("mouseleave", () => {
      item.removeAttribute("open");
    });
    item.addEventListener("mouseleave", () => {
      item.removeAttribute("open");
    });
  });
});
$(function () {
  "use strict";

  var body = $("body");

  /****====== Wow Js ======*******/
  new WOW().init();



  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('#pills-tab a')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            500,
            function () {
              // Callback after animation
              // Must change focus!

              if (
                $("#Details-menu-drawer-container").hasClass("menu-opening") &&
                $(".section-header").hasClass("menu-open")
              ) {
                $(".section-header").removeClass(" menu-open");
                $("#Details-menu-drawer-container").removeClass("menu-opening");
                $("body").removeClass("overflow-hidden-tablet");
                $("body").removeClass("overflow-hidden-mobile");
                $("#Details-menu-drawer-container")
                  .find(".header__icon")
                  .attr("aria-expanded", false);
                $("#Details-menu-drawer-container").removeAttr("open");
              }

              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                // Checking if the target was focused
                return false;
              } else {
                $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              }
            }
          );
        }
      }
    });
});

$(function () {
  "use strict";

  var body = $("body");

  /****====== Wow Js ======*******/
  new WOW().init();



  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .not('a.nav-link')
    .click(function (event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            500,
            function () {
              // Callback after animation
              // Must change focus!

              if (
                $("#Details-menu-drawer-container").hasClass("menu-opening") &&
                $(".section-header").hasClass("menu-open")
              ) {
                $(".section-header").removeClass(" menu-open");
                $("#Details-menu-drawer-container").removeClass("menu-opening");
                $("body").removeClass("overflow-hidden-tablet");
                $("body").removeClass("overflow-hidden-mobile");
                $("#Details-menu-drawer-container")
                  .find(".header__icon")
                  .attr("aria-expanded", false);
                $("#Details-menu-drawer-container").removeAttr("open");
              }

              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                // Checking if the target was focused
                return false;
              } else {
                $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              }
            }
          );
        }
      }
    });
});

// custom scripts

// accordion script
    $('.trigger').click(function(j) {
    
    var dropDown = $(this).closest('li').find('.content');
    $(this).closest('.faq_accordion').find('.content').not(dropDown).slideUp();
    
    if ($(this).hasClass('is-open')) {
      $(this).removeClass('is-open');
    } else {
      $(this).closest('.faq_accordion').find('.trigger.is-open').removeClass('is-open');
      $(this).addClass('is-open');
    }
    
    dropDown.stop(false, true).slideToggle();
    j.preventDefault();
  });