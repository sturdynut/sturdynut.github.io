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
  window.sturdy.onScroll = onScroll;
  window.sturdy.onResize = onResize;
  window.sturdy.hints = {
    isLaptop: function() {
      return $(window).width() > 1024;
    }
  }

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
      });

    $(window).on('scroll', _.debounce(sturdy.onScroll, 100));
    $(window).on('resize', _.debounce(sturdy.onResize, 100));

    updateLogo();
  }

  function initTextAnimations() {
    animateElement($('.featured-post-heading'), 'fadeIn');
    $('.featured-post').addClass('active');
  }

  function onScroll() {
    updateLogo();
  }

  function onResize() {
    updateLogo();
  }

  // Private

  function updateLogo() {
    if (!$('.post-header').is(':visible')) {
      return false;
    }

    var pos = getPositionInfo();
    var postHeader = $('.post-header');
    var postHeaderPos = postHeader.offset().top + postHeader.height();
    if (pos.top > postHeaderPos) {
      $('.js-site-title-wrapper').addClass('dark');
    }
    else {
      $('.js-site-title-wrapper').removeClass('dark');
    }
  }

  function getPositionInfo() {
    var headerOffset = 156;
    var isAtTop = window.scrollY <= headerOffset;
    var offset = isAtTop ? headerOffset : 20;

    return {
      isAtTop: isAtTop,
      offset: offset,
      top: window.scrollY + offset
    };
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
