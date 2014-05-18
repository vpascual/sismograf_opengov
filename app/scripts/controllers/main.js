'use strict';

angular.module('sismografApp')
  .controller('MainCtrl', function ($scope, ApiRequester) {
    var url = "http://opengov.cat/sismograf/api/canvis/all/**START_DATE**/**END_DATE**";
    var startignDate = new Date(2013, 4, 20);
    $scope.dateFormat = d3.time.format("%Y-%m-%d");    
    $scope.linechartdata = [];

    Date.prototype.addHours = function(h) {    
      this.setTime(this.getTime() + (h*60*60*1000)); 
      return this;   
    }

    Date.prototype.addDays = function(days) {    
      this.setDate(this.getDate() + days); 
      return this;   
    }

    getData();

    function getData() {
      var results = getQueries();
      var values = [];

      ApiRequester(results.queries).then(function(data) {
        // console.dir(data);
        data.forEach(function(d, i) {
          // // console.log(d)
          var totalChanges = d.results.borrados.length + d.results.canvisnom.length + d.results.canvisresp.length + d.results.nuevos.length;
          values.push({"date" : results.dates[i], "value": totalChanges});
        });

        $scope.linechartdata = values;
      })
    }

    function getQueries() {
      // // console.log("$scope.minSolrDate: " + $scope.minSolrDate);
      // // console.log("$scope.maxSolrDate: " + $scope.maxSolrDate);
     
      var queries = [];
      var dates = [];
      var currentDay;
      var today = new Date();
      var lastDay = startignDate.addDays(-1);
      var newQuery;
      var q = url;
      
      while (lastDay < today) {
        currentDay = new Date(lastDay.getTime());
        currentDay.addDays(1);
        // // console.log("Current hour: " + currentHour)
        lastDay.addDays(7);
        // // console.log("Last hour: " + lastHour)
        
        newQuery = q.replace("**START_DATE**", $scope.dateFormat(currentDay));
        newQuery = newQuery.replace("**END_DATE**", $scope.dateFormat(lastDay));

        // console.log(lastDay)
        queries.push(newQuery);
        dates.push(new Date(lastDay.getTime()));
      }

      // console.dir(dates);
      // console.dir(queries);

      return {'queries':queries, 'dates':dates};
    }

  });
