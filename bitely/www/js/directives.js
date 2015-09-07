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
});