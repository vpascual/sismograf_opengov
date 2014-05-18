'use strict';

angular.module('sismografApp')
.factory('ApiRequester', function ($q, $http) {
   return function(queries) {
    
    var promises = queries.map( function(file) {
      
      var deffered  = $q.defer();
  
      $http({
        url : file,
        method: 'GET'
      })
      .success(function(data){
        deffered.resolve(data);
      })
      .error(function(error){
          deffered.reject();
          console.log("Solr returneed error: " + error)
      });
      
      return deffered.promise;

    })
    
    return $q.all(promises);
  }
});
