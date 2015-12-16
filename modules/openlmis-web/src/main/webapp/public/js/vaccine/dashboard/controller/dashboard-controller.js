/*
 * Electronic Logistics Management Information System (eLMIS) is a supply chain management system for health commodities in a developing country setting.
 *
 * Copyright (C) 2015  John Snow, Inc (JSI). This program was produced for the U.S. Agency for International Development (USAID). It was prepared under the USAID | DELIVER PROJECT, Task Order 4.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function VaccineDashboardController($scope,VaccineDashboardSummary,$filter,VaccineDashboardMonthlyCoverage,
                                    VaccineDashboardDistrictCoverage,
                                    VaccineDashboardMonthlyDropout,
                                    VaccineDashboardDistrictDropout,
                                    VaccineDashboardDistrictSessions,
                                    VaccineDashboardSessions,
                                    VaccineDashboardMonthlyStock,
                                    VaccineDashboardDistrictStock,
                                    VaccineDashboardMonthlyWastage,
                                    VaccineDashboardDistrictWastage,
                                    VaccineDashboardBundle,
                                    defaultProduct,
                                    defaultPeriodTrend,
                                    defaultMonthlyPeriod,
                                    SettingsByKey, messageService) {
    $scope.actionBar = {openPanel: true};
    $scope.performance = {openPanel: true};
    $scope.stockStatus = {openPanel: true};
     $scope.sessions = {
        openPanel: true
    };


    $scope.defaultPeriodTrend = parseInt(defaultPeriodTrend, 10);
    $scope.defaultProduct = defaultProduct;
    $scope.defaultMonthlyPeriod = defaultMonthlyPeriod;

    $scope.label ={ zone: messageService.get('label.zone'), period: messageService.get('label.period')} ;


//Instantiate Monthly Sessions charting options
     $scope.monthlySessions = {
        dataPoints: [],
            dataColumns: [{
            "id": "outreach_sessions",
            "name": messageService.get('label.outreach.sessions'),
            "type": "bar"
        },
            {"id": "fixed_sessions", "name": messageService.get('label.fixed.sessions'), "type": "bar"}],
            dataX: {"id": "period_name"}
    };
//Instantiate District Sessions charting options
    $scope.districtSessions = {
        dataPoints: [],
        dataColumns: [{
            "id": "outreach_sessions",
            "name": messageService.get('label.outreach.sessions'),
            "type": "bar"
        },
            {"id": "fixed_sessions", "name": messageService.get('label.fixed.sessions'), "type": "bar"}],
        dataX: {"id": "geographic_zone_name"}
    };

    $scope.monthlyCoverage = {
        dataPoints: [],
        dataColumns: [{
                        "id": "coverage", "name": messageService.get('label.coverage'), "type": "line"},
                      {"id": "actual", "name": messageService.get('label.actual'), "type": "bar"},
                      {"id": "target", "name": messageService.get('label.target'), "type": "bar"}
                    ],
        dataX: {"id": "period_name"}
    };

    $scope.districtCoverage = {
        dataPoints: [],
        dataColumns: [{
            "id": "coverage", "name": messageService.get('label.coverage'), "type": "line"},
            {"id": "actual", "name": messageService.get('label.actual'), "type": "bar"},
            {"id": "target", "name": messageService.get('label.target'), "type": "bar"}
        ],
        dataX: {"id": "geographic_zone_name"}
    };


    $scope.monthlyWastage = {
        dataPoints: [],
        dataColumns: [{
            "id": "wastage_rate", "name": messageService.get('label.wastage.rate'), "type": "bar"}
        ],
        dataX: {"id": "period_name"}
    };

    $scope.districtWastage= {
        dataPoints: [],
        dataColumns: [{
            "id": "wastage_rate", "name": messageService.get('label.wastage.rate'), "type": "bar"}
        ],
        dataX: {"id": "geographic_zone_name"}
    };

    $scope.monthlyDropout= {
        dataPoints: [],
        dataColumns: [{
            "id": "bcg_mr_dropout", "name": messageService.get('label.bcg.mr.dropout'), "type": "bar"},
            {"id": "dtp1_dtp3_dropout", "name": messageService.get('label.dtp.dropout'), "type": "bar"}
        ],
        dataX: {"id": "period_name"}
    };
    $scope.districtDropout= {
        dataPoints: [],
        dataColumns: [{
            "id": "bcg_mr_dropout", "name": messageService.get('label.bcg.mr.dropout'), "type": "bar"},
            {"id": "dtp1_dtp3_dropout", "name": messageService.get('label.dtp.dropout'), "type": "bar"}
        ],
        dataX: {"id": "geographic_zone_name"}
    };

    $scope.monthlyStock= {
        dataPoints: [],
        dataColumns: [{
            "id": "mos", "name": messageService.get('label.mos'), "type": "bar"}
        ],
        dataX: {"id": "period_name"}
    };
    $scope.districtStock= {
        dataPoints: [],
        dataColumns: [{
            "id": "mos", "name": messageService.get('label.mos'), "type": "bar"}
        ],
        dataX: {"id": "geographic_zone_name"}
    };

    $scope.bundling= {
        dataPoints: [],
        dataColumns: [{
            "id": "minlimit", "name": messageService.get('label.min.limit'), "type": "line"},
            {"id": "maxlimit", "name": messageService.get('label.max.limit'), "type": "line"},
            {"id": "bund_issued", "name": messageService.get('label.bundle.issued'), "type": "bar"},
            {"id": "bund_received", "name": messageService.get('label.bundle.received'), "type": "bar"}
        ],
        dataX: {"id": "period_name"}
    };

    $scope.formatValue = function (value, ratio, id) {
        return $filter('number')(value);
    };

    $scope.$watchCollection('[filter.monthlyCoverage.startDate, filter.monthlyCoverage.endDate, filter.monthlyCoverage.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.monthlyCoverage.startDate) &&
            !isUndefined( $scope.filter.monthlyCoverage.endDate) &&
            !isUndefined($scope.filter.monthlyCoverage.product)){
            VaccineDashboardMonthlyCoverage.get({startDate: $scope.filter.monthlyCoverage.startDate, endDate: $scope.filter.monthlyCoverage.endDate,
                product: $scope.filter.monthlyCoverage.product}, function(data){
                $scope.monthlyCoverage.dataPoints = data.monthlyCoverage;
            });
        }
    });

    $scope.$watchCollection('[filter.districtCoverage.period, filter.districtCoverage.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.districtCoverage.period) &&
            !isUndefined($scope.filter.districtCoverage.product)){
            VaccineDashboardDistrictCoverage.get({period: $scope.filter.districtCoverage.period,
                product: $scope.filter.districtCoverage.product}, function(data){
                $scope.districtCoverage.dataPoints = data.districtCoverage;
            });
        }
    });

    $scope.$watchCollection('[filter.monthlyWastage.startDate, filter.monthlyWastage.endDate, filter.monthlyWastage.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.monthlyWastage.startDate) &&
            !isUndefined( $scope.filter.monthlyWastage.endDate) &&
            !isUndefined($scope.filter.monthlyWastage.product)){
            VaccineDashboardMonthlyWastage.get({startDate: $scope.filter.monthlyWastage.startDate, endDate: $scope.filter.monthlyWastage.endDate,
                product: $scope.filter.monthlyWastage.product}, function(data){
                $scope.monthlyWastage.dataPoints = data.wastageMonthly;
            });
        }
    });

    $scope.$watchCollection('[filter.districtWastage.period, filter.districtWastage.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.districtWastage.period) &&
            !isUndefined( $scope.filter.districtWastage.product) ){
            VaccineDashboardDistrictWastage.get({period: $scope.filter.districtWastage.period,  product: $scope.filter.districtWastage.product}, function(data){
                $scope.districtWastage.dataPoints = data.districtWastage;
            });
        }
    });

    $scope.$watchCollection('[filter.monthlyDropout.startDate, filter.monthlyDropout.endDate, filter.monthlyDropout.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.monthlyDropout.startDate) &&
            !isUndefined( $scope.filter.monthlyDropout.endDate) &&
            !isUndefined($scope.filter.monthlyDropout.product)){
            VaccineDashboardMonthlyDropout.get({startDate: $scope.filter.monthlyDropout.startDate, endDate: $scope.filter.monthlyDropout.endDate,
                product: $scope.filter.monthlyDropout.product}, function(data){
                $scope.monthlyDropout.dataPoints = data.monthlyDropout;
            });
        }
    });

    $scope.$watchCollection('[filter.districtDropout.period, filter.districtDropout.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.districtDropout.period) &&
            !isUndefined($scope.filter.districtDropout.product)){
            VaccineDashboardDistrictDropout.get({period: $scope.filter.districtDropout.period,
                product: $scope.filter.districtDropout.product}, function(data){
                $scope.districtDropout.dataPoints = data.districtDropout;
            });
        }
    });

    $scope.$watchCollection('[filter.monthlyStock.startDate, filter.monthlyStock.endDate, filter.monthlyStock.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.monthlyStock.startDate) &&
            !isUndefined( $scope.filter.monthlyStock.endDate) &&
            !isUndefined($scope.filter.monthlyStock.product)){
            VaccineDashboardMonthlyStock.get({startDate: $scope.filter.monthlyStock.startDate, endDate: $scope.filter.monthlyStock.endDate,
                product: $scope.filter.monthlyStock.product}, function(data){
                $scope.monthlyStock.dataPoints = data.monthlyStock;
            });
        }
    });

    $scope.$watchCollection('[filter.districtStock.period, filter.districtStock.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.districtStock.period) &&
            !isUndefined( $scope.filter.districtStock.product) ){
            VaccineDashboardDistrictStock.get({period: $scope.filter.districtStock.period,  product: $scope.filter.districtStock.product}, function(data){
                $scope.districtStock.dataPoints = data.districtStock;
            });
        }
    });


    $scope.$watchCollection('[filter.monthlySessions.startDate, filter.monthlySessions.endDate]', function(newValues, oldValues){

        if(!isUndefined( $scope.filter.monthlySessions.startDate) && !isUndefined( $scope.filter.monthlySessions.endDate)){
            VaccineDashboardSessions.get({startDate: $scope.filter.monthlySessions.startDate, endDate: $scope.filter.monthlySessions.endDate}, function(data){

                $scope.monthlySessions.dataPoints =   data.monthlySessions;
            });
        }
    });


    $scope.$watchCollection('[filter.bundling.startDate, filter.bundling.endDate, filter.bundling.product]', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.bundling.startDate) &&
            !isUndefined( $scope.filter.bundling.endDate) &&
            !isUndefined($scope.filter.bundling.product)){
            VaccineDashboardBundle.get({startDate: $scope.filter.bundling.startDate, endDate: $scope.filter.bundling.endDate,
                product: $scope.filter.bundling.product}, function(data){
                $scope.bundling.dataPoints = data.bundling;
            });
        }
    });

    $scope.$watch('filter.districtSessions.period', function(newValues, oldValues){
        if(!isUndefined( $scope.filter.districtSessions.period) ) {
            VaccineDashboardDistrictSessions.get({period: $scope.filter.districtSessions.period}, function(data){

                $scope.districtSessions.dataPoints =   data.districtSessions;
            });
        }

    });

    SettingsByKey.get({key: 'DASHBOARD_SLIDES_TRANSITION_INTERVAL_MILLISECOND'}, function(data){
        $scope.defaultSlideTransitionInterval = data.settings.value;
        $scope.consumptionSlideInterval = $scope.stockSlideInterval = $scope.lossesSlideInterval = $scope.defaultSlideTransitionInterval;


        var carousel = function(id){
            return {id: id,
                interval: $scope.defaultSlideTransitionInterval,
                isPlaying:  function(){ return this.interval >= 0;},
                play: function(){ this.interval = $scope.defaultSlideTransitionInterval; this.isPlaying = true;},
                pause: function(){this.interval = -1; this.isPlaying = false; }};
        };

        $scope.carousels = [carousel('trend'), carousel('district'), carousel('facility')];
    });


    $scope.setInterval = function(carouselId){
        var cr = _.findWhere($scope.carousels, {id: carouselId});
        if(!isUndefined(cr)){
            return cr.interval;
        }
        return -1;
    };

    $scope.OnFilterChanged = function() {

        $scope.data = $scope.datarows = [];
       // $scope.filter.max = 10000;
    };


    VaccineDashboardSummary.get({}, function(data){
       $scope.reportingPerformance = data.summary.reportingSummary;
       $scope.repairing = data.summary.repairing;
       $scope.investigating = data.summary.investigating;
    });


    $scope.reportingPerformance = {};

    $scope.repairing = {};
    $scope.supplying = {};
    $scope.investigating = {};
    $scope.filter ={sessions:{}};

    $scope.datapoints=[];
    $scope.datacolumns=[{"id":"outreach_sessions", "name": messageService.get('label.outreach.sessions'),"type":"bar"},
        {"id":"fixed_sessions","name": messageService.get('label.outreach.sessions'),"type":"bar"}
    ];

    $scope.datax={"id":"period_name"};

}
VaccineDashboardController.resolve = {
    defaultProduct : function($q, $timeout, SettingsByKey){
        var deferred = $q.defer();
        $timeout(function () {

            SettingsByKey.get({key: 'VACCINE_DASHBOARD_DEFAULT_PRODUCT'}, function(data){
                deferred.resolve(data.settings.value);

            });

        },100);

        return deferred.promise;

    },
    defaultPeriodTrend : function($q, $timeout, SettingsByKey){
        var deferred = $q.defer();
        $timeout(function () {

            SettingsByKey.get({key: 'VACCINE_DASHBOARD_DEFAULT_PERIOD_TREND'}, function(data){
                deferred.resolve(data.settings.value);

            });

        },100);

        return deferred.promise;

    },
    defaultMonthlyPeriod: function($q, $timeout, SettingsByKey){
        var deferred = $q.defer();
        $timeout(function () {

            SettingsByKey.get({key: 'VACCINE_DASHBOARD_DEFAULT_MONTHLY_PERIOD'}, function(data){
                deferred.resolve(data.settings.value);

            });

        },100);

        return deferred.promise;

    }


};