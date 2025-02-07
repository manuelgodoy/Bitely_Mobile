angular.module('bitely.controllers')
.directive('ionRadioFix', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<label class="item item-radio">' +
        '<input type="radio" name="radio-group">' +
        '<div class="radio-content">' +
          '<div class="item-content disable-pointer-events" ng-transclude></div>' +
          '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
        '</div>' +
      '</label>',

    compile: function(element, attr) {
      if (attr.icon) {
        var iconElm = element.find('i');
        iconElm.removeClass('ion-checkmark').addClass(attr.icon);
      }

      var input = element.find('input');
      angular.forEach({
          'name': attr.name,
          'value': attr.value,
          'disabled': attr.disabled,
          'ng-value': attr.ngValue,
          'ng-model': attr.ngModel,
          'ng-disabled': attr.ngDisabled,
          'ng-change': attr.ngChange,
          'ng-required': attr.ngRequired,
          'required': attr.required
      }, function(value, name) {
        if (angular.isDefined(value)) {
            input.attr(name, value);
          }
      });

      return function(scope, element, attr) {
        scope.getValue = function() {
          return scope.ngValue || attr.value;
        };
      };
    }
  };
})
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
      var scrollTop =0;

      var fadeAmt;
      
      var header = $document[0].body.querySelector('.header-fader');
      var bar = $document[0].body.querySelector('.barraespecial');//('[nav-bar="active"]');
      var headerHeight = - 43 - 44+($window.innerWidth)*174/250;
      if (ionic.Platform.isIOS()){
        headerHeight = headerHeight -20;
      }
      var headerHeightextra = -20 + headerHeight;
      var titulin = $document[0].body.querySelector('.titlemargin');
      var menusin = $document[0].body.querySelector('.secmenu');
      
      element.bind('scroll', function(e) {
        var scrollTop = null;
        y = 0;
        opa = 1;
        otroFade = 0;        
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        } else if(e.target){
          scrollTop = e.target.scrollTop;
        }

      // function onScroll(e) {
      //   var scrollTop = e.detail.scrollTop;

        // console.log($rootScope)

        if(scrollTop >= 0) {
          // y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
          opa = Math.max(0, (headerHeightextra - scrollTop)/headerHeightextra);
          otroFade = Math.max(0,Math.min(1,(scrollTop-headerHeight+20)/20));
        } else {
          y = 0;
          opa = 1;
          otroFade = 0;
        }
        ionic.requestAnimationFrame(function() {
          header.style.opacity = opa;
          bar.style.backgroundColor = 'rgba(251,125,0,'+(otroFade)+')';
          menusin.style.opacity = otroFade;
          menusin.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + (otroFade-1)*-20 + 'px, 0)';
          titulin.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + (otroFade-1)*250 + '%, 0)';

        });

        prevY = scrollTop;
      })
    }
  }
});