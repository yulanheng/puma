var pageApp = angular.module("pageApp", [ 'ngDialog' ]);

pageApp.factory('pageService', [ '$http', '$location',
		function($http, $location) {
			var list = function(page, pageSize) {
				return $http({
					params : {
						page : page,
						pageSize : pageSize
					},
					url : $location.absUrl() + '/list'
				});
			};

			var action = function(name, actionName) {
				return $http({
					method : 'POST',
					params : {
						name : name
					},
					url : $location.absUrl() + '/' + actionName
				});
			};

			return {
				list : function(page, pageSize) {
					return list(page, pageSize);
				},
				action : function(name, actionName) {
					return action(name, actionName);
				}
			};
		} ]);

pageApp
		.controller(
				'pageCtrl',
				[
						'$scope',
						'$rootScope',
						'pageService',
						'ngDialog',
						function($scope, $rootScope, pageService, ngDialog) {

							$scope.currentPage = 1;
							$scope.totalPage = 1;
							$scope.pageSize = 3;
							$scope.pages = [];
							$scope.endPage = 1;
							$scope.count = 0;
							$scope.startIndex = 0;
							$scope.endIndex = 0;
							$rootScope.load = function() {
								pageService
										.list($scope.currentPage,
												$scope.pageSize)
										.success(
												function(data) {
													$scope.items = data.list;
													$scope.states = data.state;
													// 获取总页数
													$scope.count = data.count;
													$scope.totalPage = Math
															.ceil(data.count
																	/ $scope.pageSize);
													$scope.endPage = $scope.totalPage;
													// 生成数字链接
													if ($scope.currentPage > 1
															&& $scope.currentPage < $scope.totalPage) {
														$scope.pages = [
																$scope.currentPage - 1,
																$scope.currentPage,
																$scope.currentPage + 1 ];
													} else if ($scope.currentPage == 1
															&& $scope.totalPage > 1) {
														$scope.pages = [
																$scope.currentPage,
																$scope.currentPage + 1 ];
													} else if ($scope.currentPage == $scope.totalPage
															&& $scope.totalPage > 1) {
														$scope.pages = [
																$scope.currentPage - 1,
																$scope.currentPage ];
													}
													$scope.startIndex = $scope.count == 0 ? 0
															: ($scope.currentPage - 1)
																	* $scope.pageSize
																	+ 1;
													$scope.endIndex = $scope.count > $scope.currentPage
															* $scope.pageSize ? $scope.currentPage
															* $scope.pageSize
															: $scope.count;
												});
							};

							$scope.next = function() {
								if ($scope.currentPage < $scope.totalPage) {
									$scope.currentPage++;
									$rootScope.load();
								}
							};

							$scope.prev = function() {
								if ($scope.currentPage > 1) {
									$scope.currentPage--;
									$rootScope.load();
								}
							};

							$scope.loadPage = function(page) {
								$scope.currentPage = page;
								$rootScope.load();
							};

							$scope.state = function(name) {
								for (var i = 0, len = $scope.states.length; i < len; i++) {
									if ($scope.states[i].taskName == name) {
										return $scope.states[i];
									}
								}
							};

							$scope.refresh = function(name) {
								for (var i = 0, len = $scope.states.length; i < len; i++) {
									if ($scope.states[i].taskName == name) {
										var result = pageService
												.action(name, 'refresh')
												.success(
														function(data) {
															$scope.states[i] = data.state;
														});
										break;
									}
								}
							};

							$scope.pause = function(name) {
								pageService.action(name, 'pause').success(
										function(data) {
											$scope.refresh(name);
										});
							};

							$scope.resume = function(name) {
								pageService.action(name, 'resume').success(
										function(data) {
											$scope.refresh(name);
										});
							};

							$rootScope.remove = function(name) {
								pageService
										.action(name, 'remove')
										.success(
												function(data) {
													$scope.count--;
													if ($scope.count % $scope.pageSize == 0){
														$scope.currentPage--;
														if($scope.currentPage <= 0)
															$scope.currentPage = 1;
													}
													$rootScope.load();
												});
								return true;
							};

							$scope.dialog = function(name) {
								$rootScope.removeName = name
								ngDialog
										.open({
											template : '\
												<div class="widget-box">\
												<div class="widget-header">\
													<h4 class="widget-title">警告</h4>\
												</div>\
												<div class="widget-body">\
													<div class="widget-main">\
														<p class="alert alert-info">\
															您确认要删除吗？\
														</p>\
													</div>\
													<div class="modal-footer">\
														<button type="button" class="btn btn-default" ng-click="closeThisDialog()">取消</button>\
														<button type="button" class="btn btn-primary" ng-click="true&&remove(removeName)&&closeThisDialog()">确定</button>\
													</div>\
												</div>\
											</div>',
											plain : true,
											className : 'ngdialog-theme-default'
										});
							};

						} ]);

var formApp = angular.module("formApp", []);

formApp
		.factory(
				'formService',
				[
						'$http',
						'$window',
						'$location',
						function($http, $window, $location) {
							var submit = function(data) {
								return $http({
									method : 'POST',
									params : data,
									url : $location.absUrl()
								});
							};
							var redirect = function() {
								return $window.location.href = 
								'http://localhost:8082/puma-admin/puma-server/';
							};

							return {
								submit : function(data) {
									return submit(data);
								},
								redirect : function() {
									return redirect();
								}
							};
						} ]);

formApp.controller('formCtrl', [ '$scope', '$window', 'formService',
		function($scope, $window, formService) {

			$scope.submit = function() {
				formService.submit($scope.entity).success(function(data) {
					if (data.success) {
						formService.redirect();
					} else {
						return false;
					}
				});
			};

			$scope.goBack = function() {
				$window.history.back();
			};
		} ]);