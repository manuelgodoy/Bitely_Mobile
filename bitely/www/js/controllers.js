angular.module('bitely.controllers',['ngOpenFB'])
.controller('AppCtrl', function($localstorage,$rootScope, $scope, $location, $ionicLoading, $timeout, $ionicPopup, ngFB) {

	$rootScope.orderTotal = 0;

	$scope.login = function(){

		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});

		//CAMBIAR EL URL A https://www.facebook.com/connect/login_success.html
		//http://localhost:8100/oauthcallback.html
	    // ngFB.login({scope: 'email'}).then(
    	//     function (response) {
     //    	    if (response.status === 'connected') {
     //        	    console.log('Facebook login succeeded');
     //            	//$scope.closeLogin();
     //            	ngFB.api({
     //    				path: '/me',
     //    				params: {fields: 'id,name,email,picture.width(200).height(200)'}
    	// 			}).then(
     //    			function (user) {
     //        			$rootScope.globals.currentUser = user;
     //        			$location.path('/app/home');
					// 	$ionicLoading.hide();
     //    			},
     //    			function (error) {
     //        			alert('Facebook error: ' + error.error_description);
     //    			});

     //        	} else {
     //            	alert('Facebook login failed');
     //        	}
     //    });


		$timeout(function(){
			$rootScope.globals.currentUser = {
			  "id": "10154225207801393",
			  "name": "Gian F. Olivieri",
			  "email": "gian.olivieri@gmail.com",
			  "picture": {
			    "data": {
			      "is_silhouette": false,
			      "url": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/c6.0.50.50/p50x50/9771_10153577592966393_7987985602653327226_n.jpg?oh=b992903c85f9ca760556c179277939a1&oe=563C4327&__gda__=1450369685_31fb6f8bfc4bbcdac1e649af04c66784"
			    }
			  }
			};
			$location.path('/app/home');
			$ionicLoading.hide();
		}, 2000);
		
	};
	$scope.asGuest = function(){
		//SIMULAR LOGIN
		$rootScope.globals.currentUser = {
				name: 'Guest',
				picture: {data: {url:'img/blank.gif'}},
				isguest: true
			};

		//VA A HOME
		$location.path('/app/home');
	};
	$scope.logout =function(){
   		var confirmPopup = $ionicPopup.confirm({
     		title: 'Logout',
     		template: 'Are you sure you want to logout?'
   		});
   		confirmPopup.then(function(res) {
     	if(res) {
     		$localstorage.setObject('globals', {});
			$rootScope.globals.currentUser = {};
			$location.path('/splash');
     	}
   		});
 	};
})
.controller('HomeCtrl', function( $scope, $timeout, $http, $cordovaGeolocation) {

	$scope.moreDataCanBeLoaded = true;

	$scope.loaded = false;

	$scope.user_loc = {};

	var test_location = {
		lat : "29.7377136",
        lon : "-95.58918089999997",
        radius : 200
    }
	$scope.user_loc = test_location;


	var posOptions = {timeout: 10000, enableHighAccuracy: false};


  	
  	$cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
		$scope.user_loc = {
      		lat  : position.coords.latitude, long : position.coords.longitude, radius : 200
  		}
    }, function(err) {
    	$scope.user_loc.error('no geoloc :(');
    });




	$scope.places = {};

    $timeout(function() {

		$scope.loaded = true;

		 $http.get('js/json/places.json').then(function(lugares){
		 	$scope.places = lugares.data;
		 });
	}, 2000);

	$scope.doRefresh = function() {
      $timeout(function() {

      	$cordovaGeolocation.getCurrentPosition(posOptions)
    	.then(function (position) {
			$scope.user_loc = {
	      		lat  : position.coords.latitude, long : position.coords.longitude, radius : 200
	  		}
    	}, function(err) {
    		$scope.user_loc.error('no geoloc :(');
    	});

		 $http.get('js/json/places.json').then(function(lugares){
		 	$scope.places = lugares.data;
		 });

      }, 1000).finally(function() {
       $scope.$broadcast('scroll.refreshComplete');
     });
	};
	$scope.loadMore = function() {
  		$timeout(function() {
		 $http.get('js/json/places.json').then(function(lugares){
		 	morePlaces = lugares.data;
  			$scope.places = $scope.places.concat(morePlaces);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		 });
  		}, 1000);
  	};      
})

.controller('VenueCtrl', function($scope, $rootScope, $timeout, $ionicModal, $http){

	$scope.venur = {};

	$scope.loaded= false;

	$timeout(function(){
		$scope.loaded = true;

		 $http.get('js/json/venue.json').then(function(lugares){
		 	$scope.venue = lugares.data;
		 });
		
	}, 2000);

	$ionicModal.fromTemplateUrl('views/addtoorder.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.addModal = modal;
	});
	$scope.closeAddModal = function() {
		$scope.addModal.hide();
	};
	$scope.sendOrder = function(key, option_groups){
		if (option_groups) {
		 	$scope.addModal.options = option_groups;
			$scope.addModal.show();
		} else {

		}
		
	}

})
.controller('PlateCtrl', function( $scope, $timeout, $http) {

	$scope.plate = {};

	$scope.loaded = false;

	$timeout(function(){
		$scope.loaded = true;
		 $http.get('js/json/plate.json').then(function(lugares){
		 	$scope.plate = lugares.data;
		 });

	}, 2000);



})

.controller('ProfileCtrl', function($scope, $timeout){
	$scope.profile = {};
	$scope.profile.data = {};
	$scope.profile.data.state ='';

	$scope.$watch("profile.data.state", function(newValue, oldValue){
        if (newValue.length > 2){
            $scope.profile.data.state = oldValue;
        }
    });

	$scope.saveProfile = function() {
		alert('saved!');
	};

})

.controller('CardCtrl', function($scope, $timeout){
	$scope.card = {};
	$scope.card.data = {};


	$scope.card.data.number ='';

	$scope.$watch("card.data.number", function(newValue, oldValue){
        if (newValue.length > 19){
            $scope.card.data.number = oldValue;
        }
    });

	$scope.card.data.cvc ='';

	$scope.$watch("card.data.cvc", function(newValue, oldValue){
        if (newValue.toString().length > 4){
            $scope.card.data.cvc = oldValue;
        }
    });    

	$scope.saveCard = function() {
		alert('saved!');
	};

})

.controller('OrderCtrl', function($scope, $timeout, $location){

	$scope.goCard = function(){
		$location.path('/app/order/card');
	}
	$scope.goPayment = function(){
		$location.path('/app/order/payment');
	}
	$scope.goReview = function(){
		$location.path('/app/order/review');
	}
	$scope.goHome = function(){
		$location.path('/app');
	}
})
;