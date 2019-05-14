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
    initThreeJS();
    initDynamicPageBanner();
    initSlider(function() {
      document.querySelector('.featured-posts')
        .classList.add('animated', 'fadeIn')
      document.querySelector('.js-slider-buttons')
        .classList.add('animated', 'fadeIn')
    });
  }

  function initSlider(cb) {
    // Guard
    if (!document.querySelector('.js-slider')) {
      return;
    }

    $('.js-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      adaptiveHeight: true,
      autoplaySpeed: 30000,
      appendArrow: '.js-slider-buttons',
      prevArrow: '.js-slider-prev',
      nextArrow: '.js-slider-next'
    });

    cb();
  }

  function initDynamicPageBanner() {
    // Guard
    if (!document.querySelector('.page-banner-image--dynamic')) {
      return;
    }

    var bg = '/images/backgrounds/' + Math.ceil(Math.random() * 5) + '.jpg';
    document.querySelector('.page-banner-image--dynamic').setAttribute('src', bg);
  }

  function initThreeJS() {
    // Guard
    if (!document.querySelector('.threejs')) {
      return;
    }

    var renderer, scene, camera, particles, raycaster, intersects, mouse, particleXOffset, particleYOffset, intersected = {};
    var PARTICLE_SIZE = 15;

    init();
    animate();

    function init() {
      var container = document.querySelector('.threejs');
      var cameraAspect = window.innerWidth / window.innerHeight; // Camera frustum aspect ratio.
      var cameraFov = 15; // Camera frustum vertical field of view.
      var cameraNear = 1; // Camera frustum near plane.
      var cameraFar = 10000; // Camera frustum far plane.

      camera = new THREE.PerspectiveCamera(
        cameraFov,
        cameraAspect,
        cameraNear,
        cameraFar
      );
      camera.position.z = 250;

      scene = new THREE.Scene();
      scene.background = new THREE.TextureLoader().load('/images/backgrounds/bg-main.jpeg');
      var vertices = new THREE.SphereGeometry(100, 60, 60).vertices;
      var positions = new Float32Array(vertices.length * 3);
      var colors = new Float32Array(vertices.length * 3);
      var sizes = new Float32Array(vertices.length);

      var vertex;
      var color = new THREE.Color();

      for (var i = 0, l = vertices.length; i < l; i++) {
        vertex = vertices[i];
        vertex.toArray(positions, i * 3);
        color.setHSL(0, 0, 1);
        color.toArray(colors, i * 3);

        sizes[i] = PARTICLE_SIZE;
      }

      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

      var material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0xFFFFFF) },
          texture: {
            value: new THREE.TextureLoader().load('/images/textures/sprites/disc.png')
          }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        alphaTest: 0.9
      });

      particles = new THREE.Points(geometry, material);
      particles.rotation.x += 5000;
      particles.rotation.y += 0;
      scene.add(particles);

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      document.querySelector('.threejs').style.display = 'block';

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }, false);

      document.addEventListener('mousemove', function (event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }, false);
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function renderScore(prizeScore) {
      var intersectedCount = Object.keys(intersected).length;
      document.querySelector('.js-scoreboard-score').innerHTML = intersectedCount;

      if (intersectedCount >= prizeScore) {
        document.querySelector('.page-home').classList.toggle('page-home--cat-activated', true);
      } else {
        document.querySelector('.page-home').classList.toggle('page-home--cat-activated', false);
      }
    }

    function render() {
      var geometry = particles.geometry;
      var attributes = geometry.attributes;
      var PRIZE_SCORE = 100;
      raycaster.setFromCamera(mouse, camera);
      intersects = raycaster.intersectObject(particles);

      // Spin it!
      particleXOffset = 0.00005;
      particleYOffset = 0.0001;
      particles.rotation.x += particleXOffset;
      particles.rotation.y -= particleYOffset;

      // Check for intersections with the cursor
      if (intersects.length > 0) {
        for (var i = 0, l = intersects.length; i < l; i++) {
          var intersectIndex = intersects[i].index;
          var previouslyIntersected = intersected[intersectIndex];
          if (!previouslyIntersected) {
            attributes.size.array[intersectIndex] = PARTICLE_SIZE * 2;
            attributes.size.needsUpdate = true;
            intersected[intersectIndex] = true;
          }

          // Kill off intersections to reduce points
          window.setTimeout(function() {
            delete intersected[intersectIndex];

            attributes.size.array[intersectIndex] = PARTICLE_SIZE;
            attributes.size.needsUpdate = true;

            renderScore(PRIZE_SCORE);
          }, 10000);
        }
      }

      renderScore(PRIZE_SCORE);
      renderer.render(scene, camera);
    }
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
        $('.btn-back').fadeOut();
      }
      $('.site-header').addClass('site-header--condensed');
      $('.site-nav-trigger').addClass('site-nav-trigger--condensed');
    } else {
      $('.btn-top').fadeOut();
      if (!sturdy.hints.isLaptop()) {
        $('.btn-back').fadeIn();
      }
      $('.site-header').removeClass('site-header--condensed');
      $('.site-nav-trigger').removeClass('site-nav-trigger--condensed');
    }
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
