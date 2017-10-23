var app = angular.module("myApp", ['ngRoute', 'ngResource','angularMoment','ui.materialize',"chart.js"]);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/liste.html',
                controller: "listeCtrl",
                resolve: {
                    liste : function(eleveFactory){
                        console.log('myApp, resolve, liste');
                
                        return eleveFactory.query();

                    }
                }
            })
            .when('/eleve/update/:id', {
                templateUrl: 'app/views/update.html',
                controller: "updateCtrl"
                
            })

            .when("/ajouter", {
                templateUrl: 'app/views/ajouter.html',
                controller: "addCtrl"
                
            })
            .when("/eleve/:id", {
                templateUrl: 'app/views/profil.html',
                controller: "profil.ctrl"
            })

            .when('/liste',{
                templateUrl:'app/views/listeDevice.html',
                controller:'listeDevice.ctrl',
                resolve:{
                    liste:function(deviceFactory){
                        return deviceFactory.query();
                    }
                }
            })
            .when('/device/:id',{
                templateUrl:'app/views/device.html',
                controller:'device.ctrl'
            })
            .otherwise({
                redirectTo: '/',

            });
    }
]);

app.filter('dateFr',['moment',function(moment){
	return function(date){
		return moment().format('LLL');
	}
}]);