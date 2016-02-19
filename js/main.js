'use strict';

(function() {

  // Custom objects

  var ScrollBeast = function() {};

  ScrollBeast.prototype.smoothScroll = function(target) {
    target = $('[name="' + target + '"]');

    if (target.length) {
      $('html, body').velocity('stop')
        .velocity('scroll', {
          duration: 400,
          easing: 'linear',
          offset: target.offset().top
        });

      return false;
    }
  };

  // Window objects

  window.ScrollBeast = new ScrollBeast();

  // Initialization

  $(init);

  function init() {
    $('.js-site-nav-trigger')
      .on('click', function() {
        $('.js-site-nav-container,.js-site-nav-trigger').toggleClass('active');
      });

    // var maxAnimations = 30;
    // var animationCount = 0;
    // $('.site-logo')
    //   .on('mouseover', _.debounce(function() {

    //     if (animationCount === maxAnimations) {
    //       $('.site-logo').off('mouseover');
    //       return false;
    //     }

    //     $('.site-logo svg').velocity({
    //       translateX: '175px',
    //       rotateZ: '1440deg'
    //     }, 500);

    //     $('.site-title').velocity({
    //       left: '-42px'
    //     }, 500);

    //     animationCount++;
    //   }, 300))
    //   .on('mouseout', _.debounce(function() {
    //     if (animationCount === maxAnimations) {
    //       $('.site-logo').off('mouseout');
    //       return false;
    //     }

    //     $('.site-title').velocity('finish').velocity({
    //       left: '0'
    //     }, 500);

    //     $('.site-logo svg').velocity('finish').velocity({
    //       translateX: '0',
    //       rotateZ: '-1440deg'
    //     }, 500);

    //     animationCount++;
    //   }, 300));
  }

})();
