//'ionic.service.analytics',
angular.module('bitely', ['ionic','ionic.service.core','ionic.rating','bitely.controllers', 'ngCordova', 'ngResource', 'ngCookies', 'angularPayments', 'ngIOS9UIWebViewPatch'])

//$ionicAnalytics
.run(function($http, $cordovaStatusbar, $cookies, $ionicPlatform, $rootScope, $location, $localstorage, $window, $state) {

  // 1646690858946373
  // cookie: session
  
  //ngFB.init({appId: '1397986197168446'});


  // DEV
  $window.Stripe.setPublishableKey('pk_test_knVqvEMFxZsgserDdUhovk24');

  // PROD
  // $window.Stripe.setPublishableKey('pk_live_2iaARh4PfVVs2hZCFPMGO8iG');


  $rootScope.globals = $localstorage.getObject('globals') || {};
  $rootScope.order   = $localstorage.getObject('order') || {};
  $rootScope.creditcard   = $localstorage.getObject('creditcard') || {};

  // if ($rootScope.globals.currentUser && !$rootScope.globals.currentUser.isguest) {
  //   Ionic.io();
  //   Ionic.User.load($rootScope.globals.currentUser.nickname).then(
  //     function(loadedUser){
  //       Ionic.User.current(loadedUser);
  //       user = Ionic.User.current();
  //     }, 
  //     function(error){
  //       console.log('something went wrong: ',error);
  //     });
  // }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // SI NO ESTA EN EL SPLASH Y NO ESTA LOGGEADO
    if ($location.path() !== '/splash' && !$rootScope.globals.currentUser) {
        $location.path('/splash');
    }
  });

  $ionicPlatform.ready(function() {

  var user;

  if ($rootScope.globals.currentUser && !$rootScope.globals.currentUser.isguest) {
    $localstorage.remove('ionic_io_user_e739e0e8');
    $localstorage.remove('ionic_io_push_token');
    Ionic.io();
    Ionic.User.load($rootScope.globals.currentUser.nickname).then(
      function(loadedUser){
        Ionic.User.current(loadedUser);
        user = Ionic.User.current();
      }, 
      function(error){
        console.log('something went wrong: ',error);
      });


    //ANALITYCS 

    // $ionicAnalytics.register({
    //   dryRun: true
    // });


    //PUSH
    var push = new Ionic.Push({
      // "debug": true,
      onNotification: function(notification){
        // $state.go('app.order.success');
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
        // var user = Ionic.User.current();
        // console.log(user);
        // user.id = $rootScope.globals.currentUser.nickname;
        // user.set('image', $rootScope.globals.currentUser.picture);
        user.addPushToken(pushToken);
        user.save();
      });
    }


    // $cordovaFacebook.getLoginStatus().then(function(success){
    //   if (success.status === 'connected') {
    //     $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: success.authResponse.accessToken, fields: "id,name,last_name,first_name,email,picture.width(200).height(200)", format: "json" }})
    //     .then(function(theparams) {
    //       theparams.data.access_token = success.authResponse.accessToken;
    //       $http.get('https://www.bitely.io/facebook_login_app',{ params:theparams.data}).then(function(){
    //         Order.query();
    //         User.get().$promise.then(function(data){
    //           $rootScope.creditcard = data.user;
    //           $localstorage.setObject('creditcard',data.user);
    //         });
    //       });
    //     Auth.setCredentials(theparams.data);
    //     $location.path('/app/home');
    //     })
    //   }
    // });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    // if(window.StatusBar) {
      //StatusBar.styleDefault();
      // $cordovaStatusbar.styleHex('#fb7d00');
    // }
  if (window.StatusBar) {
    if (ionic.Platform.isAndroid()) {
      StatusBar.backgroundColorByHexString('#c96401');
    } else {
      // StatusBar.styleLightContent();
    }
  }    
  });
})

//, $ionicAutoTrackProvider
.config(function($stateProvider, $httpProvider, $ionicConfigProvider) {
  

 // $ionicAutoTrackProvider.disableTracking('State Change');
 // $ionicAutoTrackProvider.disableTracking('Tap');

 $ionicConfigProvider.views.swipeBackEnabled(false);
 

 $httpProvider.defaults.withCredentials = true;

  //ROUTES
  $stateProvider

  .state('splash', {
    url: '/splash',
    templateUrl: 'views/splash.html',
    controller: 'AppCtrl'
  })

  .state('app',{
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    // cache:false,
    url: '/home',
    views: {
      'appContent':{
        templateUrl: "views/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.venue', {
    url: '/menu/:rest_id/:name_id',
    views: {
      'appContent': {
        templateUrl: 'views/venue.html',
        controller: 'VenueCtrl'
      }
    }
  })
  .state('app.venueSearch', {
    url: '/menusearch/:rest_id/:name_id',
    views: {
      'appContent': {
        templateUrl: 'views/restsearch.html',
        controller: 'VenueSearchCtrl'
      }
    }
  })

  .state('app.plate', {
    url: '/plate/:id',
    views: {
      'appContent': {
        templateUrl: 'views/plate.html',
        controller: 'PlateCtrl'
      }
    }
  })

  .state('app.debug', {
    url: '/debug',
    cache: false,
    views: {
      'appContent': {
        templateUrl: 'views/debug.html',
        controller: 'DebugCtrl'
      }
    }
  })  

  .state('app.editProfile', {
    url:'/edit-profile',
    views: {
      'appContent': {
        templateUrl : 'views/edit-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'appContent':{
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.profile', {
    url:'/profile',
    cache:false,
    views: {
      'appContent': {
        templateUrl : 'views/profile.html',
        controller: 'MeProfileCtrl'
      }
    }
  })  

  .state('app.addCard', {
    url:'/add-card',
    views: {
      'appContent': {
        templateUrl : 'views/add-card.html',
        controller: 'CardCtrl'
      }
    }
  })

  .state('app.receipts',{
    url:'/receipts',
    cache: false,
    views: {
      'appContent': {
        templateUrl: 'views/receipts.html',
        controller: 'ReceiptsCtrl'
      }
    }
  })

  .state('app.orderid',{
    url:'/orderid/:id',
    views: {
      'appContent': {
        templateUrl: 'views/orderid.html',
        controller: 'OrderIdCtrl'
      }
    }
  })  

  .state('app.order', {
    url:'/order',
    cache:false,
    abstract:true,
    views: {
      'appContent': {
        templateUrl : 'views/order.html',
        controller: 'OrderCtrl'
      }
    }
  })

  .state('app.order.personal', {
    url:'/personal',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-personal.html'
      }
    }
  })

  .state('app.order.card', {
    url:'/card',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-card.html'
      }
    }
  })

  .state('app.order.confirm', {
    url:'/confirm',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-confirm.html'
      }
    }
  })   

  .state('app.order.payment', {
    url:'/payment',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-payment.html'
      }
    }
  })  
  .state('app.order.success', {
    url:'/success',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-success.html'
      }
    }
  })  
  .state("otherwise", {
    url: "*path",
    template: "",
    controller: [
              '$state',
      function($state) {
        $state.go('app.home')
      }]
  });
  
  // $urlRouterProvider.otherwise('/app/home');


});