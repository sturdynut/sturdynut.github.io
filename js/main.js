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
    $('.js-site-nav-trigger').on('click', function() {
      $('.js-site-nav-container,.js-site-nav-trigger').toggleClass('active');
    });
  }

})();
