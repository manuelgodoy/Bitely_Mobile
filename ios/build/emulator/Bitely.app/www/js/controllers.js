angular.module('bitely.controllers',[])
.controller('AppCtrl', function(Order, $ionicBackdrop, $cordovaToast, User, Auth, Order, $window, $cookies, $http, $localstorage,$rootScope, $scope, $location, $ionicLoading, $timeout, $ionicPopup, $cordovaFacebook) {

	//ALTO DE LA CARD
	$rootScope.cardHeight = 50+32+40+(($window.innerWidth-20));
	$rootScope.cardWidth = $window.innerWidth;
	$rootScope.platoWidth = $window.innerWidth * 0.40;

	$rootScope.venueImage = {height:$window.innerWidth-20+'px', width:$window.innerWidth-20+'px'}
	$rootScope.plateImage = {height:$window.innerWidth*.4+'px', width:$window.innerWidth*.4+'px'}


	$scope.login = function(from){
	$ionicBackdrop.retain();
    $cordovaFacebook.login(["email"])
    .then(function(success) {
        // console.log('success:',success);
        //$scope.respuesta.user = success;
        $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: success.authResponse.accessToken, fields: "id,name,last_name,first_name,email,picture.width(200).height(200)", format: "json" }})
        .then(function(theparams) {
        	theparams.data.access_token = success.authResponse.accessToken;
			$http.get('https://www.bitely.io/facebook_login_app',{ params:theparams.data}).then(function(){
				Order.query();
	 			User.get().$promise.then(function(data){
	        		$rootScope.creditcard = data.user;
	        		$localstorage.setObject('creditcard',data.user);

					$ionicBackdrop.release();
			 		if  (from==='home') {
						$location.path('/app/home');
			 		}

			 		if  (from==='order') {
			 			if (!$rootScope.creditcard.has_customertoken) {
			 				$location.path('/app/order/card');	
			 			} else {
			 				$location.path('/app/order/confirm');	
			 			}
			 		}

	 			});
			});
		Auth.setCredentials(theparams.data);

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
		$http.get('https://www.bitely.io/facebook_login_app',{ params:theparams}).then(function(){
				Order.query();
	 			User.get().$promise.then(function(data){
        			$rootScope.creditcard = data.user;
        			$localstorage.setObject('creditcard',data.user);
	 			});
			});
		Auth.setCredentials(theparams);
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
    		$rootScope.creditcard = data.user;;
    		$localstorage.setObject('creditcard',data.user);
 		})
 	}

	$scope.goHome = function(){
		$location.path('/app/home');
	}

 	$scope.goToOrder = function(){
 		// alert('click order');
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});

 		Order.query().$promise.then(function(order){
 			$ionicLoading.hide()
 			if ($rootScope.globals.currentUser.isguest) {
				$location.path('/app/order/personal');
	 		} else if (!$rootScope.creditcard.has_customertoken){
	 			$location.path('/app/order/card');	
	 		} else if (!$rootScope.order.is_posted) {
	 			$location.path('/app/order/confirm');
	 		} else if ($rootScope.order.is_paid) {
	 			// $location.path('/app/order/confirm');
	 		} else {
	 			$location.path('/app/order/payment');
	 		}
 		});

	


 	}

})
.controller('HomeCtrl', function($ionicPlatform,$cordovaToast, $scope, $timeout, $http, $cordovaGeolocation, Venues, gLocation) {

    $ionicPlatform.registerBackButtonAction(
        function () {
           ionic.Platform.exitApp();
        }, 100
	);

	$scope.moreDataCanBeLoaded = false;

	$scope.loaded = false;

	$scope.getlocation = false;

	$scope.user_loc = {};

	var test_location = {
		lat : "29.7377136",
        lon : "-95.58918089999997",
        rad : 20000
    }
	$scope.user_loc = test_location;


	var posOptions = {timeout: 10000, enableHighAccuracy: false};


	$scope.places = {};

  	
  	$cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
		$scope.user_loc = {
      		lat  : position.coords.latitude, 
      		lon : position.coords.longitude, 
      		rad : 500
  		}
  		gLocation.update({lat:position.coords.latitude, lon:position.coords.longitude});
  		$scope.getlocation = true;
  		Venues.get($scope.user_loc)
  		.$promise.then(function(data) {
    		$scope.places = data.venue_list;
			$scope.loaded = true;
  		}, function(){
  			$cordovaToast.show('Using test locations', 'short', 'bottom');
  			Venues.get(test_location)
  			.$promise.then(function(data) {
    			$scope.places = data.venue_list;
				$scope.loaded = true;
			})
  		});
	 // 	$timeout(function() {

		// 	$scope.loaded = true;

		// 	 $http.get('js/json/places.json').then(function(lugares){
		// 	 	$scope.places = lugares.data;
		// 	 });
		// }, 2000);  	
    }, function(err) {
  		$cordovaToast.show('No geolocation found', 'short', 'bottom');
  		$cordovaToast.show('Using test locations', 'short', 'bottom');
  			Venues.get(test_location)
  			.$promise.then(function(data) {
    			$scope.places = data.venue_list;
				$scope.loaded = true;
			})
    });



	$scope.doRefresh = function() {
      	$cordovaGeolocation.getCurrentPosition(posOptions)
    	.then(function (position) {
			$scope.user_loc = {
	      		lat  : position.coords.latitude, lon : position.coords.longitude, rad : 500
	  		}
  			gLocation.update({lat:position.coords.latitude, lon:position.coords.longitude});
	  		Venues.get($scope.user_loc)
	  		.$promise.then(function(data) {
	    		$scope.places = data.venue_list;
	  		}).finally(function(){
	  			$scope.$broadcast('scroll.refreshComplete');
	  		});	  		
    	}, function(err) {
  			$cordovaToast.show('No geolocation found', 'short', 'bottom');
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

.controller('VenueCtrl', function($ionicPlatform, $location, $cordovaToast, $scope, $stateParams, $rootScope, $timeout, $ionicModal, $http, Venue, Menu, Order){

    $ionicPlatform.registerBackButtonAction(
        function () {
            $location.path('/app/home');
        }, 100
	)


	$scope.venue = {};
	//$scope.venue.name = $stateParams.name_id;
	$scope.menus = {};
	$scope.loaded= false;

	Venue.get({rest_id: $stateParams.rest_id, name_id: $stateParams.name_id}, function(data){
		$scope.venue = data.venue;
	});

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
		

		var losoptions = {};
		var error = false;

		angular.forEach( item.option_groups, function(value, key){
			if (value.type==='OPTION_ADD') {
				angular.forEach( value.options, function(ovalue, okey){
					if (ovalue.checked) {
						losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+', "type":"OPTION_ADD"}';
						$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(ovalue.price);
					};
				})
			}
			if (value.type==='OPTION_CHOOSE') {
				if (item.choosed) {
					angular.forEach( item.choosed, function(ovalue, okey){
						losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+', "type":"OPTION_CHOOSE"}';
						$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(ovalue.price);
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
			options: losoptions,
			restid: $stateParams.rest_id
		}
		if (!error) {
			Order.update(order);
			$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(order.itemprice);
        	$cordovaToast.show('Plate ordered!', 'short', 'center');
			$scope.addModal.hide();
		};

	};	
	$scope.sendOrder = function(item, $event){

    	$event.stopPropagation();

		if (!$rootScope.order.is_paid && $rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== $stateParams.rest_id ) {
			
        $cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {

			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {
				$cordovaToast.show('Plate Ordered!', 'short', 'center');
				$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(item.price);
				Order.update({
					action: 'add', 
					itemkey: item.key, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: $stateParams.name_id, 
					restid: $stateParams.rest_id
				});
			}
		}
	}

	$scope.goPlate = function(key){
		if (key) {
			$location.path('/app/plate/'+key);
		}
	}

})
.controller('PlateCtrl', function( Item, Order, $location, $ionicPlatform, $rootScope, $stateParams, $scope, $timeout, $http, $ionicModal, $cordovaToast) {

	$scope.plate = {};

	$scope.loaded = false;


	Item.save({itemkey:$stateParams.id}).$promise.then(function(plate){
		console.log(plate)
		$scope.plate = plate.item;
		$scope.loaded =  true;

	    $ionicPlatform.registerBackButtonAction(
	        function () {
	            $location.path('/app/menu/'+plate.item.restaurant.restaurant_id+'/'+plate.item.restaurant.name)
	        }, 100
		);

	});

	$ionicModal.fromTemplateUrl('views/addtoorder.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.addModal = modal;
	});
	$scope.closeAddModal = function() {
		$scope.addModal.hide();
	};
	$scope.chosedOrder = function(item) {
		

		var losoptions = {};
		var error = false;

		angular.forEach( item.option_groups, function(value, key){
			if (value.type==='OPTION_ADD') {
				angular.forEach( value.options, function(ovalue, okey){
					if (ovalue.checked) {
						losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+', "type":"OPTION_ADD"}';
						$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(ovalue.price);
					};
				})
			}
			if (value.type==='OPTION_CHOOSE') {
				if (item.choosed) {
					angular.forEach( item.choosed, function(ovalue, okey){
						losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+'}, "type":"OPTION_CHOOSE"}';
						$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(ovalue.price);
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
			options: losoptions,
			restname: item.restaurant.name, 
			restid: item.restaurant.restaurant_id
		}
		if (!error) {
			Order.update(order);
			$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(order.itemprice);
        	$cordovaToast.show('Plate ordered!', 'short', 'center');
			$scope.addModal.hide();
		};

	};	
	$scope.sendOrder = function(item){

		if (!$rootScope.order.is_paid && $rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== item.restaurant.restaurant_id ) {
			
        $cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {


			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {
				$cordovaToast.show('Plate Ordered!', 'short', 'center');
				$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(item.price);
				Order.update({
					action: 'add', 
					itemkey: item.key, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: item.restaurant.name, 
					restid: item.restaurant.restaurant_id
				});
			}
		}
	}

})

.controller('MeProfileCtrl', function(User, $scope, $timeout){
	// $scope.profile = {};
	// User.get()
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
	// console.log('code:', code);
	// console.log('result:', result);

	if (result.error) {
    	$ionicLoading.hide();
        // console.log('it failed! error: ' + result.error.message);
        $cordovaToast.show('it failed! error: ' + result.error.message, 'short', 'bottom');
    } else {
    	$ionicLoading.hide();
        User.save({},
			"stripeToken="+result.id
			//+"&last4="+result.card.last4+"&brand="+result.card.brand+"date="+result.card.exp_month+"/"+result.card.exp_year 
		).$promise.then(function(){
 			User.get().$promise.then(function(data){
        		$rootScope.creditcard = data.user;
        		$localstorage.setObject('creditcard',data.user);
 			});
	   		document.getElementById('cvc').value = "";
	   		document.getElementById('expiry').value = "";
	   		document.getElementById('number').value = "";

	   		$cordovaToast.show('Card Saved', 'short', 'center'); 			
		});

    }

	};

})
.controller('rateController', function($scope, Rating){
	$scope.rate = {};


	$scope.hechanged = function(key){
		Rating.update({
			rating: $scope.rate,
			key: key
		}).$promise.then(function(){
			$cordovaToast.show('Plate rated!', 'short', 'bottom');
		})
	}
})
.controller('OrderCtrl', function($state, $ionicPlatform,$ionicPopup, $cordovaToast,$localstorage, $rootScope, $scope, $timeout, $location, $rootScope, $ionicLoading, User, Order, Pay){
	$scope.loaded = true;

	// $scope.$on('$stateChangeSuccess', 
	// function(event, toState, toParams, fromState, fromParams){ 
	// 	// console.log('event:',event);
	// 	// console.log('toState:',toState.name);
	// 	if (toState.name === 'app.order.confirm' || toState.name ===  "app.order.payment") {
	// 		$rootScope.order = {};
	// 		$scope.loaded = false;
	// 		Order.query().$promise.then(function(order){
	// 			$scope.loaded = true;
	// 		});
	// 	}

	//  })




    $ionicPlatform.registerBackButtonAction(
        function () {
            $location.path('/app/menu/'+$rootScope.restaurant.restaurant_id+'/'+$rootScope.restaurant.name)
        }, 100
	);

	$scope.card = {};

	$scope.card.checkoutForm2={};

	$scope.addItem = function(item, restaurant, $index){

		$cordovaToast.show('Plate added!', 'short', 'bottom');
		var order = {
			action: 'add', 
			itemkey: item.key, 
			itemprice: item.price, 
			itemname: item.name || item.text,
			restname: restaurant.name,
			restid: restaurant.restaurant_id
		};
		if (item.options) {
			order.options = item.options
			$rootScope.order.total = parseFloat($rootScope.order.total) + parseFloat(item.options_array.price);
		};

		$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity+1;

		$rootScope.order.total = parseFloat($rootScope.order.total)+parseFloat(item.price);
		Order.update(order);
		
	}	



	$scope.removeItem = function(item, restaurant, $index){
		$cordovaToast.show('Plate removed!', 'short', 'bottom');
		var order = {
			action: 'remove', 
			itemkey: item.key, 
			itemprice: item.price, 
			itemname: item.name || item.text, 
			restname: restaurant.name,
			restid: restaurant.restaurant_id
		};
		if (item.options) {
			$rootScope.order.total = parseFloat($rootScope.order.total) - parseFloat(item.options_array.price);
			order.options = item.options;
		}
		$rootScope.order.total = parseFloat($rootScope.order.total)-parseFloat(item.price);
		$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity-1;
		Order.update(order);
	}

	$scope.tip = {};
	$scope.doPay = function(){
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
		Pay.save({tip:$scope.tip.tip}).$promise.then(function(order){
    		$ionicLoading.hide();
    		Order.query();
			$location.path('/app/order/success');
    		$rootScope.order.total;
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
	// alert('saved!');
	// console.log('code:', code);
	// console.log('result:', result);

	if (result.error) {
    	$ionicLoading.hide();
        // console.log('it failed! error: ' + result.error.message);
        $cordovaToast.show('it failed! error: ' + result.error.message, 'short', 'bottom');
    } else {
    	$ionicLoading.hide();
        User.save({},
			"stripeToken="+result.id
			//+"&last4="+result.card.last4+"&brand="+result.card.brand+"date="+result.card.exp_month+"/"+result.card.exp_year 
		).$promise.then(function(){
 			User.get().$promise.then(function(data){
        		$rootScope.creditcard = data.user;
        		$localstorage.setObject('creditcard',data.user);
 			});
	   		document.getElementById('cvc').value = "";
	   		document.getElementById('expiry').value = "";
	   		document.getElementById('number').value = "";
			$location.path('/app/order/confirm');	 			
		});
		// var alertPopup = $ionicPopup.alert({
		// 	title: 'Succes!',
		// 	template: 'Credit Card saved',
		// 	okType: 'button-royal'
		// });
    	}
	}
	
	//RAAAAATING
	// $scope.rating ={}


	$scope.doConfirm = function(){
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
		Order.save().$promise.then(function(order){
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Confirmed',
				subTitle: 'your order has been sent to the kitchen',
				okText: 'OK',
				okType: 'button-royal'
			}).then(function(res) {
				$location.path('/app/menu/'+$rootScope.order.restaurant.restaurant_id+'/'+$rootScope.order.restaurant.name);
			});
		})
	}

	$scope.goMenu = function(){
		if ($rootScope.order.restaurant) {
			$location.path('/app/menu/'+$rootScope.order.restaurant.restaurant_id+'/'+$rootScope.order.restaurant.name);
		} else {
			$location.path('/app/home');
		}
	}
})
;