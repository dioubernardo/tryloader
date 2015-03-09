'use strict';

var __tryloaderChange;

angular.module('tryloader', [])
	.run(function($rootScope){
		$rootScope.isLoading = false;
		var counter = 0;
		__tryloaderChange = function(i){
			counter += i;
			$rootScope.isLoading = counter > 0; 
		}
	})
	.config(function($httpProvider){
		$httpProvider.interceptors.push(function($q) {
			return {
				'request': function(config){
					__tryloaderChange(1);
					return config;
				},
				'requestError': function(rejection) {
					__tryloaderChange(-1);
					return $q.reject(rejection);
				},
				'response': function(response) {
					__tryloaderChange(-1);
					return response;
				},
				'responseError': function(rejection) {
					__tryloaderChange(-1);
					return $q.reject(rejection);
				}
			};
		});	
	});

Parse._ajax = function(original){
	return function (method, url, data, success, error){
		__tryloaderChange(1);
		return original.call(null, method, url, data, function(){
			__tryloaderChange(-1);
			if (success != undefined)
				success.apply(this, arguments);
		}, function(){
			__tryloaderChange(-1);
			if (error != undefined)
				error.apply(this, arguments);
		});
	};
}(Parse._ajax);