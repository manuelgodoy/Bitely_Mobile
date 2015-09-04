angular.module('bitely.controllers',[])
.controller('AppCtrl', function($cordovaToast, User, Auth, Order, $window, $cookies, $http, $localstorage,$rootScope, $scope, $location, $ionicLoading, $timeout, $ionicPopup, $cordovaFacebook) {

	//ALTO DE LA CARD
	$rootScope.cardHeight = 50+32+40+(($window.innerWidth-20)*(460/740));
	$rootScope.cardWidth = $window.innerWidth;
	$rootScope.platoWidth = $window.innerWidth * 0.40;

	$scope.login = function(from){
    $cordovaFacebook.login(["email"])
    .then(function(success) {
        console.log('success:',success);
        //$scope.respuesta.user = success;
        $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: success.authResponse.accessToken, fields: "id,name,last_name,first_name,email,picture.width(200).height(200)", format: "json" }})
        .then(function(theparams) {
		$http.get('https://www.bitely.io/facebook_login_app',{ params:theparams.data});
		Auth.setCredentials(theparams.data);
		Order.query();
		//chedk CC
 		User.get().$promise.then(function(data){
 			if (data.user.has_customertoken) {
        		$rootScope.creditcard = {isset:true};
        		$localstorage.setObject('creditcard',{isset:true});
 			}
 		})

 		if  (from==='home') {
			$location.path('/app/home');
 		}

 		if  (from==='order') {
			$location.path('/app/home');
 		}


        }, function(error){
          console.log('get error:', error);
          $scope.respuesta = error;
        });
    }, function (error) {
        console.log(error);
        $cordovaToast.show(error, 'short', 'center');
    });
		
	};

    $scope.fakebook = function(){
    	theparams = {
    	access_token :"CAAT3dgau4T4BABfpGWkgGhmlMwyQLPdRVlRWyakXaimAy0U01MTBAjGK9PZC8VmmJpsAaGWUI2Go9MRmJFdNZCjmnoz17y45jLUQxdxcFIEoXnCOc7D5yaEim5W53j9DnlCwPx0o5lnKqLa3SZBZCtY1HLKPYx2ZBbEN18VO1kK5mRoHiTi78WoUdQd7OxAXzKW86ZA4HPM6iVqFspwcZAreCpnYJeFnBgZD",
		email	: "gian.olivieri@gmail.com",
		name : "Gian F. Olivieri",
		first_name	: "Gian",
		last_name: "Olivieri",
		picture: {
			    "data": {
			      "is_silhouette": false,
			      "url": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/c6.0.50.50/p50x50/9771_10153577592966393_7987985602653327226_n.jpg?oh=b992903c85f9ca760556c179277939a1&oe=563C4327&__gda__=1450369685_31fb6f8bfc4bbcdac1e649af04c66784"
			    }
			}
		};
		$http.get('https://www.bitely.io/facebook_login_app',{ params:theparams});
		Auth.setCredentials(theparams);
		Order.query();
		//chedk CC
		// User.query().$promise.then(function(user){
		// 	console.log()
		// })
		$location.path('/app/home');
    }


	$scope.asGuest = function(){
		//SIMULAR LOGIN
		Auth.setCredentials({
				name: 'Guest',
				picture: {data: {url:'img/blank.gif'}},
				isguest: true
			});
		//VA A HOME
		Order.query();
		$location.path('/app/home');
	};

	$scope.logout =function(){
   		var confirmPopup = $ionicPopup.confirm({
     		title: 'Logout',
     		template: 'Are you sure you want to logout?',
     		okType: 'button-royal'
   		});
   		confirmPopup.then(function(res) {
     	if(res) {
     		Auth.clearCredentials();
			$location.path('/splash');
     	}
   		});
 	};
 	$scope.getOrder = function(){
 		Order.query().$promise.then(function(data){
 			
 		})
 	}
 	$scope.getUser = function(){
 		User.get().$promise.then(function(data){
 			if (data.user.has_customertoken) {
        		$rootScope.creditcard = {isset:true};
        		$localstorage.setObject('creditcard',{isset:true});
 			}
 		})
 	}


 	$scope.goToOrder = function(){

 		if ($rootScope.globals.currentUser.isguest) {
			$location.path('/app/order/personal');
 		} else if (!$rootScope.creditcard.isset){
 			$location.path('/app/order/card');	
 		} else if (!$rootScope.order.is_posted) {
 			$location.path('/app/order/confirm');
 		} else {
 			$location.path('/app/order/payment');
 		}


 	}

})
.controller('HomeCtrl', function( $scope, $timeout, $http, $cordovaGeolocation, Venues) {

	$scope.moreDataCanBeLoaded = false;

	$scope.loaded = false;

	$scope.getlocation = false;

	$scope.user_loc = {};

	var test_location = {
		lat : "29.7377136",
        lon : "-95.58918089999997",
        rad : 2000
    }
	$scope.user_loc = test_location;


	var posOptions = {timeout: 10000, enableHighAccuracy: false};


	$scope.places = {};

  	
  	$cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
		$scope.user_loc = {
      		lat  : position.coords.latitude, 
      		long : position.coords.longitude, 
      		rad : 500
  		}
  		$scope.getlocation = true;
  		Venues.get($scope.user_loc)
  		.$promise.then(function(data) {
    		$scope.places = data.venue_list;
			$scope.loaded = true;
  		});
	 // 	$timeout(function() {

		// 	$scope.loaded = true;

		// 	 $http.get('js/json/places.json').then(function(lugares){
		// 	 	$scope.places = lugares.data;
		// 	 });
		// }, 2000);  	
    }, function(err) {
    	$scope.errorloc ='no geoloc :(';
    });



	$scope.doRefresh = function() {
      	$cordovaGeolocation.getCurrentPosition(posOptions)
    	.then(function (position) {
			$scope.user_loc = {
	      		lat  : position.coords.latitude, long : position.coords.longitude, rad : 200
	  		}
	  		Venues.get($scope.user_loc)
	  		.$promise.then(function(data) {
	    		$scope.places = data.venue_list;
	  		}).finally(function(){
	  			$scope.$broadcast('scroll.refreshComplete');
	  		});	  		
    	}, function(err) {
    		$scope.user_loc.error('no geoloc :(');
    	});
	};

	// $scope.loadMore = function() {
 //  		$timeout(function() {
	// 	 $http.get('js/json/places.json').then(function(lugares){
	// 	 	morePlaces = lugares.data.venue_list;
 //  			$scope.places = $scope.places.concat(morePlaces);
	// 		$scope.$broadcast('scroll.infiniteScrollComplete');
	// 	 });
 //  		}, 1000);
 //  	};      
})

.controller('VenueCtrl', function($cordovaToast, $scope, $stateParams, $rootScope, $timeout, $ionicModal, $http, Venue, Menu, Order){

	$scope.venue = {};
	$scope.venue.name = $stateParams.name_id;
	$scope.menus = {};
	$scope.loaded= false;

	// Venue.get({rest_id: $stateParams.rest_id}, function(data){
	// 	$scope.venue = data.venue;
	// });

	Menu.get({rest_id: $stateParams.rest_id, name_id:$stateParams.name_id}
		,function(data){
			$scope.menus = data.menu;
			$scope.loaded= true;
		}
		,function(err){
			console.log(err);
			$scope.error = err;
			$scope.loaded= true;
		}
	);


	// $timeout(function(){
	// 	$scope.loaded = true;

	// 	 $http.get('js/json/venue.json').then(function(lugares){
	// 	 	$scope.venue = lugares.data.venue;
	// 	 });

	// 	 $http.get('js/json/menu.json').then(function(menus){
	// 	 	$scope.menus = menus.data.menu;
	// 	 });		 
		
	// }, 2000);

	$ionicModal.fromTemplateUrl('views/addtoorder.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.addModal = modal;
	});
	$scope.closeAddModal = function() {
		$scope.addModal.hide();
	};
	$scope.chosedOrder = function(item) {
		
        $cordovaToast.show('Plate ordered!', 'short', 'center');

		var losoptions = {};
		var error = false;

		angular.forEach( item.option_groups, function(value, key){
			if (value.type==='OPTION_ADD') {
				angular.forEach( value.options, function(ovalue, okey){
					if (ovalue.checked) {
						losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+'}';
					};
				})
			}
			if (value.type==='OPTION_CHOOSE') {
				if (item.choosed) {
					angular.forEach( item.choosed, function(ovalue, okey){
						losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+'}';
					})
				} else {
        			$cordovaToast.show('Must choose an option', 'short', 'center');
					error = true;
				}
			}
		})

		order = {
			action: 'add', 
			itemkey: item.key, 
			itemprice: item.price, 
			itemname: item.name || item.text, 
			restname: $stateParams.name_id, 
			options: JSON.stringify(losoptions),
			restid: $stateParams.rest_id
		}
		if (!error) {
			Order.update(order);
			$scope.addModal.hide();
		};

	};	
	$scope.sendOrder = function(item){

		if ($rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== $stateParams.rest_id ) {
			
        $cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {


			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {
				$cordovaToast.show('Plate Ordered!', 'short', 'center');
				Order.update({
					action: 'add', 
					itemkey: item.key, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: $stateParams.name_id, 
					restid: $stateParams.rest_id
				})
			}
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

.controller('CardCtrl', function($cordovaToast,$scope, $timeout, User, $rootScope, $localstorage, $ionicLoading, $ionicPopup){
	$scope.card = {};

	$scope.card.checkoutForm={};
	$scope.enviame = function(){
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
		$timeout(function() {
			document.getElementById('elboton').click()
		}, 0);
	}

	$scope.stripeCallback = function(code, result) {
		//alert('saved!');
	console.log('code:', code);
	console.log('result:', result);

	if (result.error) {
        console.log('it failed! error: ' + result.error.message);
    } else {
    	$ionicLoading.hide();
        User.save({},
			"stripeToken="+result.id
		);
        var datos = {
        	isset : true,
        	last4 : '******* '+result.card.last4,
        	brand: result.card.brand,
        	date:result.card.exp_month+'/'+result.card.exp_year 
        }

        $rootScope.creditcard = datos;
        $localstorage.setObject('creditcard',datos);


   		document.getElementById('cvc').value = "";
   		document.getElementById('expiry').value = "";
   		document.getElementById('number').value = "";

   		$cordovaToast.show('Card Saved', 'short', 'center');

		// var alertPopup = $ionicPopup.alert({
		// 	title: 'Succes!',
		// 	template: 'Credit Card saved',
		// 	okType: 'button-royal'
		// });
    }

	};

})

.controller('OrderCtrl', function($cordovaToast,$localstorage, $rootScope,$scope, $timeout, $location, $rootScope, $ionicLoading, User, Order, Pay){

	$scope.card = {};

	$scope.card.checkoutForm2={};
	// $scope.myOptions = {
	// 	1: '1',
	// 	2: '2',
	// 	3: '3',
	// 	4: '4',
	// 	5: '5',
	// 	6: '6',
	// 	7: '7',
	// 	8: '8',
	// 	9: '9',
	// 	10: '10',
	// };

	// $scope.typeOf = function(val) { return typeof(val); };
	// $scope.toInt = function(val) {
	// 	console.log(val, parseInt(val,10));
	// 	return parseInt(val,10); };

	$scope.addItem = function(item, restaurant){

		$cordovaToast.show('Plate added!', 'short', 'bottom');
		Order.update({
			action: 'add', 
			itemkey: item.key, 
			itemprice: item.price, 
			itemname: item.name || item.text,
			restname: restaurant.name,
			restid: restaurant.restaurant_id
		})
		
	}	



	$scope.removeItem = function(item, restaurant){
		$cordovaToast.show('Plate removed!', 'short', 'bottom');
		Order.update({
			action: 'remove', 
			itemkey: item.key, 
			itemprice: item.price, 
			itemname: item.name || item.text, 
			restname: restaurant.name,
			restid: restaurant.restaurant_id
		});
	}

	$scope.tip = {};
	$scope.doPay = function(){
		Pay.save({},"tip="+$scope.tip.tip).$promise.then(function(order){
			$location.path('/app/order/success');
		})
	}


	$scope.goCard = function(){
		$location.path('/app/order/card');
	}

	$scope.goConfirm = function(){

		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
		$timeout(function() {
			document.getElementById('elboton2').click()
		}, 0);
	};

	$scope.stripeCallback2 = function(code, result) {
		//alert('saved!');
	console.log('code:', code);
	console.log('result:', result);

	if (result.error) {
        console.log('it failed! error: ' + result.error.message);
    } else {
    	$ionicLoading.hide();
        User.save({},
			"stripeToken="+result.id
		);
        var datos = {
        	isset : true,
        	last4 : '******* '+result.card.last4,
        	brand: result.card.brand,
        	date:result.card.exp_month+'/'+result.card.exp_year 
        }

        $rootScope.creditcard = datos;
        $localstorage.setObject('creditcard',datos);


   		document.getElementById('cvc').value = "";
   		document.getElementById('expiry').value = "";
   		document.getElementById('number').value = "";


		$location.path('/app/order/confirm');
		// var alertPopup = $ionicPopup.alert({
		// 	title: 'Succes!',
		// 	template: 'Credit Card saved',
		// 	okType: 'button-royal'
		// });
    }




	}
	$scope.goPayment = function(){
		$location.path('/app/order/payment');
		Order.save().$promise.then(function(order){
			console.log(order);
		})
	}
	$scope.goHome = function(){
		$location.path('/app');
	}
})
;