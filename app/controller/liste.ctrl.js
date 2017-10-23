app.controller("listeCtrl", function($scope, $http, liste, eleveFactory ) {
    $scope.maliste = liste;  
    console.log($scope.maliste);
    $scope.date = new Date();
    $scope.deleteEleve = function(eleve, index) {
        console.log(eleve._id);
        console.log(index);
        eleve.$delete();
        $scope.maliste.splice(index, 1);
    };
});