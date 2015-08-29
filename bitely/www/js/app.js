// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bitely', ['ionic','ionic.service.core','bitely.controllers','ngOpenFB', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $location, $localstorage, ngFB) {

  ngFB.init({appId: '1646690858946373'});


  $rootScope.globals = $localstorage.getObject('globals') || {};
  // $rootScope.$on('$locationChangeStart', function (event, next, current) {
  //   // SI NO ESTA EN EL SPLASH Y NO ESTA LOGGEADO
  //   if ($location.path() !== '/splash' && !$rootScope.globals.currentUser) {
  //       $location.path('/splash');
  //   }
  // });

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

.config(function($stateProvider, $urlRouterProvider) {


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
    url: '/venue/:id',
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

  .state('app.order.payment', {
    url:'/payment',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-payment.html'
      }
    }
  })   

  .state('app.order.review', {
    url:'/review',
    views: {
      'orderContent': {
        //controller: 'OrderCtrl',
        templateUrl : 'views/order-review.html'
      }
    }
  })       
  
  $urlRouterProvider.otherwise('/app/home');


});