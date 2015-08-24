// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bitely', ['ionic','bitely.controllers','ngCordovaOauth'])

.run(function($ionicPlatform, $rootScope, $location, $localstorage) {

  $rootScope.globals = $localstorage.getObject('globals') || {};
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
  });
  
  $urlRouterProvider.otherwise('/app/home');


});