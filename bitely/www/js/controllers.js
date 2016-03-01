angular.module('bitely.controllers',[])
.controller('AppCtrl', 
	function(returnToState, Login, Order, EmailSignUp, EmailLogin, $ionicBackdrop, $cordovaToast, User, Auth, Order, $window, $cookies, 
		$http, $localstorage, $rootScope, $scope, $location, $ionicLoading, $timeout, $ionicPopup, 
		$cordovaFacebook, $ionicHistory, $ionicModal) {

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

	$ionicModal.fromTemplateUrl('views/loginmodal.html', {
		scope: $scope,
    	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.loginModal = modal;
		$scope.loginModal.form = {boton: 'Log In', loading:false};

	});
	$ionicModal.fromTemplateUrl('views/signupmodal.html', {
		scope: $scope,
    	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.signupModal = modal;
		$scope.signupModal.form = {boton: 'Sign Up', loading:false};

	});	

	$scope.emailSignUp = function(from){
		$scope.signupModal.form.from = from;
		$scope.signupModal.form.boton = 'Sign Up';
		$scope.signupModal.form.loading = false;
		$scope.signupModal.form.error = false;
		$scope.signupModal.show();
	}

	$scope.closeSignupModal = function(){
		$scope.signupModal.hide();
	}

	$scope.emailSignupSubmit = function(){
		$scope.signupModal.form.boton = 'Signing in...';
		$scope.signupModal.form.loading = true;
		$scope.signupModal.form.error = false;
		EmailSignUp.save({
			email: $scope.signupModal.form.email,
			password: $scope.signupModal.form.password,
			first_name: $scope.signupModal.form.fname,
			last_name: $scope.signupModal.form.lname
		}).$promise.then(
		function(res) {
			if (res.user!==null) {
				Auth.setCredentials(res.user);
				Order.query();
				$scope.signupModal.form.boton = 'Sign Un';
				$scope.signupModal.form.loading = false;
		 		if  ($scope.signupModal.form.from==='home') {
		 			$ionicHistory.nextViewOptions({
					    disableAnimate: true,
					    disableBack: true
					});
					$location.path('/app/home');
		 		}

		 		if  ($scope.signupModal.form.from==='order') {
		 			if (!$rootScope.globals.currentUser.has_customertoken) {
		 				$location.path('/app/order/card');
		 			} else {
		 				$location.path('/app/order/confirm');
		 			}
		 		}
				$scope.signupModal.hide();
	 		} else {
				$scope.signupModal.form.boton = 'Sign Un';
				$scope.signupModal.form.loading = false;
				$scope.signupModal.form.error = "Sign Up Error";
	 		}
		}, function(error){
			$scope.signupModal.form.boton = 'Sign Un';
			$scope.signupModal.form.loading = false;
			$scope.signupModal.form.error = "Sign Up Error";
			console.log(error);
		});		
	}

	$scope.emailLogin = function(from){
		$scope.loginModal.form.from = from;
		$scope.loginModal.form.boton = 'Log In';
		$scope.loginModal.form.loading = false;
		$scope.loginModal.form.error = false;
		$scope.loginModal.show();
	}

	$scope.closeLoginModal = function(){
		$scope.loginModal.hide();
	}

	$scope.emailLoginSubmit = function(){
		$scope.loginModal.form.boton = 'Logging in...';
		$scope.loginModal.form.loading = true;
		$scope.loginModal.form.error = false;
		EmailLogin.save({
			email: $scope.loginModal.form.email,
			password: $scope.loginModal.form.password
		}).$promise.then(
		function(res) {
			if (res.user!==null) {
				Auth.setCredentials(res.user);
				Order.query();
				$scope.loginModal.form.boton = 'Log In';
				$scope.loginModal.form.loading = false;
		 		if  ($scope.loginModal.form.from==='home') {
		 			$ionicHistory.nextViewOptions({
					    disableAnimate: true,
					    disableBack: true
					});
					$location.path('/app/home');
		 		}

		 		if  ($scope.loginModal.form.from==='order') {
		 			if (!$rootScope.globals.currentUser.has_customertoken) {
		 				$location.path('/app/order/card');
		 			} else {
		 				$location.path('/app/order/confirm');
		 			}
		 		}
				$scope.loginModal.hide();
	 		} else {
				$scope.loginModal.form.boton = 'Login';
				$scope.loginModal.form.loading = false;
				$scope.loginModal.form.error = "Login Error";
	 		}
		}, function(error){
			$scope.loginModal.form.boton = 'Login';
			$scope.loginModal.form.loading = false;
			$scope.loginModal.form.error = "Login Error";
			console.log(error);
		});		
	}



	$scope.getHistory = function(){
		// console.log($ionicHistory.viewHistory());
	}

	$scope.login = function(from){
	$ionicBackdrop.retain();
    $cordovaFacebook.login(["email","user_friends"])
    .then(function(success) {
    	Login.save({access_token:success.authResponse.accessToken}
		).$promise.then(
		function(res){
    		if (res.user!==null) {
			Auth.setCredentials(res.user);
			Order.query();
			$ionicBackdrop.release();
	 		if  (from==='home') {
	 			$ionicHistory.nextViewOptions({
				    disableAnimate: true,
				    disableBack: true
				});
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
        //$cordovaToast.show(error, 'short', 'center');
    });
		
	};

    $scope.fakebook = function(from){

    	Login.save({access_token:"CAAT3dgau4T4BAFLoP94ZA4uRgzRZBPLUy3LoZAk196SV2NQPR6egh6Su8PKGylLa1XZBJZAOJs6Wra9pxFZAfDxiJ2kEUvgxszZCZCQVhP0ToWek6FZCG4u3Dc5Qa2DMZBHChoeY1A4FUDEX90bIbg4CUwnnDdnOiSyPTnN8PChFkOzBZAirZCejdC2OhEzKSKTO7fLA99quD2pH00JYldKs9ypJ"}
		).$promise.then(
		function(res){
    		// console.log(res);
    		if (res.user!==null){

			Auth.setCredentials(res.user);
			Order.query();
			$ionicBackdrop.release();
	 		if  (from==='home') {
	 			$ionicHistory.nextViewOptions({
				    disableAnimate: true,
				    disableBack: true
				});
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
 			$ionicHistory.nextViewOptions({
			    disableAnimate: true,
			    disableBack: true
			});
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

 		Order.query().$promise.then(
 			function(order){
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
 		}, function(err){
	  		//$cordovaToast.show(err.data.message, 'short', 'bottom');
 		});
 	}

})
.controller('DebugCtrl', function(User, Order, $scope){
	$scope.debug = {};
	$scope.debug.user = User.get();
	$scope.debug.order = Order.query();
})
.controller('HomeCtrl', function($rootScope, $ionicPopup, $ionicPlatform,$cordovaToast, $scope, $timeout, $http, $cordovaGeolocation, Venues, gLocation) {

 //    $ionicPlatform.registerBackButtonAction(
 //        function () {
 //           ionic.Platform.exitApp();
 //        }, 100
	// );

	$scope.moreDataCanBeLoaded = false;

	$scope.loaded = false;
	$scope.error = false;
	$scope.getlocation = false;

	$scope.user_loc = {};

	var test_location = {
		lat : "29.7377136",
        lon : "-95.58918089999997",
        rad : 20000
    }
	$scope.user_loc = test_location;


	var posOptions = {timeout: 7000, enableHighAccuracy: true};


	$scope.places = {};

	ionic.Platform.ready(function(){

		console.log('plataform ready');

  	  	$cordovaGeolocation.getCurrentPosition(posOptions)
	    .then(function (position) {

			$scope.user_loc = {
	      		lat  : position.coords.latitude, 
	      		lon : position.coords.longitude, 
	      		rad : 200
	  		}

			$rootScope.position = {
				lat  : position.coords.latitude, 
				lon : position.coords.longitude
			}

	  		gLocation.update({latitude:position.coords.latitude, longitude:position.coords.longitude});

	  		$scope.getlocation = true;

	  		Venues.get($scope.user_loc)
	  		.$promise.then(function(data) {
	    		$scope.places = data.venue_list;
				$scope.loaded = true;
	  		}, function(){
				$scope.loaded = true;
	  			//$cordovaToast.show('No restaurants found in this location', 'short', 'bottom');
				// $scope.error = true;
	  		});

	    }, function(err) {
	  		//$cordovaToast.show("No location services are on! Please activate Wireless or GPS location services in 'Settings'", 'short', 'bottom');
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
	      		lat  : position.coords.latitude, lon : position.coords.longitude, rad : 200
	  		}
	  		$rootScope.position = {
	      		lat  : position.coords.latitude, 
	      		lon : position.coords.longitude
	  		}	  		
  			gLocation.update({latitude:position.coords.latitude, longitude:position.coords.longitude});
	  		Venues.get($scope.user_loc)
	  		.$promise.then(function(data) {
	    		$scope.places = data.venue_list;
	  		}).finally(function(){
	  			$scope.$broadcast('scroll.refreshComplete');
	  		});	  		
    	}, function(err) {
  			$scope.$broadcast('scroll.refreshComplete');
  			//$cordovaToast.show("No location services are on! Please activate Wireless or GPS location services in 'Settings'", 'short', 'bottom');
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
.controller('VenueCtrl', function( $window, $ionicPopup, $ionicPopover, $ionicScrollDelegate, $ionicPlatform, $location, $cordovaToast, $scope, $stateParams, $rootScope, $timeout, $ionicModal, $http, Venue, Menu, Order){

	if ($stateParams.rest_id==='null' || $stateParams.name_id==='null') {
		$location.path('/app/home');
	}

	$scope.Math = window.Math;

 //    $ionicPlatform.registerBackButtonAction(
 //        function () {
 //            $location.path('/app/home');
 //        }, 100
	// )
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
  		$ionicScrollDelegate.$getByHandle('venueContent').scrollTo(0,-41-44+($window.innerWidth)*174/250);
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
  	$ionicScrollDelegate.$getByHandle('venueContent').scrollTo(0,-41-44+($window.innerWidth)*174/250);
  	
  	$scope.popover.hide();
  }
  $ionicPopover.fromTemplateUrl('views/venuepopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });


	$scope.venue = {};

	$scope.menus = {};
	$scope.loaded= false;


	if (!$stateParams.rest_id || $stateParams.rest_id===null){
		$location.path('/app/home')
	}


	Venue.get({rest_id: $stateParams.rest_id, name_id: $stateParams.name_id}, 
	function(data){
		$scope.venue = data.venue;
	}, function(err){
		//$cordovaToast.show(err.data.message, 'short', 'bottom');
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
	  		//$cordovaToast.show(err.data.message, 'short', 'bottom');
		}
	);


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
					})
				} else {
					error = true;
        			//$cordovaToast.show('Must choose an option', 'short', 'center');
				}
			}
		});

		if (!error) {
			$scope.data = {};
			var myPopup = $ionicPopup.show({
				template: '<textarea type="password" ng-model="data.wifi" style="height:100px"></textarea>',
				title: 'Any additional comments?',
				// subTitle: 'Any additional comments?',
				scope: $scope,
					buttons: [
					{ text: 'Cancel' },
					{
						text: '<b>Order</b>',
						type: 'button-royal',
						onTap: function(e) {
							return $scope.data.wifi;
						}
					}]
			});

			myPopup.then(function(res) {
				//$cordovaToast.show('Plate Ordered!', 'short', 'center');
				losoptions.push({extra:res});
				order = {
					action: 'add', 
					itemkey: item.key, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: $stateParams.name_id, 
					options: losoptions,
					restid: $stateParams.rest_id
				}
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1; 
				Order.update(order).$promise.then(
					function(){
						$scope.addModal.hide();
					}, function(err){
						$scope.addModal.hide();
	  					//$cordovaToast.show(err.data.message, 'short', 'bottom');
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1; 
					});
			});
		}

	};	
	$scope.sendOrder = function(item, $event){

    	$event.stopPropagation();

		if (!$rootScope.order.is_paid && $rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== $stateParams.rest_id ) {
			
        //$cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {

			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {

				$scope.data = {};

				var myPopup = $ionicPopup.show({
					template: '<textarea type="password" ng-model="data.wifi" style="height:100px"></textarea>',
					title: 'Any additional comments?',
					// subTitle: 'Any additional comments?',
					scope: $scope,
						buttons: [
						{ text: 'Cancel' },
						{
							text: '<b>Order</b>',
							type: 'button-royal',
							onTap: function(e) {
								return $scope.data.wifi;
							}
						}]
				});

				myPopup.then(function(res) {

					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;
					Order.update({
						action: 'add', 
						itemkey: item.key, 
						itemprice: item.price,
						options: [{extra:res}],
						itemname: item.name || item.text, 
						restname: $stateParams.name_id, 
						restid: $stateParams.rest_id
					}).$promise.then(function(){
						//$cordovaToast.show('Plate Ordered!', 'short', 'center');
					}, function(err){
	  					//$cordovaToast.show(err.data.message, 'short', 'bottom');
	  					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
					});
				});
			}
		}
	}

	$scope.goPlate = function(key){
		$location.path('/app/plate/'+key);
	}

	$scope.goSearch = function(){
		$location.path('/app/menusearch/'+$stateParams.rest_id+'/'+$stateParams.name_id);
	}

})
.controller('PlateCtrl', function( $ionicHistory, Item, Order, $location, $ionicPlatform, $rootScope, $stateParams, $scope, $timeout, $http, $ionicModal, $cordovaToast) {

	$scope.plate = {};
	$scope.Math = window.Math;

	$scope.loaded = false;


	Item.get({itemkey:$stateParams.id}).$promise.then(
		function(plate){
			$scope.plate = plate.item;
			$scope.loaded =  true;
	}, function(err){
			$scope.loaded =  true;
        	//$cordovaToast.show(err.message, 'short', 'center');
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
					})
				} else {
					error = true;
        			//$cordovaToast.show('Must choose an option', 'short', 'center');
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
			$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;
			Order.update(order).$promise.then(
			function(res){
				if (res.header.status === 'error') {
					$scope.addModal.hide();
					//$cordovaToast.show(res.header.message, 'short', 'bottom');
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
				} else {
					$scope.addModal.hide();
        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
				}
			}, function(err){
				$scope.addModal.hide();
				//$cordovaToast.show(err.data.message, 'short', 'bottom');
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
			});
		};

	};	
	$scope.sendOrder = function(item){

		if (!$rootScope.order.is_paid && $rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== item.restaurant.restaurant_id ) {
			
        //$cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {

			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;
				Order.update({
					action: 'add', 
					itemkey: item.key, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: item.restaurant.name, 
					restid: item.restaurant.restaurant_id
				}).$promise.then(
				function(res){
					if (res.header.status === 'error') {
						//$cordovaToast.show(res.header.message, 'short', 'bottom');
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
					} else {
	        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
					}
					//$cordovaToast.show('Plate Ordered!', 'short', 'center');
				}, function(err){
					//$cordovaToast.show(err.data.message, 'short', 'bottom');
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
				});
			}
		}
	}

})

.controller('MeProfileCtrl', function(User, $scope, $timeout){
	// $scope.profile = {};
	// User.get()
})
.controller('ProfileCtrl', function($scope, User, $ionicLoading, $rootScope, $localstorage, $cordovaToast){

	$scope.profile = {};
	$scope.oldprofile = {};

	User.get().$promise.then(
		function(user){
		// $scope.profile.data = {
		// 	fullname: user.fullname,
		// 	dob : new Date(user.dob),
		// 	preferences: user.preferences,
		// 	gender: user.gender
		// };
		$scope.profile.data = user;
		$scope.profile.data.dob = new Date(user.dob);
		$scope.oldprofile.data = angular.copy($scope.profile.data);
		// $scope.oldprofile.data = user;
		// $scope.oldprofile.data.dob = new Date(user.dob);
	}, function(err){
		//$cordovaToast.show(err.data.message, 'short', 'bottom');
	})



	$scope.saveProfile = function() {
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
    	var userChanges = {};
		if ($scope.oldprofile.data.fullname !== $scope.profile.data.fullname) {
			userChanges.fullname = $scope.profile.data.fullname;
		};
		if ($scope.oldprofile.data.dob !== $scope.profile.data.dob) {
			userChanges.dob = new Date($scope.profile.data.dob);
		};
		if ($scope.oldprofile.data.gender !== $scope.profile.data.gender) {
			userChanges.gender = $scope.profile.data.gender
		};
		userChanges.preferences = $scope.profile.data.preferences;

		User.save(userChanges).$promise.then(
			function(user){
				console.log('souuser',user);
				$rootScope.globals = {
					currentUser: user
				};

				$localstorage.setObject('globals',{currentUser:user});				
				$scope.profile.data = user;
				$scope.profile.data.dob = new Date(user.dob);
				$scope.oldprofile.data = angular.copy($scope.profile.data);
				$ionicLoading.hide();
			  //$cordovaToast.show('Details saved!', 'short', 'bottom');
			}, function(err){
				$ionicLoading.hide();
				//$cordovaToast.show(err.data.message, 'short', 'bottom');
			})
	};

})

.controller('ReceiptsCtrl', function($scope, Orders, $cordovaToast){

	$scope.loaded = false;
	$scope.orders = {}


	Orders.get(function(results){
		$scope.orders = results.orders;
		$scope.loaded = true;
	}, function(err){
		$scope.loaded = true;
		//$cordovaToast.show(err.data.message, 'short', 'bottom');
	})
})

.controller('OrderIdCtrl', function($scope, Order, $stateParams, $cordovaToast){

	$scope.loaded = false;
	$scope.orders = {};

	Order.getSingle({
		orderkey : $stateParams.id
	}, function(order){
		console.log(order);
		$scope.orders = order.object.order;
		$scope.loaded = true;
	}, function(err){
		$scope.loaded = true;
		//$cordovaToast.show(err.data.message, 'short', 'bottom');
	});

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


	$scope.stripeCallback = function(code, result) {
	// console.log('code:', code);
	// console.log('result:', result);

	if (result.error) {
    	$ionicLoading.hide();
        //$cordovaToast.show('it failed! error: ' + result.error.message, 'short', 'bottom');
    } else {
		  User.save({
		  	stripeToken:result.id
		  }

		).$promise.then(
		function(user){
			// console.log(user);
 			Auth.setCredentials(user);
	   		document.getElementById('cvc').value = "";
	   		document.getElementById('month').value = "";
	   		document.getElementById('year').value = "";
	   		document.getElementById('number').value = "";
    		$ionicLoading.hide();
	   		//$cordovaToast.show('Card Saved', 'short', 'center'); 			
		}, function(err){
    		$ionicLoading.hide();
			//$cordovaToast.show(err.data.message, 'short', 'bottom');
		});

    }

	};

})
.controller('rateController', function($scope){
	$scope.rate = {};

	$scope.hechanged = function(key){

		var found = false;

		$scope.$parent.rating.ratings.map( function(rating){
			if (rating.key === key ) {
				rating.rating = $scope.rate;
				found = true;
				console.log('found'+key);
			}
		});

		if (!found) {
			console.log('not found'+key);
			$scope.$parent.rating.ratings.push({key:key, rating:$scope.rate});
		}

	}
})
.controller('VenueSearchCtrl', function($scope, $ionicHistory, $stateParams, $location, $rootScope, $ionicPopup, $cordovaToast, Order, $ionicModal, $timeout){

	$scope.Math = window.Math;

	$scope.plateBack = function(){
		$ionicHistory.goBack();
	}


	var client = algoliasearch("CNU8OZJ2RV", "fdb2676351775d1609b7e56af4169568");
	//DEV
	var index = client.initIndex('bitely-test');

	//PROD
	// var index = client.initIndex('bitely-prod');

	$scope.venue = {name: $stateParams.name_id}
	$scope.search = {value:''};
	$scope.plates = {};
	

	$scope.goPlate = function(key){
		$location.path('/app/plate/'+key);
	}

	$scope.goSearch = function(){
		if ($scope.search.value.length > 1) {
		index.search($scope.search.value, {
			facets: 'restaurant_id, is_alive, show_in_menu',
			hitsPerPage: 50,
			facetFilters: [
				'restaurant_id:'+$stateParams.rest_id,
				'show_in_menu:true',
				'is_alive:true'
			]
		}).then(
			function(res){
				$timeout(function(){
					$scope.plates = res.hits;
				},1)
				console.log(res);
			}, function(err){
				console.log('err search', err);
			})
		}
	}

		index.search($scope.search.value, {
			facets: 'restaurant_id, is_alive, show_in_menu',
			hitsPerPage: 50,
			facetFilters: [
				'restaurant_id:'+$stateParams.rest_id,
				'show_in_menu:true',
				'is_alive:true'
			]
		}).then(
			function(res){
				$timeout(function(){
					$scope.plates = res.hits;
				},1)
				console.log(res);
			}, function(err){
				console.log('err search', err);
		})

	$scope.cancel = function(){
		$scope.search = {};
		$scope.plates = {};
	}


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
					})
				} else {
					error = true;
        			//$cordovaToast.show('Must choose an option', 'short', 'center');
				}
			}
		});

		if (!error) {
			$scope.data = {};
			var myPopup = $ionicPopup.show({
				template: '<textarea type="password" ng-model="data.wifi" style="height:100px"></textarea>',
				title: 'Any additional comments?',
				// subTitle: 'Any additional comments?',
				scope: $scope,
					buttons: [
					{ text: 'Cancel' },
					{
						text: '<b>Order</b>',
						type: 'button-royal',
						onTap: function(e) {
							return $scope.data.wifi;
						}
					}]
			});

			myPopup.then(function(res) {
				//$cordovaToast.show('Plate Ordered!', 'short', 'center');
				losoptions.push({extra:res});
				order = {
					action: 'add', 
					itemkey: item.objectID, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: item.restaurant, 
					options: losoptions,
					restid: item.restaurant_id
				}
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1; 
				Order.update(order).$promise.then(
					function(res){
						if (res.header.status === 'error') {
							$scope.addModal.hide();
							//$cordovaToast.show(res.header.message, 'short', 'bottom');
							$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
						} else {
							$scope.addModal.hide();
		        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
						}
					}, function(err){
						$scope.addModal.hide();
	  					//$cordovaToast.show(err.data.message, 'short', 'bottom');
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1; 
					});
			});
		}

	};	

	$scope.sendOrder = function(item, $event){

    	$event.stopPropagation();

		if (!$rootScope.order.is_paid && $rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== item.restaurant_id ) {
			
        //$cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {

			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {

				$scope.data = {};

				var myPopup = $ionicPopup.show({
					template: '<textarea type="password" ng-model="data.wifi" style="height:100px"></textarea>',
					title: 'Any additional comments?',
					// subTitle: 'Any additional comments?',
					scope: $scope,
						buttons: [
						{ text: 'Cancel' },
						{
							text: '<b>Order</b>',
							type: 'button-royal',
							onTap: function(e) {
								return $scope.data.wifi;
							}
						}]
				});

				myPopup.then(function(res) {
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;
					Order.update({
						action: 'add', 
						itemkey: item.objectID, 
						itemprice: item.price,
						options: [{extra:res}],
						itemname: item.name || item.text, 
						restname: item.restaurant, 
						restid: item.restaurant_id
					}).$promise.then(function(res){
						if (res.header.status === 'error') {
							//$cordovaToast.show(res.header.message, 'short', 'bottom');
							$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
						} else {
		        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
						}
					}, function(err){
	  					//$cordovaToast.show(err.data.message, 'short', 'bottom');
	  					console.log(err);
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
					});
				});
			}
		}
	}



})
.controller('SearchCtrl', function($scope, $location, $rootScope, $ionicPopup, $cordovaToast, Order, $ionicModal, $timeout){

	$scope.Math = window.Math;

	var client = algoliasearch("CNU8OZJ2RV", "fdb2676351775d1609b7e56af4169568");
	//DEV
	var index = client.initIndex('bitely-test');

	//PROD
	// var index = client.initIndex('bitely-prod');

	$scope.search = {value:''};
	$scope.plates = {};
	

	$scope.goPlate = function(key){
		$location.path('/app/plate/'+key);
	}

	$scope.goSearch = function(){
		if ($scope.search.value.length > 1) {
		index.search($scope.search.value, {
  			// aroundLatLng: $rootScope.position.lat+','+$rootScope.position.lon,
  			// aroundRadius: 1000 // 1km around
			facets: 'is_alive, show_in_menu',
			// hitsPerPage: 50,
			facetFilters: [
				// 'restaurant_id:'+$stateParams.rest_id,
				'show_in_menu:true',
				'is_alive:true'
			]
		}).then(
			function(res){
				$timeout(function(){
					$scope.plates = res.hits;
				},1)
				console.log(res);
			}, function(err){
				console.log('err search', err);
			})
		}
	}

	$scope.cancel = function(){
		$scope.search = {};
		$scope.plates = {};
	}


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
					})
				} else {
					error = true;
        			//$cordovaToast.show('Must choose an option', 'short', 'center');
				}
			}
		});

		if (!error) {
			$scope.data = {};
			var myPopup = $ionicPopup.show({
				template: '<textarea type="password" ng-model="data.wifi" style="height:100px"></textarea>',
				title: 'Any additional comments?',
				// subTitle: 'Any additional comments?',
				scope: $scope,
					buttons: [
					{ text: 'Cancel' },
					{
						text: '<b>Order</b>',
						type: 'button-royal',
						onTap: function(e) {
							return $scope.data.wifi;
						}
					}]
			});

			myPopup.then(function(res) {
				//$cordovaToast.show('Plate Ordered!', 'short', 'center');
				losoptions.push({extra:res});
				order = {
					action: 'add', 
					itemkey: item.objectID, 
					itemprice: item.price, 
					itemname: item.name || item.text, 
					restname: item.restaurant, 
					options: losoptions,
					restid: item.restaurant_id
				}
				$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1; 
				Order.update(order).$promise.then(
					function(res){
						if (res.header.status === 'error') {
							$scope.addModal.hide();
							//$cordovaToast.show(res.header.message, 'short', 'bottom');
							$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
						} else {
							$scope.addModal.hide();
		        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
						}
					}, function(err){
						$scope.addModal.hide();
	  					//$cordovaToast.show(err.data.message, 'short', 'bottom');
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1; 
					});
			});
		}

	};	

	$scope.sendOrder = function(item, $event){

    	$event.stopPropagation();

		if (!$rootScope.order.is_paid && $rootScope.order.restaurant.restaurant_id!==null && $rootScope.order.restaurant.restaurant_id !== item.restaurant_id ) {
			
        //$cordovaToast.show('Yoy have a pending order in another restaurant', 'short', 'center');

		} else {

			if (item.option_groups) {
			 	$scope.addModal.item = item
				$scope.addModal.show();
			} else {

				$scope.data = {};

				var myPopup = $ionicPopup.show({
					template: '<textarea type="password" ng-model="data.wifi" style="height:100px"></textarea>',
					title: 'Any additional comments?',
					// subTitle: 'Any additional comments?',
					scope: $scope,
						buttons: [
						{ text: 'Cancel' },
						{
							text: '<b>Order</b>',
							type: 'button-royal',
							onTap: function(e) {
								return $scope.data.wifi;
							}
						}]
				});

				myPopup.then(function(res) {
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;
					Order.update({
						action: 'add', 
						itemkey: item.objectID, 
						itemprice: item.price,
						options: [{extra:res}],
						itemname: item.name || item.text, 
						restname: item.restaurant, 
						restid: item.restaurant_id
					}).$promise.then(function(res){
						if (res.header.status === 'error') {
							//$cordovaToast.show(res.header.message, 'short', 'bottom');
							$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
						} else {
		        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
						}
					}, function(err){
	  					//$cordovaToast.show(err.data.message, 'short', 'bottom');
	  					console.log(err);
						$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
					});
				});
			}
		}
	}


})

.controller('OrderCtrl', function(Rating, returnToState, Auth, returnToState, $ionicHistory, $state, $ionicPlatform,$ionicPopup, $cordovaToast,$localstorage, $rootScope, $scope, $timeout, $location, $rootScope, $ionicLoading, User, Order, Pay, Tip){
	$scope.loaded = true;

	$scope.$parent.rating = {
		ratings : []
	};

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
		$ionicHistory.nextViewOptions({
		    disableAnimate: true,
		    disableBack: true
		});
		returnToState('app.home', true);
		$rootScope.scroll = 0;
		// $location.path('/app/home');
		if($scope.rating) {
			Rating.save($scope.rating);
		}
		if ($scope.tip.tip != 0) {
			Tip.save({
				tip: $scope.tip.tip,
				orderkey: $rootScope.order.key
			}).$promise.then(function(){

			}, function(err){
				//$cordovaToast.show(err.data.message, 'short', 'bottom');
			});
		}
		Order.query();
	}


 //    $ionicPlatform.registerBackButtonAction(
 //        function () {
 //            $location.path('/app/menu/'+$rootScope.restaurant.restaurant_id+'/'+$rootScope.restaurant.name)
 //        }, 100
	// );

	$scope.card = {};

	$scope.card.checkoutForm2={};

	$scope.addItem = function(item, restaurant, $index){

		var order = {
			action: 'add', 
			itemkey: item.menu_item.key, 
			itemprice: item.menu_item.price, 
			itemname: item.menu_item.name || item.menu_item.text,
			restname: restaurant.name,
			options:item.options,
			restid: restaurant.restaurant_id
		};
		$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity+1;
		$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;

		Order.update(order).$promise.then(function(res){
				if (res.header.status === 'error') {
					//$cordovaToast.show(res.header.message, 'short', 'bottom');
					$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
					$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity-1;
				} else {
        			//$cordovaToast.show('Plate ordered!', 'short', 'center');
				}
		}, function(err){
			//$cordovaToast.show(err.data.message, 'short', 'bottom');
			$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity-1;
			$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
		});

	}	

	$scope.rating = {
		ratings : []
	};

	$scope.removeItem = function(item, restaurant, $index){
		//$cordovaToast.show('Plate removed!', 'short', 'bottom');
		var order = {
			action: 'remove', 
			itemkey: item.menu_item.key, 
			itemprice: item.menu_item.price, 
			itemname: item.menu_item.name || item.menu_item.text, 
			restname: restaurant.name,
			options:item.options,
			restid: restaurant.restaurant_id
		};
		$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)-1;
		$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity-1;
		Order.update(order).$promise.then(function(){
			//$cordovaToast.show('Plate removed!', 'short', 'bottom');
		},
		function(err){
			//$cordovaToast.show(err.data.message, 'short', 'bottom');
			$rootScope.order.appTotal = parseFloat($rootScope.order.appTotal)+1;
			$rootScope.order.order_plates[$index].quantity = $rootScope.order.order_plates[$index].quantity+1;
		});
	}

	$scope.tip = {tip:0, porc:0};

	$scope.addTip = function(porc) {
		$scope.tip.porc = porc;
		$scope.tip.tip = parseFloat($rootScope.order.sub_total) * (porc/100);
	}

	$scope.doPay = function(){
		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});
		Pay.save({tip:$scope.tip.tip}).$promise.then(function(order){
    		$ionicLoading.hide();
			$scope.tip = {tip:0, porc:0};
    		Order.query().$promise.then(function(){
    			$location.path('/app/order/success');	
    		}, function(err){
				//$cordovaToast.show(err.data.message, 'short', 'bottom');
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
	if (result.error) {
    	$ionicLoading.hide();
        //$cordovaToast.show('it failed! error: ' + result.error.message, 'short', 'bottom');
    } else {
		  User.save({
		  	stripeToken:result.id
		  }			
			
		).$promise.then(function(user){
        	Auth.setCredentials(user);
    		$ionicLoading.hide();
	   		document.getElementById('cvc').value = "";
	   		document.getElementById('month').value = "";
	   		document.getElementById('year').value = "";
	   		document.getElementById('number').value = "";
			$location.path('/app/order/confirm');	 			
		}, function(err){
    		$ionicLoading.hide();
			//$cordovaToast.show(err.data.message, 'short', 'bottom');
		});
    	}
	}
	
	$scope.doConfirm = function(){

		if ($rootScope.order.is_posted) {

			$location.path('/app/order/payment')

		} else {
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
				}, function(err){
					$ionicLoading.hide();
					//$cordovaToast.show(err.data.message, 'short', 'bottom');
				});
			})			
		}
	}

	$scope.goMenu = function(){

		$ionicHistory.nextViewOptions({
		    disableAnimate: true,
		    disableBack: true
		});
		returnToState('app.venue');

	}
})
;