angular.module('bitely.controllers',['ngOpenFB'])
.controller('AppCtrl', function($localstorage,$rootScope, $scope, $location, $ionicLoading, $timeout, $ionicPopup, $ionicSideMenuDelegate, ngFB) {

	$rootScope.orderTotal = 0;

	$scope.login = function(){

		$ionicLoading.show({
      		template: '<ion-spinner class="color_white"></ion-spinner>'
    	});

		//CAMBIAR EL URL A https://www.facebook.com/connect/login_success.html
		//http://localhost:8100/oauthcallback.html
	    ngFB.login({scope: 'email'}).then(
    	    function (response) {
        	    if (response.status === 'connected') {
            	    console.log('Facebook login succeeded');
                	//$scope.closeLogin();
                	ngFB.api({
        				path: '/me',
        				params: {fields: 'id,name,email,picture.width(200).height(200)'}
    				}).then(
        			function (user) {
            			$rootScope.globals.currentUser = user;
            			$location.path('/app/home');
						$ionicLoading.hide();
        			},
        			function (error) {
            			alert('Facebook error: ' + error.error_description);
        			});

            	} else {
                	alert('Facebook login failed');
            	}
        });


		// $timeout(function(){
		// 	$rootScope.globals.currentUser = {
		// 		name: 'Becky Noriega',
		// 		image: 'img/avatar.jpg'
		// 	};
		// 	$location.path('/app/home');
		// 	$ionicLoading.hide();
		// }, 2000);
		
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
			$ionicSideMenuDelegate.toggleLeft();
     	}
   		});
 	};
})
.controller('HomeCtrl', function( $scope, $timeout) {

	$scope.moreDataCanBeLoaded = true;

	$scope.loaded = false;
	$scope.places = {};

    $timeout(function() {

		$scope.loaded = true;

		$scope.places = [
			{
				pid: 	1,
				name: 	'Lorem ipsum dolor sit.',
				image:  'img/restaurante.jpg',
				street_address: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, sint.',
				distance_to: '15'
			},
			{
				pid: 	2,
				name: 	'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, fugiat, voluptatem impedit neque nam earum distinctio quidem tempore dicta praesentium.',
				image:  'img/no_image.jpg',
				street_address: '1346 West Liberty Ave.',
				distance_to: '15'
			},
			{
				pid: 	3,
				name: 	'Lorem ipsum dolor sit.',
				image:  'img/restaurante.jpg',
				street_address: '1346 West Liberty Ave.',
				distance_to: '15'
			}
		];
	}, 2000);

	$scope.doRefresh = function() {
      $timeout(function() {
		$scope.places = [
			{
				pid: 	1,
				name: 	'NUEVO Lorem ipsum dolor sit.',
				image:  'img/restaurante.jpg',
				street_address: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, sint.',
				distance_to: '15'
			},
			{
				pid: 	2,
				name: 	'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, fugiat, voluptatem impedit neque nam earum distinctio quidem tempore dicta praesentium.',
				image:  'img/restaurante.jpg',
				street_address: '1346 West Liberty Ave.',
				distance_to: '15'
			},
			{
				pid: 	3,
				name: 	'Lorem ipsum dolor sit.',
				image:  'img/restaurante.jpg',
				street_address: '1346 West Liberty Ave.',
				distance_to: '15'
			}
		];

      }, 1000).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
	};
	$scope.loadMore = function() {
  		$timeout(function() {
	  		var morePlaces = [
				{
					pid: 	1,
					name: 	'NUEVO Lorem ipsum dolor sit.',
					image:  'img/restaurante.jpg',
					street_address: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, sint.',
					distance_to: '15'
				},
				{
					pid: 	2,
					name: 	'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, fugiat, voluptatem impedit neque nam earum distinctio quidem tempore dicta praesentium.',
					image:  'img/restaurante.jpg',
					street_address: '1346 West Liberty Ave.',
					distance_to: '15'
				},
				{
					pid: 	3,
					name: 	'Lorem ipsum dolor sit.',
					image:  'img/restaurante.jpg',
					street_address: '1346 West Liberty Ave.',
					distance_to: '15'
				}
			];
  			$scope.places = $scope.places.concat(morePlaces);
			$scope.$broadcast('scroll.infiniteScrollComplete');
  		}, 1000);
  	};      
})

.controller('VenueCtrl', function($scope, $rootScope, $timeout){

	$scope.venur = {};

	$scope.loaded= false;

	$timeout(function(){
		$scope.loaded = true;

	$scope.venue = 
		{
			coordinates: {
				lat:10.489279,
				lon:-66.8720721
			},
			distance_to: 150,
			name: "Lorem ipsum dolor sit amet",
			num_tables:	3,
			image:  'img/restaurante.jpg',
			pid: 1,
			street_address:	'1346 West Liberty Ave.',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, aliquam, accusamus consequuntur culpa ut sit modi veritatis eligendi nulla deleniti ipsam dolorem provident quasi porro sunt. Numquam quod magnam perspiciatis.',
   			menus: [{
   					'currency_symbol':'$',
   					'sections': 
   						[{ 
   							'section_name': 'Section name',
   							'subsections': [{ 
   									'subsection_name': 'Subsection name',
   									'contents' :[{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos Lorem ipsum dolor sit.',
   											'price': 20,
   											'type': 'ITEM'
   										},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/no_image.jpg',
   											'name': 'Burrito',
   											'price': 24,
   											'type': 'ITEM'
   									},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito-otro',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito Otro',
   											'price': 24,
   											'type': 'ITEM'
   									}]
   								},{ 
   									'subsection_name': 'Subsection 2 name',
   									'contents' :[{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos',
   											'price': 20,
   											'type': 'ITEM'
   										},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 30,
   											'type': 'ITEM'
   									}]
   								}]
   							},{ 
   							'section_name': 'Section two',
   							'subsections': [{ 
   									'subsection_name': 'Subsection two 1',
   									'contents' :[{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos',
   											'price': 20,
   											'type': 'ITEM'
   										},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 31,
   											'type': 'ITEM'
   									}]
   								},{ 
   									'subsection_name': 'Subsection Two 2',
   									'contents' :[{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos',
   											'price': 32,
   											'type': 'ITEM'
   										},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 20,
   											'type': 'ITEM'
   									},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 20,
   											'type': 'ITEM'
   									},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 20,
   											'type': 'ITEM'
   									}]
   								}]
   							}
   						]
   				},
   				{ 
   					'sections': 
   						[{ 
   							'section_name': 'Section name 2',
   							'subsections': [{ 
   									'subsection_name': '2 Another one',
   									'contents' :[{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos',
   											'price': 20,
   											'type': 'ITEM'
   										}]
   								},{ 
   									'subsection_name': '2 Another one 2',
   									'contents' :[{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos',
   											'price': 20,
   											'type': 'ITEM'
   										},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 30,
   											'type': 'ITEM'
   									}]
   								}]
   							},{ 
   							'section_name': '22 Some other name 2',
   							'subsections': [{ 
   									'subsection_name': '22 Another 2 one',
   									'contents' :[ {
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'tacos',
   											'image': 'img/plato.jpg',
   											'name': 'Tacos',
   											'price': 20,
   											'type': 'ITEM'
   										},{
   											'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum nobis tempore omnis excepturi! Animi, a minima culpa suscipit rerum libero.',
   											'key':	'burrito',
   											'image': 'img/plato.jpg',
   											'name': 'Burrito',
   											'price': 31,
   											'type': 'ITEM'
   									}]
   								}]
   							}   							
   						]
   				}]
		};
	}, 2000);
})
.controller('PlateCtrl', function( $scope, $timeout) {

	$scope.plate = {};

	$scope.loaded = false;

	$timeout(function(){
		$scope.loaded = true;


	$scope.plate = {
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis, et temporibus explicabo velit alias rerum impedit at totam. Ratione, non!",
		distance_to:15,	
		image: 'img/plato.jpg',
		key: "uihkjggjk",
		location:	{
			lat:10.489279,
			lon:-66.8720721
		},
		name: "Plate Lorem ipsum.",
		pid: 123123,
		price: 200,
		rating_average:	3.5,
		restaurant:	{
			coordinates: {
				lat:10.489279,
				lon:-66.8720721
			},
			distance_to: 15,
			name: "Rest Lorem ipsum dolor ",
			num_tables:	30,
			pid: 23123,
			street_address:	"Lorem ipsum dolor sit amet, consectetur adipisicing elit."
		},
		score: 8
	}		

	}, 2000);



})
;