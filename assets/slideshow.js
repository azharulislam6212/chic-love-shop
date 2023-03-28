

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
  if(slick != null ){
    currentSlide = slick.find(".slick-current");

    // slideType = currentSlide.attr("class").split(" ")[1];
    slideType = currentSlide.data('video-type');
    player = currentSlide.find("iframe").get(0);
    startTime = currentSlide.data("video-start");

  }



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



document.addEventListener('shopify:block:select', function(event) {  
    const blockSelectedIsSlide = event.target.classList.contains('slideshow_slide');
    if (!blockSelectedIsSlide) return;
  
    const parentSlideshowComponent = event.target.closest('slideshows-component');
    const slider = parentSlideshowComponent.querySelector('[id^="Slider-"]:not(.slick-cloned)').id;  
    const slideIndex = document.getElementById(`slideshow_slide_${event.detail.blockId}`).dataset.slickIndex;
  
    setTimeout(function() {

      playPauseVideo(slick,"play");

      $('#' + slider).slick('slickGoTo', slideIndex).slickAnimation();
      document.getElementById(slider).scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);

    resizePlayer(iframes, 16/9);

  });
  
  
  document.addEventListener('shopify:section:select', function(event) {  
    const blockSelectedIsSlide = event.target.classList.contains('slideshow_slide');
    if (!blockSelectedIsSlide) return;
  
    const parentSlideshowComponent = event.target.closest('slideshows-component');
    const slider = parentSlideshowComponent.querySelector('[id^="Slider-"]:not(.slick-cloned)').id;  
    const slideIndex = document.getElementById(`slideshow_slide_${event.detail.blockId}`).dataset.slickIndex;
  
    setTimeout(function() {

      playPauseVideo(slick,"play");
      $('#' + slider).slick('slickGoTo', slideIndex).slickAnimation();
      document.getElementById(slider).scrollIntoView({ 
        behavior: 'smooth',
        block: 'center' 
      });
    }, 300);

    resizePlayer(iframes, 16/9);


  });