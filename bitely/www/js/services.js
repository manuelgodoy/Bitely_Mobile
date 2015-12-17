var urlBase = "https://www.bitely.io/bitely/api/v3.0/";

angular.module('bitely.controllers')

.service('returnToState', function($ionicHistory, $location, $rootScope){
  return function(stateName, home){
    var moved = false;
    var historyId = $ionicHistory.currentHistoryId();
    var history = $ionicHistory.viewHistory().histories[historyId];
    for (var i = history.stack.length - 1; i >= 0; i--){
      if (history.stack[i].stateName == stateName){
        $ionicHistory.backView(history.stack[i]);
        $ionicHistory.goBack();
        moved = true;
      }
    }
    if (!moved) {
      if (home){
        $location.path('/app/home')
      } else {
        $location.path('/app/menu/'+$rootScope.order.restaurant.restaurant_id+'/'+$rootScope.order.restaurant.name);
      }
    }
  }
})

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

.factory('Auth', function($localstorage, $rootScope, $cookies, $http, $location, $state){
  var service = {};

  service.setCredentials = function(todalainfo){

      // console.log(todalainfo)

      if (!todalainfo.isguest) {

        Ionic.io();
        var push = new Ionic.Push({
          // "debug": true,
          onNotification: function(notification){
            // alert('hey!');
            $state.go('app.order.success');
            console.log(notification);
          },
          "pluginConfig": {
            "ios": {
              "badge": true,
              "sound": true
            },
            "android": {
              "iconColor": "#fb7d00",
              "icon": "bitely_ic"
            }
          }
        });

        push.register(function(pushToken) {
          var user = Ionic.User.current();
          user.id = todalainfo.nickname;
          user.set('image', todalainfo.picture);
          console.log("Device token:",pushToken.token);
          user.addPushToken(pushToken);
          user.save();
        });

      }

      $rootScope.globals = {
          currentUser: todalainfo
      };

      $localstorage.setObject('globals',{currentUser:todalainfo});
  }

  service.clearCredentials = function(){
      Ionic.io();
      var push = new Ionic.Push({
        // "debug": true
      });      
      var user = Ionic.User.current();
      // user.removePushToken(pushToken);

      $rootScope.globals = {};
      $http.get('https://www.bitely.io/logout_app');
      $localstorage.setObject('globals',{});
      $localstorage.remove('ionic_io_user_e739e0e8');
      $cookies.remove("session");
      $rootScope.creditcard = {};
      $localstorage.setObject('creditcard',{});
      $rootScope.order = {};
      $localstorage.setObject('order',{});
  }

  return service;
})
.factory('Login', function($resource){
  return $resource('https://www.bitely.io/facebook_login_app');
})
.factory('EmailLogin', function($resource){
  return $resource('https://www.bitely.io/generic_login_app');
})
.factory('EmailSignUp', function($resource){
  return $resource('https://www.bitely.io/generic_signup_app');
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
  return $resource(urlBase+'user');
})
// .factory('User', function($resource){
//   return $resource(urlBase+'user', null, {
//     'save': {
//         method:'POST',
//         headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
//     }
//   });
// })
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

.factory('Orders', function($resource){
  return $resource(urlBase+'orders');
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
        'getSingle': {
          method: 'GET',
        },

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
              // if (!$rootScope.order.total) $rootScope.order.total = order.data.total;
              $rootScope.order.appTotal = order.data.sub_total;
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
              // angular.forEach( order.data.order_plates, function(value, key){
              //   if (value.menu_item.options) {
              //     order.data.order_plates[key].menu_item.options_array = [];
              //     order.data.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
              //   }
              // });
              $rootScope.order = order.data;
              $rootScope.order.appTotal = order.data.sub_total;
              if (order.data.is_paid) {
                $rootScope.order.appTotal = 0;
                // order.data.total = 0;
                // order.data.tax_rate = 0;
                // order.data.order_plates = {};
              }              
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
              // angular.forEach( order.data.order_plates, function(value, key){
              //   if (value.menu_item.options) {
              //     order.data.order_plates[key].menu_item.options_array = [];
              //     order.data.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
              //   }
              // });
              $rootScope.order = order.data;
              $rootScope.order.appTotal = order.data.sub_total;
              $localstorage.setObject('order',order.data);
            },
            responseError: function (data) {
              console.log('error in interceptor', order.data);
            }
          }
        }        
  });
})