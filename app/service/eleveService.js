app.factory('eleveFactory', ['$resource',
	function($resource) {
		return $resource('/api/liste/:userId', { userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
