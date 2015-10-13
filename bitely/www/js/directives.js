angular.module('bitely.controllers')

.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
        }, function (value) {
          if (value==='/static/img/no_image.jpg') {
            element.attr('src', 'img/no_image.jpg');  
          }
      });

      element.bind('error', function() {
        element.attr('src', 'img/no_image.jpg');
      });
    }
  }
})
.directive('fadeImage', function($document, $window, $rootScope) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attr) {
      var starty = scope.$eval(attr.headerShrink) || 0;
      var shrinkAmt;

      var amt;

      var y = 0;
      var opa = 1;
      var prevY = 0;
      var scrollDelay = 0.4;

      var fadeAmt;
      
      var header = $document[0].body.querySelector('.header-fader');
      var headerHeight = - 10 - 44+($window.innerWidth)*174/250;
      
      function onScroll(e) {
        var scrollTop = e.detail.scrollTop;

        // console.log($rootScope)

        if(scrollTop >= 0) {
          y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
          opa = Math.max(0, (headerHeight - scrollTop)/headerHeight);
        } else {
          y = 0;
          opa = 1;
        }
        // console.log(y);

        ionic.requestAnimationFrame(function() {
          fadeAmt = 1 - (y / headerHeight);
          // header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
          header.style.opacity = opa;
          if(y >= headerHeight && $rootScope.headerFade === false) {
            // console.log('kl;ajsldk');
            $rootScope.headerFade = true;
            $rootScope.$apply();
          } 
          if(y < headerHeight && $rootScope.headerFade === true) {
            $rootScope.headerFade = false;
            $rootScope.$apply();
          }
          // for(var i = 0, j = header.children.length; i < j; i++) {
          //   header.children[i].style.opacity = fadeAmt;
          // }
        });

        prevY = scrollTop;
      }

      element.bind('scroll', onScroll);
    }
  }
});