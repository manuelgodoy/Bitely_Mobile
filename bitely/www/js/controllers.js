angular.module('bitely.controllers',[])
.controller('AppCtrl', 
	function(returnToState, Login, Order, $ionicBackdrop, $cordovaToast, User, Auth, Order, $window, $cookies, 
		$http, $localstorage, $rootScope, $scope, $location, $ionicLoading, $timeout, $ionicPopup, $cordovaFacebook, $ionicHistory) {

	//ALTO DE LA CARD
	$rootScope.todoAlto = $window.innerHeight;
	$rootScope.cardHeight = 50+32+40+(($window.innerWidth-20));
	$rootScope.cardWidth = $window.innerWidth;
	$rootScope.platoWidth = $window.innerWidth * 0.40;
	$rootScope.headerFade = false;

	$rootScope.venueImage = {height:($window.innerWidth-20)*174/250+'px', width:$window.innerWidth-20+'px'}
	$rootScope.venueImageInner = {height:($window.innerWidth)*174/250+'px', width:$window.innerWidth+'px'}
	// $rootScope.plateImage = {height:$window.innerWidth*.4+'px', width:$window.innerWidth*.4+'px'}
	$rootScope.plateImage = {height:(($window.innerWidth)*.5*800/800)-25+'px'}


	$scope.getHistory = function(){
		// console.log($ionicHistory.viewHistory());
	}
	$scope.login = function(from){
	$ionicBackdrop.retain();
    $cordovaFacebook.login(["email","user_friends"])
    .then(function(success) {
    	Login.save({access_token:success.authResponse.accessToken}
		).$promise.then(function(res){
    		if (res.user!==null) {
			Auth.setCredentials(res.user);
			Order.query();
			$ionicBackdrop.release();
	 		if  (from==='home') {
				$location.path('/app/home');
	 		}

	 		if  (from==='order') {
	 			if (!$rootScope.globals.currentUser.has_customertoken) {
	 				$location.path('/app/order/card');
	 			} else {
	 				$location.path('/app/order/confirm');
	 			}
	 		}
	 		} else {
				$ionicBackdrop.release();
	 			$ionicPopup.alert({
					title: 'Error!',
					template: 'Login Failed',
					okType: 'button-royal'
				});
	 		}			
    	}, function(error){
          // console.log('get error:', error);
          $ionicBackdrop.release();
          $ionicPopup.alert({
				title: 'Error!',
				template: 'Login Failed',
				okType: 'button-royal'
			});
        });
    }, function (error) {
        // console.log(error);
        $cordovaToast.show(error, 'short', 'center');
    });
		
	};

    $scope.fakebook = function(from){

    	Login.save({access_token:"CAAT3dgau4T4BAEEdLSkD5YuzkJcpuBQ41YEWGlDJL4k7J08UAZCR1dzZCuPurmxKUrQvcfpDZAcUEBQCYLZBoSlGPOQeFeh4SOKlbEae2ig7p0PZCWNvOgK6RISZCoR3IdPaZCWDGP1s95LZA4kQJdaVRyWyQewZByxJF69ZCKi5TxsoOciC40tGXOGoNTYjMG2v1oKfQTQcKG0M7GCJKGQZAXv73w8b2UzSa8ZD"}
		).$promise.then(function(res){
    		// console.log(res);
    		if (res.user!==null){

			Auth.setCredentials(res.user);
			Order.query();
			$ionicBackdrop.release();
	 		if  (from==='home') {
				$location.path('/app/home');
	 		}

	 		if  (from==='order') {
	 			if (!$rootScope.globals.currentUser.has_customertoken) {
	 				$location.path('/app/order/card');
	 			} else {
	 				$location.path('/app/order/confirm');
	 			}
	 		}
	 		} else {
	 			$ionicPopup.alert({
					title: 'Error!',
					template: 'Login Failed',
					okType: 'button-royal'
				});
	 		}			
    	}, function(error){
          // console.log('get error:', error);
          $ionicBackdrop.release();
          $ionicPopup.alert({
				title: 'Error!',
				template: 'Login Failed',
				okType: 'button-royal'
			});
        });
    }


	$scope.asGuest = function(){
		//SIMULAR LOGIN
		Auth.setCredentials({
				fullname: 'Guest',
				picture: 'img/blank.gif',
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
		returnToState('app.home', true);
		$rootScope.scroll = 0;
		// $location.path('/app/home');
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
	 		} else if (!$rootScope.globals.currentUser.has_customertoken){
	 			$location.path('/app/order/card');	
	 		} else if (!$rootScope.order.is_posted) {
	 			$location.path('/app/order/confirm');
	 		} else if ($rootScope.order.is_paid) {
	 			// nunca es paid :'(
	 			$location.path('/app/order/success');
	 		} else {
	 			$location.path('/app/order/payment');
	 		}
 		});
 	}

})
.controller('DebugCtrl', function(User, Order, $scope){
	$scope.debug = {};
	$scope.debug.user = User.get();
	$scope.debug.order = Order.get();
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

  	

	ionic.Platform.ready(function(){
  	  	$cordovaGeolocation.getCurrentPosition(posOptions)
	    .then(function (position) {
			$scope.user_loc = {
	      		lat  : position.coords.latitude, 
	      		lon : position.coords.longitude, 
	      		rad : 200
	  		}
	  		gLocation.update({latitude:position.coords.latitude, longitude:position.coords.longitude});
	  		$scope.getlocation = true;
	  		Venues.get($scope.user_loc)
	  		.$promise.then(function(data) {
	    		$scope.places = data.venue_list;
				$scope.loaded = true;
	  		}, function(){
	  			$cordovaToast.show('Using test locations (server error 500)', 'short', 'bottom');
	  			Venues.get(test_location)
	  			.$promise.then(function(data) {
	    			$scope.places = data.venue_list;
					$scope.loaded = true;
				})
	  		});
	    }, function(err) {
	  		$cordovaToast.show('No geolocation found, pull to refresh', 'short', 'bottom');
	  			Venues.get(test_location)
	  			.$promise.then(function(data) {
	    			$scope.places = data.venue_list;
					$scope.loaded = true;
				})
	    });
  	});

	



	$scope.doRefresh = function() {
      	$cordovaGeolocation.getCurrentPosition(posOptions)
    	.then(function (position) {
			$scope.user_loc = {
	      		lat  : position.coords.latitude, lon : position.coords.longitude, rad : 500
	  		}
  			gLocation.update({latitude:position.coords.latitude, longitude:position.coords.longitude});
	  		Venues.get($scope.user_loc)
	  		.$promise.then(function(data) {
	    		$scope.places = data.venue_list;
	  		}).finally(function(){
	  			$scope.$broadcast('scroll.refreshComplete');
	  		});	  		
    	}, function(err) {
  			$cordovaToast.show('No geolocation found', 'short', 'bottom');
  			$scope.$broadcast('scroll.refreshComplete');
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
.controller('VenueCtrl', function( $window, $ionicPopover, $ionicScrollDelegate, $ionicPlatform, $location, $cordovaToast, $scope, $stateParams, $rootScope, $timeout, $ionicModal, $http, Venue, Menu, Order){

    $ionicPlatform.registerBackButtonAction(
        function () {
            $location.path('/app/home');
        }, 100
	)
	$scope.opaopa = 1
   	$scope.escrolliando = function(){
   		ionic.requestAnimationFrame(function() {
   		// console.log('jiji');
		   	var alto = $rootScope.cardWidth*174/200;
		   	opipi = (alto - $ionicScrollDelegate.$getByHandle('venueContent').getScrollPosition().top)/alto
		   	console.log( opipi )
		   	$scope.opaopa = opipi;
   		})
   	}

  // $scope.$on('$ionicView.beforeLeave', function(){
  //     // $rootScope.scroll = $ionicScrollDelegate.$getByHandle('venueContent').getScrollPosition().top
  //  });  
  // $scope.$on('$ionicView.enter', function(){
  // 	if (!$rootScope.scroll) $rootScope.scroll=0;
  //     $ionicScrollDelegate.$getByHandle('venueContent').scrollTo(0,$rootScope.scroll, true);
  //  });  

  // $scope.toggleGroup = function(group, $index) {
  // 	$location.hash('menu'+$index);
  //   if ($scope.isGroupShown(group)) {
  //     $scope.shownGroup = null;
  // 	  $timeout(function(){
  // 		$ionicScrollDelegate.$getByHandle('venueContent').resize();
  //     	$ionicScrollDelegate.$getByHandle('venueContent').scrollTop(true);
  // 	  },200)
  //   } else {
  //     $scope.shownGroup = group;
  //     $scope.shownGroup.section = [];
  //     $timeout(function(){
  //     	$ionicScrollDelegate.$getByHandle('venueContent').anchorScroll(true);
  // 	  	$scope.shownGroup.section = group.sections[0];
  // 	  	$ionicScrollDelegate.$getByHandle('submenu').scrollTo(0,0);
  // 	  	$ionicScrollDelegate.$getByHandle('menumenu').scrollTo(0,0);
  //     }, 200)
  //   }
  // };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.isSectionShown = function(section) {
  	if ($scope.shownGroup) {
  		return $scope.shownGroup.section === section;
  	} else {
  		return false;
  	}
  }

  $scope.activarSection = function(section){
  	$scope.loadsection = true;
  	$timeout(function(){
  		$ionicScrollDelegate.$getByHandle('venueContent').scrollTo(0,-43-44+($window.innerWidth)*174/250);
  		$scope.loadsection = false;
  		$scope.shownGroup.section = section;
  		$ionicScrollDelegate.$getByHandle('venueContent').resize();
  	}, 100);
  }

  $scope.changeMenu = function(menu){
  	$scope.shownGroup = [];
  	$scope.menu = menu;
  	$scope.shownGroup = menu;
  	$scope.shownGroup.section = menu.sections[0];
  	$ionicScrollDelegate.$getByHandle('submenu').scrollTo(0,0);
  	$ionicScrollDelegate.$getByHandle('venueContent').scrollTo(0,-43-44+($window.innerWidth)*174/250);
  	
  	$scope.popover.hide();
  }
  $ionicPopover.fromTemplateUrl('views/venuepopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  // var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  // $scope.popover = $ionicPopover.fromTemplate(template, {
  //   scope: $scope
  // });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });


	$scope.venue = {};
	//$scope.venue.name = $stateParams.name_id;
	$scope.menus = {};
	$scope.loaded= false;


	if (!$stateParams.rest_id || $stateParams.rest_id===null){
		$location.path('/app/home')
	}


	Venue.get({rest_id: $stateParams.rest_id, name_id: $stateParams.name_id}, function(data){
		$scope.venue = data.venue;
	});

	Menu.get({rest_id: $stateParams.rest_id, name_id:$stateParams.name_id}
		,function(data){
			$scope.menus = data.menu;
			$scope.loaded= true;
			$scope.menu =  data.menu[0];
			$scope.shownGroup =  data.menu[0];
			$scope.shownGroup.section =  data.menu[0].sections[0];
		}
		,function(err){
			// console.log(err);
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
		

		var losoptions = [];
		var error = false;

		angular.forEach( item.option_groups, function(value, key){
			if (value.type==='OPTION_ADD') {
				losoptions.push({'type':'OPTION_ADD'});
				angular.forEach( value.options, function(ovalue, okey){
					if (ovalue.checked) {
						var nuevaOpt = {
							name:ovalue.name,
							price:ovalue.price
						}
						losoptions.push(nuevaOpt);
						// losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+', "type":"OPTION_ADD"}';
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(ovalue.price);
					};
				})
			}
			if (value.type==='OPTION_CHOOSE') {
				losoptions.push({'type':'OPTION_CHOOSE'});
				if (item.choosed) {
					angular.forEach( item.choosed, function(ovalue, okey){
						var nuevaOpt = {
							name:ovalue.name,
							price:ovalue.price
						}
						losoptions.push(nuevaOpt);
						// losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+'}, "type":"OPTION_CHOOSE"}';
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(ovalue.price);
					})
				} else {
        			$cordovaToast.show('Must choose an option', 'short', 'center');
					error = true;
				}
			}
		});

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
			$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(order.itemprice);
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
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(item.price);
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
			$location.path('/app/plate/'+key);
	}

})
.controller('PlateCtrl', function( $ionicHistory, Item, Order, $location, $ionicPlatform, $rootScope, $stateParams, $scope, $timeout, $http, $ionicModal, $cordovaToast) {

	$scope.plate = {};

	$scope.loaded = false;


	Item.get({itemkey:$stateParams.id}).$promise.then(function(plate){
		// console.log(plate)
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

	$scope.plateBack = function(){
		$ionicHistory.goBack();
	}

	$scope.closeAddModal = function() {
		$scope.addModal.hide();
	};
	$scope.chosedOrder = function(item) {
		

		var losoptions = [];
		var error = false;

		angular.forEach( item.option_groups, function(value, key){
			if (value.type==='OPTION_ADD') {
				losoptions.push({'type':'OPTION_ADD'});
				angular.forEach( value.options, function(ovalue, okey){
					if (ovalue.checked) {
						var nuevaOpt = {
							name:ovalue.name,
							price:ovalue.price
						}
						losoptions.push(nuevaOpt);
						// losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+', "type":"OPTION_ADD"}';
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(ovalue.price);
					};
				})
			}
			if (value.type==='OPTION_CHOOSE') {
				losoptions.push({'type':'OPTION_CHOOSE'});
				if (item.choosed) {
					angular.forEach( item.choosed, function(ovalue, okey){
						var nuevaOpt = {
							name:ovalue.name,
							price:ovalue.price
						}
						losoptions.push(nuevaOpt);
						// losoptions = '{"name":"'+ovalue.name+'", "price":'+ovalue.price+'}, "type":"OPTION_CHOOSE"}';
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(ovalue.price);
					})
				} else {
        			$cordovaToast.show('Must choose an option', 'short', 'center');
					error = true;
				}
			}
		});

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
			$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(order.itemprice);
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
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(item.price);
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

.controller('ReceiptsCtrl', function($scope, Orders){

	$scope.loaded = false;
	$scope.orders = {}


	Orders.get(function(results){
		$scope.orders = results.orders;
		$scope.loaded = true;
	})
})

.controller('OrderIdCtrl', function($scope, Order, $stateParams){

	$scope.loaded = false;
	$scope.orders = {};

	Order.getSingle({
		orderkey : $stateParams.id
	}, function(order){
		$scope.orders = order;
		$scope.loaded = true;
	})

})


.controller('CardCtrl', function(Auth, $cordovaToast,$scope, $timeout, User, $rootScope, $localstorage, $ionicLoading, $ionicPopup){
	$scope.card = {};

	// $scope.lafecha= Date();

	$scope.card.checkoutForm={};
	$scope.enviame = function(){
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
		$timeout(function() {
			document.getElementById('elboton').click()
		}, 0);
	}


	// $scope.procesarFecha = function(fecha){
	// 	console.log(fecha)

	// 	var mes = fecha.getMonth()+1;
	// 	var ano = fecha.getFullYear();


	// 	$scope.expMonth = mes;
	// 	$scope.expYear = ano;

	// 	$scope.card.checkoutForm.expMonth = mes;
	// 	$scope.card.checkoutForm.expYear = ano;

	// }

	$scope.stripeCallback = function(code, result) {
	// console.log('code:', code);
	// console.log('result:', result);

	if (result.error) {
    	$ionicLoading.hide();
        // console.log('it failed! error: ' + result.error.message);
        $cordovaToast.show('it failed! error: ' + result.error.message, 'short', 'bottom');
    } else {
    	$ionicLoading.hide();
   //      User.save({},
			// "stripeToken="+result.id
			//+"&last4="+result.card.last4+"&brand="+result.card.brand+"date="+result.card.exp_month+"/"+result.card.exp_year 
		  User.save({
		  	stripeToken:result.id
		  }

		).$promise.then(function(user){
			console.log(user);
 			// User.get().$promise.then(function(user){
 				Auth.setCredentials(user.user);
        		// $rootScope.creditcard = data.user;
        		// $localstorage.setObject('creditcard',data.user);
 			// });
	   		document.getElementById('cvc').value = "";
	   		document.getElementById('month').value = "";
	   		document.getElementById('year').value = "";
	   		document.getElementById('number').value = "";

	   		$cordovaToast.show('Card Saved', 'short', 'center'); 			
		});

    }

	};

})
.controller('rateController', function($scope){
	$scope.rate = {};


	$scope.hechanged = function(key){
		// Rating.update({
		// 	rating: $scope.rate,
		// 	key: key
		// }).$promise.then(function(){
		// 	$cordovaToast.show('Plate rated!', 'short', 'bottom');
		// });
		

		// poll.poll_options.map(function(option){
		// 	option.active = false;
		// });
		var found = false;

		$scope.$parent.rating.ratings.map( function(rating){
			if (rating.key === key ) {
				rating.rating = $scope.rate;
				found = true;
			}
		});

		if (!found) {
			$scope.$parent.rating.ratings.push({key:key, rating:$scope.rate});
		}

	}
})
.controller('OrderCtrl', function(Rating, returnToState, Auth, returnToState, $state, $ionicPlatform,$ionicPopup, $cordovaToast,$localstorage, $rootScope, $scope, $timeout, $location, $rootScope, $ionicLoading, User, Order, Pay){
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


	$scope.goHomeRate = function(){
		returnToState('app.home', true);
		$rootScope.scroll = 0;
		// $location.path('/app/home');
		if($scope.rating) {
			Rating.save($scope.rating);
		}
		Order.query();
	}


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
			itemkey: item.menu_item.key, 
			itemprice: item.menu_item.price, 
			itemname: item.menu_item.name || item.menu_item.text,
			restname: restaurant.name,
			options:item.options,
			restid: restaurant.restaurant_id
		};
		if (item.options) {
			angular.forEach( item.options, function(value, key){
				if (value.price) {
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(value.price);
				};
			});
		};

		$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity+1;

		$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+parseFloat(item.menu_item.price);
		Order.update(order);

	}	

	$scope.rating = {
		ratings : []
	};

	$scope.removeItem = function(item, restaurant, $index){
		$cordovaToast.show('Plate removed!', 'short', 'bottom');
		var order = {
			action: 'remove', 
			itemkey: item.menu_item.key, 
			itemprice: item.menu_item.price, 
			itemname: item.menu_item.name || item.menu_item.text, 
			restname: restaurant.name,
			options:item.options,
			restid: restaurant.restaurant_id
		};
		if (item.options) {
			angular.forEach( item.options, function(value, key){
				if (value.price) {
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-parseFloat(value.price);
				};
			});
		};
		$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-parseFloat(item.menu_item.price);
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
    		Order.query().$promise.then(function(){
    			$location.path('/app/order/success');	
    		});
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
   			// User.save({},
			// "stripeToken="+result.id
			//+"&last4="+result.card.last4+"&brand="+result.card.brand+"date="+result.card.exp_month+"/"+result.card.exp_year 
		  User.save({
		  	stripeToken:result.id
		  }			
			
		).$promise.then(function(user){
			// console.log(user);
 			// User.get().$promise.then(function(user){
        		// $rootScope.creditcard = data.user;
        		// $localstorage.setObject('creditcard',data.user);
        		Auth.setCredentials(user.user);
 			// });
	   		document.getElementById('cvc').value = "";
	   		document.getElementById('month').value = "";
	   		document.getElementById('year').value = "";
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
				subTitle: 'Your order has been sent to the kitchen',
				okText: 'OK',
				okType: 'button-royal'
			}).then(function(res) {
				$location.path('/app/menu/'+$rootScope.order.restaurant.restaurant_id+'/'+$rootScope.order.restaurant.name);
			});
		})
	}

	$scope.goMenu = function(){

		returnToState('app.venue');

		// if ($rootScope.order.restaurant && $rootScope.order.restaurant.restaurant_id) {
		// 	$location.path('/app/menu/'+$rootScope.order.restaurant.restaurant_id+'/'+$rootScope.order.restaurant.name);
		// } else {
		// 	$location.path('/app/home');
		// }
	}
})
;