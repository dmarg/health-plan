
angular.module('healthPlan')
  .controller('HealthPlanCtrl', function($scope, $timeout, $ionicModal, Days, $ionicSideMenuDelegate) {

    var createDay = function(date) {
      var newDay = Days.newDay(date);
      $scope.days.push(newDay);
      Days.save($scope.days);
      $scope.selectDay(newDay, $scope.days.length-1);
    };

    // Load or initialize days
    $scope.days = Days.all();
    $scope.deleteDate = false;
    // Grab the last active, or the first day
    $scope.activeDay = $scope.days[Days.getLastActiveIndex()];

    // Called to create a new day
    $scope.newDay = function(date) {
      var day = date.date
      if(day) {
        createDay(day);
      }

      day.date = "";

      $scope.closeDatePicker();
      $scope.toggleDays();
    };

    // Called to delete a day
    $scope.deleteDay = function(index) {
      $scope.days.splice(index, 1);
      Days.save($scope.days);
    };

    $scope.toggleEditDays = function() {
      if($scope.deleteDate === false) {
        $scope.deleteDate = true;
      } else {
        $scope.deleteDate = false;
      }
    };

    // Called to select the given day
    $scope.selectDay = function(day, index) {
      $scope.activeDay = day;
      Days.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);

      if($scope.deleteDate === true) {
        $scope.deleteDate = false;
      }
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

    $scope.editDayDetails = function(day) {
      if(!$scope.activeDay || !day) {
        return;
      }

      $scope.activeDay.details.plans.push({
        what: day.plan.what,
        when: day.plan.when,
        know: day.plan.know
      });

      $scope.dayDetailsModal.hide();

      // Inefficient, but save all the days
      Days.save($scope.days);

      day.plan.what = "";
      day.plan.when = "";
      day.plan.know = "";
    };

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
      // angular.element("#dateselect").focus();
    }
    // Close Date Picker Modal
    $scope.closeDatePicker = function() {
      $scope.datePickerModal.hide();
    }

    $scope.toggleDays = function() {
      $ionicSideMenuDelegate.toggleLeft();
      if($scope.deleteDate === true) {
        $scope.deleteDate = false;
      }
    };

    $timeout(function() {
      if($scope.days.length == 0) {
        while(true) {
          var day = prompt("Date:");
          if(day) {
            createDay(day);
            break;
          }
        }
      }
    });

  })