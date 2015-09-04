// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bitely', ['ionic','ionic.service.core','bitely.controllers', 'ngCordova', 'ngResource', 'ngCookies', 'angularPayments'])

.run(function($cookies, $ionicPlatform, $rootScope, $location, $localstorage, $window) {
  // 1646690858946373
  // cookie: session
  
  //ngFB.init({appId: '1397986197168446'});


  $window.Stripe.setPublishableKey('pk_test_knVqvEMFxZsgserDdUhovk24');

  $rootScope.globals = $localstorage.getObject('globals') || {};
  $rootScope.order   = $localstorage.getObject('order') || {};
  $rootScope.creditcard   = $localstorage.getObject('creditcard') || {};
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // SI NO ESTA EN EL SPLASH Y NO ESTA LOGGEADO
    if ($location.path() !== '/splash' && !$rootScope.globals.currentUser) {
        $location.path('/splash');
    }
  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
 

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

  .state('app.plate', {
    url: '/plate/:id',
    views: {
      'appContent': {
        templateUrl: 'views/plate.html',
        controller: 'PlateCtrl'
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

  .state('app.addCard', {
    url:'/add-card',
    views: {
      'appContent': {
        templateUrl : 'views/add-card.html',
        controller: 'CardCtrl'
      }
    }
  })

  .state('app.order', {
    url:'/order',
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
  
  $urlRouterProvider.otherwise('/app/home');


});