require(["../../shared/app","../controller/view-order-list-controller"],function(app){app.loadApp();angular.module("order",["openlmis","ngGrid"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/view-orders",{controller:ViewOrderListController,templateUrl:"partials/view-order.html",resolve:ViewOrderListController.resolve}).otherwise({redirectTo:"/view-orders"})}]);angular.bootstrap(document,["order"])});