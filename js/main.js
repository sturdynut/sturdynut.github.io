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
  sturdy.scrollBeast = new ScrollBeast();
  sturdy.checkTopPosition = checkTopPosition;
  sturdy.hints = {
    isLaptop: function() {
      return $(window).width() >= 1024;
    }
  };

  // Initialization

  $(init);

  function init() {
    $(function() {
      $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
    });

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

    $(window).on('scroll', _.throttle(sturdy.checkTopPosition, 50));
    $(window).on('resize', _.throttle(sturdy.checkTopPosition, 50));

    sturdy.checkTopPosition();
  }

  function initTextAnimations() {
    animateElement($('.featured-post-heading'), 'fadeIn');
    $('.featured-post').addClass('active');

    $(function() {
      $('[data-in-effect]').textillate({
        loop: false,
        autoStart: true
      });
    });
  }

  // Private

  function checkTopPosition() {
    if ($(window).scrollTop() > 300) {
      $('.btn-top').fadeIn();
      if (!sturdy.hints.isLaptop()) {
        $('.btn-home').fadeOut();
      }
      $('.site-header').addClass('site-header--condensed');
    } else {
      $('.btn-top').fadeOut();
      if (!sturdy.hints.isLaptop()) {
        $('.btn-home').fadeIn();
      }
      $('.site-header').removeClass('site-header--condensed');
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
