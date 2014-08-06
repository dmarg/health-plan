
angular.module('healthPlan')
  .controller('HealthPlanCtrl', function($scope, $timeout, $ionicModal, Days, $ionicSideMenuDelegate) {

    var createDay = function(day) {
      var newDay = Days.newDay(day);
      $scope.days.push(newDay);
      Days.save($scope.days);
      $scope.selectDay(newDay, $scope.days.length-1);
    }

    // Load or initialize days
    $scope.days = Days.all();

    // Grab the last active, or the first day
    $scope.activeDay = $scope.days[Days.getLastActiveIndex()];

    // Called to create a new day
    $scope.newDay = function() {
      var day = prompt()
      if(day) {
        createDay(day);
      }
    };

    // Called to select the given day
    $scope.selectDay = function(day, index) {
      $scope.activeDay = day;
      Days.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
    };

    // Create and Load Modal
    $ionicModal.fromTemplateUrl('day-details.html', function(modal) {
      $scope.dayDetailsModal = modal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('date-picker.html', function(modal) {
      $scope.datePickerModal = modal;
    }, {
      scope: $scope
    });

    // $scope.createPlan = function(plan) {
    //   if(!$scope.activeDay !! !plan) {
    //     return;
    //   }

    //   $scope.activeDay.plans.push({
    //     what: plan.what,
    //     when: plan.when,
    //     know: plan.know
    //   });

    //   $scope.dayDetailsModal.hide();

    //   // Inefficient, but save all the days
    //   Days.save($scope.days);

    //   plan.what = "";
    //   plan.when = "";
    //   plan.know = "";
    // };

    // Open our day details modal
    $scope.openDayDetails = function() {
      $scope.dayDetailsModal.show();
    }

    // Close day details modal
    $scope.closeDayDetails = function() {
      $scope.dayDetailsModal.hide();
    }


    // Open Date Picker Modal
    $scope.newDatePicker = function() {
      $scope.datePickerModal.show();
    }

    // Close Date Picker Modal
    $scope.closeDatePicker = function() {
      $scope.datePickerModal.hide();
    }


    $scope.toggleDays = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $timeout(function() {
      if($scope.day.length == 0) {
        while(true) {
          var day = Date.toString();
          if(day) {
            createDay(day);
            break;
          }
        }
      }
    });

  })