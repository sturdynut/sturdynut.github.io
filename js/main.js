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
      $('.js-site-nav-container,.js-site-nav-trigger').removeClass('active');
    });

    initNavigation();
    initTextAnimations();
  }

  function initNavigation() {
    $('.js-site-nav-trigger')
      .on('click', function() {
        $('.js-site-nav-container,.js-site-nav-trigger').toggleClass('active');
        sturdy.positionNavigation();
      });

    $(window).on('scroll', _.debounce(sturdy.positionNavigation, 50));
    $(window).on('resize', _.debounce(sturdy.positionNavigation, 50));

    sturdy.positionNavigation();
  }

  function initTextAnimations() {
    animateElement($('.featured-post-heading'), 'fadeInLeftBig', function() {
      $('.featured-post-button').addClass('active');
    });
  }

  function initLogoAnimation() {
    var maxAnimations = 30;
    var animationCount = 0;
    $('.site-header')
      .on('mouseover', _.debounce(function() {

        if (animationCount === maxAnimations) {
          $('.site-header').off('mouseover');
          return false;
        }

        $('.site-logo svg').velocity({
          translateX: '175px',
          rotateZ: '1440deg'
        }, 500);

        $('.site-title').velocity({
          left: '-42px'
        }, 500);

        animationCount++;
      }, 300))
      .on('mouseout', _.debounce(function() {
        if (animationCount === maxAnimations) {
          $('.site-header').off('mouseout');
          return false;
        }

        $('.site-title').velocity('finish').velocity({
          left: '0'
        }, 500);

        $('.site-logo svg').velocity('finish').velocity({
          translateX: '0',
          rotateZ: '-1440deg'
        }, 500);

        animationCount++;
      }, 300));
  }

  // Private

  function positionNavigation() {
    if (!$('.site-nav').length) {
      return false;
    }

    var elementTriggerTopY = $('.site-nav').offset().top;
    var isLaptop = $(window).width() > 1024;
    var isAtTop = window.scrollY === 0;
    var isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    var mobileTop = isAtTop ? 156 : 0;
    var offset = isLaptop ? 55 : mobileTop;
    var top = window.scrollY + offset;

    if (isAtBottom === true) {
      $('.site-nav').velocity('stop')
        .velocity({
          duration: 0,
          easing: 'linear',
          top: top
        });
    } else {
      $('.site-nav').velocity('stop')
        .velocity({
          duration: 0,
          easing: 'linear',
          top: top
        });
    }
  }

  function animateElement($element, effect, inCallback) {
    $element.textillate({
      minDisplayTime: 3000,
      in: {
        effect: effect,
        sync: true,
        callback: inCallback
      }
    });
  }

})();
