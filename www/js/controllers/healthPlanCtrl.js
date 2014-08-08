
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


    // Right Side Menu
    $scope.composeMenu = [{
      'title': "New Plan",
      'compose': function() {
          $ionicSideMenuDelegate.toggleRight(false);
          return $scope.composeDayPlans();
        }
      }, {
      'title': "New Question",
      'compose': function() {
          $ionicSideMenuDelegate.toggleRight(false);
          return $scope.composeDayQuestions();
        }
      }
    ];

    // Called to create a new day
    $scope.newDay = function(date) {
      var day = date.date
      if(day) {
        createDay(day);
      }

      date.date = "";

      $scope.closeDatePicker();
      $scope.toggleDays();
    };

    // Called to delete a day
    $scope.deleteDay = function(index) {
      var deleteDayConfirm = confirm("Are you sure you want to delete " + $scope.days[index].date + "?");

      if (deleteDayConfirm === true) {
        $scope.days.splice(index, 1);
        Days.save($scope.days);
        if(index === Days.getLastActiveIndex()) {
          if (index === 0 && $scope.days.length > 0) {
            Days.setLastActiveIndex(index);
            $scope.activeDay = $scope.days[Days.getLastActiveIndex()];
          } else if(index <= 0) {
            $scope.newDatePicker();
          } else {
            Days.setLastActiveIndex(index-1);
            $scope.activeDay = $scope.days[Days.getLastActiveIndex()];
          }
        }
      } else {
        $ionicSideMenuDelegate.toggleLeft(true);
      }
    };

    // Toggle Edit/Delete Day Button
    $scope.toggleEditDays = function() {
      if($scope.deleteDate === false) {
        $scope.deleteDate = true;
      } else {
        $scope.deleteDate = false;
      }
    };

    // Turn off delete days
    $scope.turnOffEditDaysButtons = function() {
      if($scope.deleteDate === true) {
        $scope.deleteDate = false;
      }
    };

    // Called to select the given day
    $scope.selectDay = function(day, index) {
      $scope.activeDay = day;
      Days.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
      $scope.turnOffEditDaysButtons();
    };

    // Create and Load Modal
    $ionicModal.fromTemplateUrl('day-plans.html', function(modal) {
      $scope.dayPlansModal = modal;
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

      $scope.dayPlansModal.hide();

      // Inefficient, but save all the days
      Days.save($scope.days);

      day.plan.what = "";
      day.plan.when = "";
      day.plan.know = "";
    };

    // Open our day details modal
    $scope.composeDayPlans = function() {
      $scope.dayPlansModal.show();
    }
    // Close day details modal
    $scope.closeDayPlans = function() {
      $scope.dayPlansModal.hide();
    }

    // Open Date Picker Modal
    $scope.newDatePicker = function() {
      $scope.turnOffEditDaysButtons();
      $scope.datePickerModal.show();
      // angular.element("#dateselect").focus();
    }
    // Close Date Picker Modal
    $scope.closeDatePicker = function() {
      $scope.datePickerModal.hide();
    }

    $scope.toggleDays = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $scope.turnOffEditDaysButtons();
    };

    $scope.toggleCompose = function() {
      $ionicSideMenuDelegate.toggleRight();
    };

    // Watch Days Array and Show Date Picker if empty
    $scope.$watch('days', function() {
      if($scope.days.length === 0 || undefined) {
        $scope.newDatePicker();
      }
    });

  })