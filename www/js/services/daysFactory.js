
angular.module('healthPlan')
  .factory('Days', function(){
    return {
      all: function() {
        var dayString = window.localStorage['days'];
        if(dayString) {
          return angular.fromJson(dayString);
        }
        return [];
      },
      save: function(days) {
        window.localStorage['days'] = angular.toJson(days);
      },
      newDay: function(date) {
        //Add a new day
        return {
          date: date,
          details: {
            plans: [],
            questions: {},
            medTeam: [],
            journals: []}
        }
      },
      getLastActiveIndex: function() {
        return parseInt(window.localStorage['lastActiveDay']) || 0;
      },
      setLastActiveIndex: function(index) {
        window.localStorage['lastActiveDay'] = index;
      }
    }
  });