var urlBase = "https://www.bitely.io/bitely/api/v3.0/";

angular.module('bitely.controllers')
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    remove: function(key) {
      return $window.localStorage.removeItem(key);
    }
  }
}])

.factory('Auth', function($localstorage, $rootScope, $cookies, $http){
  var service = {};

  service.setCredentials = function(todalainfo){
      $rootScope.globals = {
          currentUser: todalainfo
      };
      $localstorage.setObject('globals',{currentUser:todalainfo});
  }

  service.clearCredentials = function(){
      $rootScope.globals = {};
      $http.get('https://www.bitely.io/logout_app');
      $localstorage.setObject('globals',{});
      $cookies.remove("session");
      $rootScope.creditcard = {};
      $localstorage.setObject('creditcard',{});
      $rootScope.order = {};
      $localstorage.setObject('order',{});
  }

  return service;
})


.factory('Venues', function($resource){
  return $resource(urlBase+'venue_list');
})

.factory('Venue', function($resource){
  return $resource(urlBase+'venue');
})

.factory('Menu', function($resource){
  return $resource(urlBase+'menu');
})
.factory('User', function($resource){
  return $resource(urlBase+'user', null, {
    'save': {
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
    }
  });
})
// .factory('Item', function($resource){
//   return $resource(urlBase+'item', null, {
//     'get': {
//         method:'POST',
//         headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
//     }
//   });
// })
.factory('Item', function($resource){
  return $resource(urlBase+'item');
})

// .factory('Pay', function($resource){
//   return $resource(urlBase+'pay', null, {
//     'save': {
//         method:'POST',
//         headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
//     }
//   });
// })
.factory('Pay', function($resource){
  return $resource(urlBase+'pay');
})

.factory('gLocation', function($resource){
  return $resource(urlBase+'location', null, {
        'update': { 
          method:'PUT',
         }
  });
})

.factory('Rating', function($resource){
  return $resource(urlBase+'rating', null, {
        'update': { 
          method:'PUT',
         }
  });
})
.factory('Order', function($resource, $localstorage, $rootScope){
  return $resource(urlBase+'order', null, {
        'update': { 
          method:'PUT',
          interceptor: {
            response: function(order){
              console.log('order update:', order);
              // angular.forEach( order.data.order_plates, function(value, key){
              //   if (value.menu_item.options) {
              //     order.data.order_plates[key].menu_item.options_array = [];
              //     order.data.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
              //   }
              // });
              $rootScope.order.is_posted = order.data.is_posted;
              $rootScope.order.is_paid = order.data.is_paid;
              if (!$rootScope.order.total) $rootScope.order.total = order.data.total;
              $rootScope.order.tax_rate = order.data.tax_rate;
              $rootScope.order.restaurant = order.data.restaurant;

              $localstorage.setObject('order',$rootScope.order);
            },
            responseError: function (data) {
              console.log('error in interceptor', data);
            }
          }
         },
        'query': {
          method:'GET',
          interceptor: {
            response: function(order){
              console.log('order query:', order);
              angular.forEach( order.data.order_plates, function(value, key){
                if (value.menu_item.options) {
                  order.data.order_plates[key].menu_item.options_array = [];
                  order.data.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
                }
              });
              if (order.data.is_paid) {
                order.data.total = 0;
                order.data.tax_rate = 0;
                order.data.order_plates = {};
              }
              $rootScope.order = order.data;
              $localstorage.setObject('order',order.data);
            },
            responseError: function (data) {
              console.log('error in interceptor', order.data);
            }
          }
        },
        'save': {
          method:'POST',
          interceptor: {
            response: function(order){
              console.log('order save:', order);
              angular.forEach( order.data.order_plates, function(value, key){
                if (value.menu_item.options) {
                  order.data.order_plates[key].menu_item.options_array = [];
                  order.data.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
                }
              });
              $rootScope.order = order.data;
              $localstorage.setObject('order',order.data);
            },
            responseError: function (data) {
              console.log('error in interceptor', order.data);
            }
          }
        }        
  });
})