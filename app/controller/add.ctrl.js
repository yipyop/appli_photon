app.controller("addCtrl", function($scope, $rootScope, eleveFactory, $window) {
    
    $scope.eleve = new eleveFactory();

    $scope.addEleve = function(eleve) {
        console.log(eleve);
        eleve.$save();
        $window.location.href = '/';
    };
});