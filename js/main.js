---
---

// 'use strict';

(function() {

  // 🌏 Helpers
  window.sturdy = {
    CONSTANTS: {
      CURSORS: {
        CAT_1: 'page-home--cat-activated-level-1',
        CAT_2: 'page-home--cat-activated-level-2',
        CAT_3: 'page-home--cat-activated-level-3',
      },
      LAPTOP_BREAKPOINT: 1024,
      OFFSET_BREAKPOINT_TWO: 200,
      OFFSET_BREAKPOINT_ONE: 10,
    },
    animateElement: ($element, effect, inCallback) => {
      $element.textillate({
        minDisplayTime: 0,
        in: {
          effect: effect,
          sync: false,
          callback: inCallback
        }
      });
    },
    augmentForOffset: () => {
      if (window.outerWidth < sturdy.CONSTANTS.LAPTOP_BREAKPOINT) {
        return false;
      }

      if (window.pageYOffset > sturdy.CONSTANTS.OFFSET_BREAKPOINT_ONE) {
        sturdy.classAdd('.site-content', 'site-content--condensed');
      } else {
        sturdy.classRemove('.site-content', 'site-content--condensed');
      }

      if (window.pageYOffset > sturdy.CONSTANTS.OFFSET_BREAKPOINT_TWO) {
        $('.btn-top').fadeIn();
        sturdy.classAdd('.site-header', 'site-header--condensed');
        sturdy.classAdd('.site-nav-trigger', 'site-nav-trigger--condensed');
      } else {
        $('.btn-top').fadeOut();
        sturdy.classRemove('.site-header', 'site-header--condensed');
        sturdy.classRemove('.site-nav-trigger', 'site-nav-trigger--condensed');
      }
    },
    classAdd: (selector, cssClass) => sturdy.query(selector).classList.add(cssClass),
    classRemove: (selector, cssClass) => sturdy.query(selector).classList.remove(cssClass),
    classRemoveAll: (selectors, cssClass) => sturdy.queryAll(selectors).forEach(
      element => element.classList.remove(cssClass)
    ),
    classToggleAll: (selectors, cssClass) => sturdy.queryAll(selectors).forEach(
      element => element.classList.toggle(cssClass)
    ),
    eventAdd: (element, event, handler, options) => element.addEventListener(event, handler, options),
    guard: (selector) => !sturdy.query(selector),
    query: selector => document.querySelector(selector),
    queryAll: selectors => document.querySelectorAll(selectors)
  }

  // Initialization

  function init() {
    initNavigation();
    initTextAnimations();
    initThreeJS();
    initDynamicPageBanner();
    initSlider(function() {
      sturdy.query('.featured-posts')
        .classList.add('animated', 'fadeIn')
      sturdy.query('.js-slider-buttons')
        .classList.add('animated', 'fadeIn')
    });
  }

  function initSlider(cb) {
    // Guard
    if (!sturdy.query('.js-slider')) {
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
    if (sturdy.guard('.page-banner-image--dynamic')) {
      return;
    }

    var bg = '/images/backgrounds/' + Math.ceil(Math.random() * 5) + '.jpg';
    sturdy.query('.page-banner-image--dynamic').setAttribute('src', bg);
  }

  function initThreeJS() {
    if (sturdy.guard('.threejs')) {
      return;
    }

    var renderer, scene, camera, particles, raycaster, intersects, mouse, particleXOffset, particleYOffset, intersected = {};
    var PARTICLE_SIZE = 15;

    create();
    animate();

    function create() {
      var container = sturdy.query('.threejs');
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

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      sturdy.query('.threejs').style.display = 'block';

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      sturdy.eventAdd(window, 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }, false);

      sturdy.eventAdd(document, 'mousemove', (event) => {
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
      sturdy.query('.js-scoreboard-score').innerHTML = intersectedCount;

      const selector = ".page-home";

      if (intersectedCount >= prizeScore * 8) {
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_1);
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_2);
        sturdy.classAdd(selector, sturdy.CONSTANTS.CURSORS.CAT_3);
      } else if (intersectedCount >= prizeScore * 4) {
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_1);
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_3);
        sturdy.classAdd(selector, sturdy.CONSTANTS.CURSORS.CAT_2);
      } else if (intersectedCount >= prizeScore) {
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_2);
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_3);
        sturdy.classAdd(selector, sturdy.CONSTANTS.CURSORS.CAT_1);
      } else {
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_1);
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_2);
        sturdy.classRemove(selector, sturdy.CONSTANTS.CURSORS.CAT_3);
      }
    }

    function render() {
      var geometry = particles.geometry;
      var attributes = geometry.attributes;
      var PRIZE_SCORE = 25;
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
    const selectors = '.js-site-nav, .js-site-nav-trigger, .js-site-title-wrapper, .js-site-header, .js-site-content';

    const siteContentEl = sturdy.query('.site-content');
    const jsSiteNavTriggerEl = sturdy.query('.js-site-nav-trigger');

    sturdy.eventAdd(siteContentEl,
      'click',
      () => sturdy.classRemoveAll(selectors, 'active')
    );

    sturdy.eventAdd(jsSiteNavTriggerEl,
      'click',
      () => sturdy.classToggleAll(selectors, 'active')
    );

    sturdy.eventAdd(window, 'scroll', _.throttle(sturdy.augmentForOffset, 50));
    sturdy.eventAdd(window, 'resize', _.throttle(sturdy.augmentForOffset, 50));

    sturdy.augmentForOffset();
  }

  function initTextAnimations() {
    sturdy.animateElement($('.featured-post-heading'), 'fadeIn');

    if (!sturdy.guard('.featured-post')) {
      sturdy.classAdd('.featured-post', 'active');
    }

    $('[data-in-effect]').textillate({
      loop: false,
      autoStart: true
    });
  }

  init();
})();
