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

  window.sturdy = window.sturdy || {};
  window.sturdy.scrollBeast = new ScrollBeast();
  window.sturdy.positionNavigation = positionNavigation;

  // Initialization

  $(init);

  function init() {
    $('.site-content').on('click', function() {
      $('.js-site-nav,.js-site-nav-trigger').removeClass('active');
    });

    initNavigation();
    initTextAnimations();
  }

  function initNavigation() {
    $('.js-site-nav-trigger')
      .on('click', function() {
        $('.js-site-nav,.js-site-nav-trigger,.js-site-title-wrapper,.js-site-header,.js-site-content')
          .toggleClass('active');
        // sturdy.positionNavigation();
      });

    // $(window).on('scroll', _.debounce(sturdy.positionNavigation, 50));
    // $(window).on('resize', _.debounce(sturdy.positionNavigation, 50));
    //
    // sturdy.positionNavigation();
  }

  function initTextAnimations() {
    animateElement($('.featured-post-heading'), 'fadeIn', function() {
      $('.featured-post').addClass('active');
    });
  }

  // Private

  function positionNavigation() {
    // Return if laptop
    if ($(window).width() > 1024) {
      return false;
    }

    var top = 0;

    if ($('.js-site-nav.active').length !== 0) {
      var isAtTop, offset;

      isAtTop = window.scrollY <= 156;
      offset = isAtTop ? 156 : 20;
      top = window.scrollY + offset;
    }

    $('.js-site-nav').velocity('stop')
      .velocity({
        duration: 0,
        easing: 'linear',
        top: top
      });

    $('.js-site-nav-trigger').velocity('stop')
      .velocity({
        duration: 0,
        easing: 'linear',
        top: top
      });
  }

  function animateElement($element, effect, inCallback) {
    $element.textillate({
      minDisplayTime: 0,
      in: {
        effect: effect,
        sync: false,
        callback: inCallback
      }
    });
  }

})();
