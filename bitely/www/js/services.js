
//LIVE
// var dominio = "www.bitely.io";

//DEV
var dominio = "bitely-test.appspot.com";


var urlBase = "https://"+dominio+"/bitely/api/v3.0/";

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
            if (!notification._raw.additionalData.foreground ) {
              $state.go(notification._payload.state, JSON.parse(notification._payload.stateParams));
            }
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
      $http.get('https://'+dominio+'/logout_app');
      $localstorage.setObject('globals',{});
      $localstorage.remove('ionic_io_user_e739e0e8');
      $cookies.remove("session");
      $localstorage.remove('ionic_io_push_token');
      $localstorage.remove('ionic_analytics_event_queue_e739e0e8');
      $rootScope.creditcard = {};
      $localstorage.setObject('creditcard',{});
      $rootScope.order = {};
      $localstorage.setObject('order',{});
  }

  return service;
})
.factory('Login', function($resource){
  return $resource('https://'+dominio+'/facebook_login_app');
})
.factory('EmailLogin', function($resource){
  return $resource('https://'+dominio+'/generic_login_app');
})
.factory('EmailSignUp', function($resource){
  return $resource('https://'+dominio+'/generic_signup_app');
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

.factory('Tip', function($resource){
  return $resource(urlBase+'tip');
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
  return $resource(urlBase+'order_tmp', null, {
        'getSingle': {
          method: 'GET'
        },

        'update': { 
          method:'PUT',
          interceptor: {
            response: function(order){
              // console.log('order update:', order);
              // angular.forEach( order.data.object.order.order_plates, function(value, key){
              //   if (value.menu_item.options) {
              //     order.data.object.order.order_plates[key].menu_item.options_array = [];
              //     order.data.object.order.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
              //   }
              // });
              $rootScope.order.is_posted = order.data.object.order.is_posted;
              $rootScope.order.is_paid = order.data.object.order.is_paid;
              // if (!$rootScope.order.total) $rootScope.order.total = order.data.object.order.total;
              $rootScope.order.sub_total = order.data.object.order.sub_total;
              $rootScope.order.tax = order.data.object.order.tax;
              $rootScope.order.total = order.data.object.order.total;
              $rootScope.order.appTotal = order.data.object.order.num_plates;
              $rootScope.order.tax_rate = order.data.object.order.tax_rate;
              $rootScope.order.restaurant = order.data.object.order.restaurant;
              $localstorage.setObject('order',$rootScope.order);
              return order;
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
              // angular.forEach( order.data.object.order.order_plates, function(value, key){
              //   if (value.menu_item.options) {
              //     order.data.object.order.order_plates[key].menu_item.options_array = [];
              //     order.data.object.order.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
              //   }
              // });
              $rootScope.order = order.data.object.order;
              $rootScope.order.appTotal = order.data.object.order.num_plates;
              if (order.data.object.order.is_paid) {
                $rootScope.order.appTotal = 0;
                // order.data.object.order.total = 0;
                // order.data.object.order.tax_rate = 0;
                // order.data.object.order.order_plates = {};
              }              
              $localstorage.setObject('order',order.data.object.order);
            },
            responseError: function (data) {
              console.log('error in interceptor', order.data.object.order);
            }
          }
        },
        'save': {
          method:'POST',
          interceptor: {
            response: function(order){
              console.log('order save:', order);
              // angular.forEach( order.data.object.order.order_plates, function(value, key){
              //   if (value.menu_item.options) {
              //     order.data.object.order.order_plates[key].menu_item.options_array = [];
              //     order.data.object.order.order_plates[key].menu_item.options_array.push(JSON.parse(value.menu_item.options));
              //   }
              // });
              $rootScope.order = order.data.object.order;
              $rootScope.order.appTotal = order.data.object.order.num_plates;
              $localstorage.setObject('order',order.data.object.order);
            },
            responseError: function (data) {
              console.log('error in interceptor', order.data.object.order);
            }
          }
        }        
  });
})