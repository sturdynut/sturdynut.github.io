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
  }

  function initThreeJS() {
    var renderer, scene, camera;
    var spinDirection = true;
    // var isTargetedByMouse = true;
    var hitCount = 0;
    var isGrowing = true;
    var particles;

    var PARTICLE_SIZE = 20;

    var raycaster, intersects;
    var mouse, particleXOffset, particleYOffset, intersected = {}; //INTERSECTED;

    init();
    animate();

    function init() {
      var container = document.querySelector('.threejs');
      var cameraAspect = window.innerWidth / window.innerHeight; // Camera frustum aspect ratio.
      var cameraFov = 20; // Camera frustum vertical field of view.
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
      scene.background = new THREE.TextureLoader().load('/images/backgrounds/' + Math.ceil(Math.random() * 46) + '.jpg');
      // scene.background = new THREE.TextureLoader().load('/images/backgrounds/bg-main.jpeg');
      // scene.background = new THREE.TextureLoader().load('/images/backgrounds/46.jpg');
      /*
        BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
        width — Width; that is, the length of the edges parallel to the X axis. Optional; defaults to 1.
        height — Height; that is, the length of the edges parallel to the Y axis. Optional; defaults to 1.
        depth — Depth; that is, the length of the edges parallel to the Z axis. Optional; defaults to 1.
        widthSegments — Number of segmented rectangular faces along the width of the sides. Optional; defaults to 1.
        heightSegments — Number of segmented rectangular faces along the height of the sides. Optional; defaults to 1.
        depthSegments — Number of segmented rectangular faces along the depth of the sides. Optional; defaults to 1.
      */
      // Cube
      // var vertices = new THREE.BoxGeometry(200, 200, 200, 64, 64, 64).vertices;
      // Sphere
      var vertices = new THREE.SphereGeometry(100, 60, 60).vertices;
      var positions = new Float32Array(vertices.length * 3);
      var colors = new Float32Array(vertices.length * 3);
      var sizes = new Float32Array(vertices.length);

      var vertex;
      var color = new THREE.Color();

      for (var i = 0, l = vertices.length; i < l; i++) {
        vertex = vertices[i];
        vertex.toArray(positions, i * 3);

        // color.setHSL(288, 0.21, 0.52); // Purple
        // color.setHSL(55, 0.93, 0.68); // Yellow
        color.setHSL(0, 0, 1); // White
        color.toArray(colors, i * 3);

        // sizes[i] = PARTICLE_SIZE * 0.25;
        sizes[i] = Math.max(10, Math.random() * 40);
      }

      // Cube
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

      // Torus
      // var geometry = new THREE.TorusGeometry( 15, 60, 20, 100 );
      // var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true, wireframeLinejoin: 'round', wireframeLinewidth: 1, wireframeLinecap: 'round' } );
      // var mesh = new THREE.Mesh( geometry, material );
      // scene.add( mesh );

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      //

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      //

      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      // window.setInterval(function () {
      //   spinDirection = !spinDirection;
      // }, 10000);
    }

    function onDocumentMouseMove(event) {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
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
      var STEP = 0.05;
      var MAX_HIT = 2;
      var PRIZE_SCORE = 25;
      raycaster.setFromCamera(mouse, camera);
      intersects = raycaster.intersectObject(particles);

      // Spin it!
      particleXOffset = 0.00005;
      particleYOffset = 0.0001;
      particles.rotation.x = spinDirection
        ? particles.rotation.x + particleXOffset
        : particles.rotation.x - particleXOffset;
      particles.rotation.y = spinDirection
        ? particles.rotation.y + particleYOffset
        : particles.rotation.y - particleYOffset;

      // Check for intersections with the cursor
      if (intersects.length > 0) {
        if (hitCount <= MAX_HIT && isGrowing) {
          hitCount += STEP;
        } else if (!isGrowing) {
          hitCount -= STEP;
        }

        if (hitCount >= MAX_HIT) {
          isGrowing = false;
          } else if (hitCount < STEP) {
          isGrowing = true;
        }

        for (var i = 0, l = intersects.length; i < l; i++) {
          var intersectIndex = intersects[i].index;
          var previouslyIntersected = intersected[intersectIndex];
          if (!previouslyIntersected) {
            attributes.size.array[intersectIndex] = PARTICLE_SIZE * Math.max(0.5, hitCount);
            attributes.size.needsUpdate = true;
            intersected[intersectIndex] = true;
          }

          // Kill off intersections to reduce points
          // Better way possibly would be to do an interval that
          // kills them off after a given set of time...
          // i.e. () => if (count > 25 && timeElapsed > 10sec) reduce by 1...every 500ms
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
