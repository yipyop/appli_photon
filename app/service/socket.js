app.factory('socketService', ['$resource',
	function($resource) {
		var socket = io.connect('http://localhost:3000');
	}
]);