app.controller("updateCtrl", function($scope, $rootScope, eleveFactory, $routeParams, $window) {
    $scope.eleve = eleveFactory.get({userId : $routeParams.id});
    console.log($scope.eleve);
    $scope.updateEleve = function(eleve) {
        console.log(eleve);
        eleve.$update(eleve);
        $window.location.href = '/';
    };
});