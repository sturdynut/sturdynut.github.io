'use strict';

(function() {
  function init() {
    $('.js-site-nav-trigger').on('click', function() {
      $('.js-site-nav,.js-site-nav-trigger').toggleClass('active');
    })
  }

  init();
})();
