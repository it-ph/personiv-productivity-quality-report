var adminModule = angular.module("adminModule", ["sharedModule"]);
adminModule.config(["$stateProvider", function(e) {
  e.state("main", {
    url: "/",
    views: {
      "": {
        templateUrl: "/app/shared/views/main.view.html",
        controller: "mainViewController"
      },
      "toolbar@main": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "left-sidenav@main": {
        templateUrl: "/app/components/admin/templates/sidenavs/main-left.sidenav.html",
        controller: "leftSidenavController"
      },
      "content-container@main": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "mainContentContainerController"
      },
      "content@main": {
        templateUrl: "/app/components/admin/templates/content/main.content.template.html"
      },
      "right-sidenav@main": {
        templateUrl: "/app/components/admin/templates/sidenavs/main-right.sidenav.html"
      }
    }
  }).state("main.activity", {
    url: "activities",
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "activityContentContainerController"
      },
      "toolbar@main.activity": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.activity": {
        templateUrl: "/app/shared/templates/content/activity.content.template.html"
      }
    }
  }).state("main.weekly-report", {
    url: "weekly-report/{departmentID}",
    params: {
      departmentID: null
    },
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "departmentContentContainerController"
      },
      "toolbar@main.weekly-report": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.weekly-report": {
        templateUrl: "/app/shared/templates/main.content.template.html"
      },
      "right-sidenav@main.weekly-report": {
        templateUrl: "/app/components/team-leader/templates/sidenavs/main-right.sidenav.html"
      }
    }
  }).state("main.work-hours", {
    url: "work-hours",
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "workHoursContentContainerController"
      },
      "toolbar@main.work-hours": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.work-hours": {
        templateUrl: "/app/components/admin/templates/content/work-hours.content.template.html"
      }
    }
  }).state("main.team-leaders", {
    url: "team-leaders",
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "teamLeaderContentContainerController"
      },
      "toolbar@main.team-leaders": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.team-leaders": {
        templateUrl: "/app/components/admin/templates/content/team-leaders.content.template.html"
      }
    }
  }).state("main.department-settings", {
    url: "department-settings",
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "departmentSettingsContentContainerController"
      },
      "toolbar@main.department-settings": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.department-settings": {
        templateUrl: "/app/components/admin/templates/content/settings.content.template.html"
      }
    }
  }).state("main.projects", {
    url: "department-settings/{departmentID}/projects",
    params: {
      departmentID: null
    },
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "projectsContentContainerController"
      },
      "toolbar@main.projects": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.projects": {
        templateUrl: "/app/components/admin/templates/content/projects.content.template.html"
      }
    }
  }).state("main.positions", {
    url: "department-settings/{departmentID}/project/{projectID}",
    params: {
      departmentID: null,
      projectID: null
    },
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "positionsContentContainerController"
      },
      "toolbar@main.positions": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.positions": {
        templateUrl: "/app/components/admin/templates/content/positions.content.template.html"
      }
    }
  }).state("main.edit-report", {
    url: "edit-report/{reportID}",
    params: {
      reportID: null
    },
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "editReportContentContainerController"
      },
      "toolbar@main.edit-report": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.edit-report": {
        templateUrl: "/app/shared/templates/content/edit-report.content.template.html"
      }
    }
  }).state("main.approvals", {
    url: "approvals",
    views: {
      "content-container": {
        templateUrl: "/app/components/admin/views/content-container.view.html",
        controller: "approvalsContentContainerController"
      },
      "toolbar@main.approvals": {
        templateUrl: "/app/components/admin/templates/toolbar.template.html"
      },
      "content@main.approvals": {
        templateUrl: "/app/shared/templates/content/approval.content.template.html"
      }
    }
  })
}]), adminModule.controller("activityContentContainerController", ["$scope", "$mdDialog", "Activity", "Preloader", "User", function(e, t, r, o, a) {
  e.form = {}, e.activity = {}, e.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var n = 2016;
  e.years = [];
  for (var l = (new Date).getFullYear(); l >= n; l--) e.years.push(l);
  e.activity.month = e.months[(new Date).getMonth()], e.activity.year = (new Date).getFullYear(), e.toolbar = {}, e.toolbar.hideSearchIcon = !0, e.toolbar.childState = "Activities", e.subheader = {}, e.subheader.refresh = function() {
    o.preload(), e.init(!0)
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.report.show = !1
  }, e.showDetails = function(e) {
    o.set(e), t.show({
      controller: "reportDialogController",
      templateUrl: "/app/shared/templates/dialogs/report.dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.showHistory = function(e) {
    o.set(e), t.show({
      controller: "performanceHistoryDialogController",
      templateUrl: "/app/shared/templates/dialogs/performance-history.dialog.template.html",
      parent: angular.element(document.body)
    })
  };
  var i = function(e) {
    return e.created_at = new Date(e.created_at), e.first_letter = e.user.first_name.charAt(0).toUpperCase(), e
  };
  e.search = function() {
    o.preload(), r.reportSubmitted(e.activity).success(function(t) {
      angular.forEach(t, function(e) {
        i(e)
      }), e.submitted = t
    }).error(function() {
      o.error()
    }), r.reportUpdated(e.activity).success(function(t) {
      angular.forEach(t, function(e) {
        i(e)
      }), e.updated = t
    }).error(function() {
      o.error()
    }), r.reportDeleted(e.activity).success(function(t) {
      angular.forEach(t, function(e) {
        i(e)
      }), o.stop(), o.stop(), e.deleted = t
    }).error(function() {
      o.error()
    })
  }, e.init = function(t) {
    r.reportSubmitted().success(function(t) {
      angular.forEach(t, function(e) {
        i(e)
      }), e.submitted = t
    }).error(function() {
      o.error()
    }), r.reportUpdated().success(function(t) {
      angular.forEach(t, function(e) {
        i(e)
      }), e.updated = t
    }).error(function() {
      o.error()
    }), r.reportDeleted().success(function(t) {
      angular.forEach(t, function(e) {
        i(e)
      }), e.deleted = t
    }).error(function() {
      o.error()
    }), t && o.stop()
  }, e.init()
}]), adminModule.controller("approvalsContentContainerController", ["$scope", "$state", "$mdDialog", "PerformanceApproval", "Approval", "Preloader", function(e, t, r, o, a, n) {
  e.form = {}, e.approval = {}, e.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var l = 2016;
  e.years = [];
  for (var i = (new Date).getFullYear(); i >= l; i--) e.years.push(i);
  e.approval.month = e.months[(new Date).getMonth()], e.approval.year = (new Date).getFullYear(), e.toolbar = {}, e.toolbar.hideSearchIcon = !0, e.toolbar.childState = "Approvals", e.subheader = {}, e.subheader.state = "approvals", e.subheader.refresh = function() {
    n.preload(), e.init(!0)
  }, e.showPending = function(t) {
    n.set(t), r.show({
      controller: "approvalsDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/approval.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.showApprovedDetails = function(t) {
    n.set(t), r.show({
      controller: "approvedApprovalsDetailsDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.showDeclinedDetails = function(t) {
    n.set(t), r.show({
      controller: "declinedApprovalsDetailsDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/declined-approval-details.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.search = function() {
    n.preload(), a.pending(e.approval).success(function(t) {
      e.pendingApprovals = t
    }).error(function() {
      n.error()
    }), o.approved(e.approval).success(function(t) {
      e.approved = t
    }).error(function() {
      n.error()
    }), o.declined(e.approval).success(function(t) {
      e.declined = t, n.stop()
    }).error(function() {
      n.error()
    })
  }, e.init = function(t) {
    a.pending().success(function(t) {
      e.pendingApprovals = t
    }).error(function() {
      n.error()
    }), o.approved().success(function(t) {
      e.approved = t
    }).error(function() {
      n.error()
    }), o.declined().success(function(r) {
      e.declined = r, t && n.stop()
    }).error(function() {
      n.error()
    })
  }, e.init()
}]), adminModule.controller("departmentContentContainerController", ["$scope", "$filter", "$state", "$stateParams", "$mdDialog", "Preloader", "Member", "Position", "Department", "Report", "Performance", "Target", "User", "Project", function(e, t, r, o, a, n, l, i, s, c, d, u, p, m) {
  var f = o.departmentID;
  e.hideDateDiff = !0, m.department(f).success(function(t) {
    e.projects = t
  }), e.filterDate = {}, e.filterData = {}, e.filterDate.type = "Weekly", e.rightSidenav = {}, e.rightSidenav.show = !0, e.rightSidenav.items = [], e.rightSidenav.queryMember = function(r) {
    var o = r ? t("filter")(e.rightSidenav.items, r) : e.rightSidenav.items;
    return o
  }, l.department(f).success(function(t) {
    angular.forEach(t, function(t) {
      var r = {};
      r.full_name = t.full_name, e.rightSidenav.items.push(r)
    })
  }), i.department(f).success(function(t) {
    e.positions = t
  }), p.department(f).success(function(t) {
    e.users = t
  }), e.months = [{
    value: "01",
    month: "January"
  }, {
    value: "02",
    month: "February"
  }, {
    value: "03",
    month: "March"
  }, {
    value: "04",
    month: "April"
  }, {
    value: "05",
    month: "May"
  }, {
    value: "06",
    month: "June"
  }, {
    value: "07",
    month: "July"
  }, {
    value: "08",
    month: "August"
  }, {
    value: "09",
    month: "September"
  }, {
    value: "10",
    month: "October"
  }, {
    value: "11",
    month: "November"
  }, {
    value: "12",
    month: "December"
  }], e.months_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], e.years = [];
  for (var h = 2015, g = (new Date).getFullYear(); g >= h; g--) e.years.push(g);
  e.filterDate.date_start_month = e.months_array[(new Date).getMonth()], e.filterDate.date_start_year = e.years[0], e.getMondays = function() {
    e.filterDate.date_end = null, e.filterDate.date_start = null, e.filterDate.weekend = [], d.getMondays(e.filterDate).success(function(t) {
      e.mondays = t
    }).error(function() {
      n.error()
    })
  }, e.getWeekends = function() {
    e.filterDate.date_end = null, e.filterDate.weekend = [], d.getWeekends(e.filterDate).success(function(t) {
      e.weekends = t
    }).error(function() {
      n.error()
    })
  }, e.clearFilter = function() {
    e.rightSidenav.searchText = "", e.filterData.project = "", e.filterDate.date_start = "", e.filterDate.date_end = "", e.filterData.position = "", e.filterData.submitter = ""
  }, e.toolbar = {}, e.toolbar.parentState = "Weekly Report", e.toolbar.hideSearchIcon = !0, e.subheader = {}, e.subheader.show = !0, e.subheader.state = "department", e.subheader.refresh = function() {
    n.preload(), e.report.show = !1, e.init(!0)
  }, e.subheader.download = function() {
    a.show({
      controller: "downloadReportDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/download-report-dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.subheader.evaluate = function() {
    a.show({
      controller: "evaluateDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/evaluate-dialog.template.html",
      parent: angular.element(document.body)
    }).then(function(e) {
      n.set(e), e.department ? a.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: "/app/shared/templates/dialogs/performance-evaluation-multiple.dialog.template.html",
        parent: angular.element(document.body)
      }) : a.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: "/app/shared/templates/dialogs/performance-evaluation.dialog.template.html",
        parent: angular.element(document.body)
      })
    })
  }, e.searchUserInput = function() {
    e.report.show = !1, n.preload(), c.searchDepartment(f, e.filterDate).success(function(t) {
      e.report.results = t, angular.forEach(t, function(e) {
        b(e)
      }), n.stop()
    }).error(function(e) {
      n.error()
    })
  }, e.fab = {}, e.fab.show = !1, e.show = function(e) {
    n.set(e), a.show({
      controller: "otherPerformanceDialogController",
      templateUrl: "/app/shared/templates/dialogs/other-performance.dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.editReport = function(e) {
    r.go("main.edit-report", {
      reportID: e
    })
  }, e.deleteReport = function(t) {
    var r = a.confirm().title("Delete Report").content("Are you sure you want to delete this report?").ok("Delete").cancel("Cancel");
    a.show(r).then(function() {
      c["delete"](t).success(function() {
        e.subheader.refresh()
      })
    }, function() {})
  };
  
  //what is b?
  var b = function(e) {
    return e.date_start = new Date(e.date_start), e.date_end = new Date(e.date_end), e.project.beginner = [], e.project.moderately_experienced = [], e.project.experienced = [], e.project.quality = [], angular.forEach(e.project.positions, function(r) {
      var o = [],
        a = 0;
      if (angular.forEach(r.targets, function(t) {
          var r = new Date(t.created_at).setHours(0, 0, 0, 0);
          !t.deleted_at && r <= new Date(e.date_start) ? (o.splice(a, 0, t), a++) : t.deleted_at && r < e.date_start && (o.splice(a, 0, t), a++)
        }), o.length) 
		
		var n = t("filter")(o, {
          experience: "Beginner"
        }, !0),
        l = t("filter")(o, {
          experience: "Moderately Experienced"
        }, !0),
        i = t("filter")(o, {
          experience: "Experienced"
        }, !0),
        s = t("filter")(o, {
          experience: "Experienced"
        }, !0);
		
      else var n = t("filter")(r.targets, {
          experience: "Beginner",
          deleted_at: null
        }, !0),
        l = t("filter")(r.targets, {
          experience: "Moderately Experienced",
          deleted_at: null
        }, !0),
        i = t("filter")(r.targets, {
          experience: "Experienced",
          deleted_at: null
        }, !0),
        s = t("filter")(r.targets, {
          experience: "Experienced",
          deleted_at: null
        }, !0);
		
		
      e.project.beginner.push(n[0].productivity), e.project.moderately_experienced.push(l[0].productivity), e.project.experienced.push(i[0].productivity), e.project.quality.push(s[0].quality)
    }), e
  };
  
  e.init = function(t) {
    s.show(f).success(function(t) {
      e.toolbar.childState = t.name, e.projects = t.projects, angular.forEach(t.members, function(t) {
        var r = {};
        r.full_name = t.full_name, e.rightSidenav.items.push(r)
      })
    }), i.department(f).success(function(t) {
      e.positions = t
    }), e.getMondays(), e.report = {}, e.report.paginated = [], e.report.page = 2, c.paginateDepartmentDetails(f).success(function(r) {
      e.report.details = r, e.report.paginated = r.data, e.report.show = !0, r.data.length && angular.forEach(r.data, function(e) {
        b(e)
      }), e.report.paginateLoad = function() {
        e.report.busy || e.report.page > e.report.details.last_page || (e.report.busy = !0, c.paginateDepartmentDetails(f, e.report.page).success(function(t) {
          e.report.page++, angular.forEach(t.data, function(t) {
            b(t), e.report.paginated.push(t)
          }), e.report.busy = !1
        }).error(function() {
          n.error()
        }))
      }, t && (n.stop(), n.stop())
    }).error(function() {
      n.error()
    })
  }, e.init()
}]), adminModule.controller("departmentSettingsContentContainerController", ["$scope", "$state", "$mdDialog", "Preloader", "Department", function(e, t, r, o, a) {
  e.toolbar = {}, e.toolbar.parentState = "Settings", e.toolbar.childState = "Departments", e.subheader = {}, e.subheader.state = "settings", e.subheader.refresh = function() {
    o.preload(), e.init(!0)
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.searchText = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.setting.all.show = !1, o.preload(), a.search(e.toolbar).success(function(t) {
      e.setting.results = t, o.stop()
    }).error(function(e) {
      o.error()
    })
  }, e.show = function(e) {
    t.go("main.projects", {
      departmentID: e
    })
  }, e.fab = {}, e.fab.icon = "mdi-plus", e.fab.label = "Department", e.fab.show = !0, e.fab.action = function() {
    r.show({
      controller: "addDepartmentDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-department.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.init = function(t) {
    e.setting = {}, a.index().success(function(r) {
      angular.forEach(r, function(e) {
        e.first_letter = e.name.charAt(0).toUpperCase(), e.created_at = new Date(e.created_at)
      }), e.setting.all = r, e.setting.all.show = !0, t && (o.stop(), o.stop())
    })
  }, e.init()
}]), adminModule.controller("editReportContentContainerController", ["$scope", "$filter", "$mdDialog", "$state", "$mdToast", "$stateParams", "Preloader", "Performance", "Position", "Project", function(e, t, r, o, a, n, l, i, s, c) {
  var d = n.reportID,
    u = !1;
  e.form = {}, e.details = {}, e.toolbar = {}, e.toolbar.items = [], e.toolbar.getItems = function(r) {
    var o = r ? t("filter")(e.toolbar.items, r) : e.toolbar.items;
    return o
  }, e.toolbar.childState = "Edit Report", e.toolbar.showBack = !0, e.toolbar.back = function() {
    o.go("main.weekly-report", {
      departmentID: e.performances[0].department_id
    })
  }, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.subheader = {}, e.subheader.state = "report", e.deletePerformance = function(t) {
    var o = r.confirm().title("Delete performance").textContent("This performance will be deleted permanently. If you would just change something you can edit this instead.").ariaLabel("Delete performance").ok("Delete").cancel("Cancel");
    r.show(o).then(function() {
      l.preload();
      var r = e.performances.indexOf(t);
      i["delete"](t.id).success(function() {
        e.performances.splice(r, 1), l.stop()
      })
    }, function() {})
  };
  var p = function(e, t) {
    var r;
    return r = 12 * (t.getFullYear() - e.getFullYear()), r -= e.getMonth() + 1, r += t.getMonth(), 0 >= r ? 0 : r
  };
  i.report(d).success(function(r) {
    angular.forEach(r, function(r) {
      var o = t("filter")(r.member.experiences, {
        project_id: r.project_id
      }, !0);
      r.date_started = new Date(o[0].date_started);
      var a = p(r.date_started, new Date(r.date_start));
      r.experience = 3 > a ? "Beginner" : a >= 3 && 6 > a ? "Moderately Experienced" : "Experienced";
      var n = {};
      n.display = r.member.full_name, e.toolbar.items.push(n), r.first_letter = r.member.full_name.charAt(0).toUpperCase()
    }), e.performances = r, e.details.date_start = new Date(r[0].date_start), e.details.date_end = new Date(r[0].date_end), e.details.project_name = r[0].project.name, e.details.daily_work_hours = r[0].daily_work_hours, e.details.first_letter = r[0].project.name.charAt(0).toUpperCase(), e.details.weekly_hours = ((e.details.date_end - e.details.date_start) / 864e5 + 1) * e.details.daily_work_hours, e.details.date_start = e.details.date_start.toDateString(), e.details.date_end = e.details.date_end.toDateString(), c.show(r[0].project_id).success(function(r) {
      e.project = r, angular.forEach(r.positions, function(r) {
        var o = [],
          a = 0;
        if (angular.forEach(r.targets, function(t) {
            var r = new Date(t.effective_date).setHours(0, 0, 0, 0);
            !t.deleted_at && r <= new Date(e.details.date_start) ? (o.splice(a, 0, t), a++) : t.deleted_at && r < new Date(e.details.date_start) && (o.splice(a, 0, t), a++)
          }), o.length) {
          e["default"] = "false";
          var n = t("filter")(o, {
              experience: "Beginner"
            }, !0),
            l = t("filter")(o, {
              experience: "Moderately Experienced"
            }, !0),
            i = t("filter")(o, {
              experience: "Experienced"
            }, !0);
          t("filter")(o, {
            experience: "Experienced"
          }, !0)
        } else {
          e["default"] = "true";
          var n = t("filter")(r.targets, {
              experience: "Beginner",
              deleted_at: null
            }, !0),
            l = t("filter")(r.targets, {
              experience: "Moderately Experienced",
              deleted_at: null
            }, !0),
            i = t("filter")(r.targets, {
              experience: "Experienced",
              deleted_at: null
            }, !0);
          t("filter")(r.targets, {
            experience: "Experienced",
            deleted_at: null
          }, !0)
        }
        r.targets = [], r.targets.push(n[0]), r.targets.push(l[0]), r.targets.push(i[0])
      })
    }), c.department(r[0].department_id).success(function(t) {
      e.projects = t
    })
  }), e.checkAllPerformance = function() {
    angular.forEach(e.performances, function(t) {
      t.weekly_hours = e.details.weekly_hours, t.include ? (t.include = !1, e.checkLimitAll = !1) : (e.getTarget(t), t.include = !0, e.checkLimitAll = !0)
    }), e.checkLimitAll && i.checkLimitEditAll(e.performances).success(function(t) {
      e.performances = t
    })
  }, e.checkLimit = function(t) {
    var r = e.performances.indexOf(t);
    e.details.current_hours_worked = t.hours_worked, i.checkLimitEdit(e.performances[r].member_id, e.details).success(function(t) {
      e.performances[r].limit = t
    }).error(function() {
      e.performances[r].limit = e.details.weekly_hours
    }), e.getTarget(t)
  }, e.resetMembers = function() {
    angular.forEach(e.performances, function(t, r) {
      t.hours_worked = null, e.checkLimit(r)
    })
  }, e.getTarget = function(r) {
    var o = e.performances.indexOf(r),
      a = t("filter")(e.project.positions, {
        id: r.position_id
      }),
      n = t("filter")(a[0].targets, {
        experience: r.experience
      }, !0);
    e.performances[o].target_id = n[0].id
  }, e.checkBalance = function(t) {
    var r = e.performances.indexOf(t);
    e.performances[r].balance = e.performances[r].limit - e.performances[r].hours_worked, e.performances[r].balance = e.performances[r].balance ? e.performances[r].balance.toFixed(2) : 0
  }, e.fab = {}, e.fab.icon = "mdi-check", e.fab.label = "Submit", e.fab.show = !0, e.fab.action = function() {
    if (e.showErrors = !0, e.form.editReportForm.$invalid) angular.forEach(e.form.editReportForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }), r.show(r.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("Error").content("Please complete the forms or check the errors.").ariaLabel("Error").ok("Got it!"));
    else {
      u = !0;
      var t = 0;
      l.preload(), u && (angular.forEach(e.performances, function(r) {
        r.date_start = e.details.date_start, r.date_end = e.details.date_end, r.project_id = e.details.project_id, r.daily_work_hours = e.details.daily_work_hours, t = r.include ? t + 1 : t
      }), t ? i.update(d, e.performances).success(function() {
        a.show(a.simple().content("Changes Saved.").position("bottom right").hideDelay(3e3)), e.toolbar.back(), l.stop(), u = !1
      }).error(function() {
        l.error(), u = !1
      }) : r.show(r.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("Report not submitted.").content("Empty reports are not submitted.").ariaLabel("Empty Report").ok("Got it!")))
    }
  }
}]), adminModule.controller("leftSidenavController", ["$scope", "$mdSidenav", "Department", function(e, t, r) {
  e.menu = {}, e.menu.section = [{
    name: "Weekly Report"
  }, {
    name: "Settings"
  }], e.menu.settings = [{
    name: "Departments",
    state: "main.department-settings"
  }, {
    name: "User Accounts",
    state: "main.team-leaders"
  }, {
    name: "Work hours",
    state: "main.work-hours"
  }], r.index().success(function(t) {
    e.menu.departments = t
  }), e.setActive = function(e) {
    angular.element($('[aria-label="section-' + e + '"]').closest("li").toggleClass("active")), angular.element($('[aria-label="section-' + e + '"]').closest("li").siblings().removeClass("active"))
  }
}]), adminModule.controller("mainContentContainerController", ["$scope", "$state", "$stateParams", "$mdDialog", "Preloader", "Report", "User", "Target", "Programme", "Department", function(e, t, r, o, a, n, l, i, s, c) {
  e.report = {}, e.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var d = 2016;
  e.years = [];
  for (var u = (new Date).getFullYear(); u >= d; u--) e.years.push(u);
  s.index().success(function(t) {
    e.work_hours = t
  }), c.index().success(function(t) {
    e.departments = t
  }), e.report.month = e.months[(new Date).getMonth()], e.report.year = (new Date).getFullYear(), e.toolbar = {}, e.toolbar.childState = "Dashboard", e.toolbar.hideSearchIcon = !0, e.subheader = {}, e.subheader.show = !0, e.subheader.state = "dashboard", e.subheader.refresh = function() {
    e.searchMonthlyReport()
  }, e.subheader.download = function() {
    o.show({
      controller: "downloadReportDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/download-report-dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.subheader.evaluate = function() {
    o.show({
      controller: "evaluateDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/evaluate-dialog.template.html",
      parent: angular.element(document.body)
    }).then(function(e) {
      a.set(e), e.department ? o.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: "/app/shared/templates/dialogs/performance-evaluation-multiple.dialog.template.html",
        parent: angular.element(document.body)
      }) : o.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: "/app/shared/templates/dialogs/performance-evaluation.dialog.template.html",
        parent: angular.element(document.body)
      })
    })
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.report.show = !1
  }, e.fab = {}, e.fab.show = !1, e.form = {}, e.searchMonthlyReport = function() {
    return e.form.searchMonthlyForm.$invalid ? void angular.forEach(e.form.searchMonthlyForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (a.preload(), void n.searchMonthly(e.report).success(function(t) {
      angular.forEach(t, function(e) {
        e.count = 0, angular.forEach(e.positions, function(t) {
          t.head_count && (e.count += t.head_count)
        })
      }), e.reports = t, a.stop()
    }).error(function() {
      a.error()
    }))
  }, e.view = function(e, t, r) {
    e.date_start = t, e.date_end = r, a.set(e), o.show({
      controller: "performanceMonthlyViewDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/performance-monthly-view.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    })
  }
}]), adminModule.controller("positionsContentContainerController", ["$scope", "$state", "$stateParams", "$mdDialog", "Department", "Preloader", "Project", "Position", function(e, t, r, o, a, n, l, i) {
  var s = r.departmentID,
    c = r.projectID;
  e.position = {}, e.toolbar = {}, e.toolbar.showBack = !0, e.toolbar.back = function() {
    t.go("main.projects", {
      departmentID: s
    })
  }, a.show(s).success(function(t) {
    e.toolbar.parentState = t.name
  }), l.show(c).success(function(t) {
    e.toolbar.childState = t.name
  }), e.subheader = {}, e.subheader.state = "positions", e.subheader.refresh = function() {
    n.preload(), e.init(!0)
  }, e.fab = {}, e.fab.icon = "mdi-plus", e.fab.label = "Position", e.fab.show = !0, e.fab.action = function() {
    o.show({
      controller: "addPositionDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-position.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.searchText = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.project.show = !1, n.preload(), i.search(e.toolbar).success(function(t) {
      e.project.results = t, n.stop()
    }).error(function(e) {
      n.error()
    })
  }, e.viewProject = function(e) {
    t.go("main.positions", {
      departmentID: s,
      projectID: e
    })
  }, e.edit = function(t) {
    n.set(t), o.show({
      controller: "editPositionDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-position.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.init = function(t) {
    e.position = {}, i.project(c).success(function(r) {
      angular.forEach(r, function(e) {
        e.first_letter = e.name.charAt(0).toUpperCase(), e.created_at = new Date(e.created_at)
      }), e.position.all = r, e.position.show = !0, t && (n.stop(), n.stop())
    }).error(function() {
      n.error()
    })
  }, e.init()
}]), adminModule.controller("projectsContentContainerController", ["$scope", "$state", "$stateParams", "$mdDialog", "Department", "Preloader", "Project", function(e, t, r, o, a, n, l) {
  var i = r.departmentID;
  e.toolbar = {}, e.toolbar.showBack = !0, e.toolbar.back = function() {
    t.go("main.department-settings")
  }, a.show(i).success(function(t) {
    e.toolbar.parentState = t.name
  }), e.toolbar.childState = "Projects", e.subheader = {}, e.subheader.state = "projects", e.subheader.refresh = function() {
    n.preload(), e.init(!0)
  }, e.fab = {}, e.fab.icon = "mdi-plus", e.fab.label = "Project", e.fab.show = !0, e.fab.action = function() {
    o.show({
      controller: "addProjectDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-project.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.searchText = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.project.show = !1, n.preload(), l.search(e.toolbar).success(function(t) {
      e.project.results = t, n.stop()
    }).error(function(e) {
      n.error()
    })
  }, e.viewProject = function(e) {
    t.go("main.positions", {
      departmentID: i,
      projectID: e
    })
  }, e.viewTarget = function(e) {
    n.set(e), o.show({
      controller: "showTargetsDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/show-targets.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    })
  }, e.init = function(t) {
    e.project = {}, l.department(i).success(function(r) {
      angular.forEach(r, function(e) {
        e.first_letter = e.name.charAt(0).toUpperCase(), e.created_at = new Date(e.created_at)
      }), e.project.all = r, e.project.show = !0, t && (n.stop(), n.stop())
    }).error(function() {
      n.error()
    })
  }, e.init()
}]), adminModule.controller("teamLeaderContentContainerController", ["$scope", "$mdDialog", "Preloader", "User", function(e, t, r, o) {
  e.toolbar = {}, e.toolbar.parentState = "Settings", e.toolbar.childState = "User Accounts", e.subheader = {}, e.subheader.state = "settings", e.subheader.refresh = function() {
    r.preload(), e.init(!0)
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.searchText = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.setting.all.show = !1, r.preload(), o.search(e.toolbar).success(function(t) {
      e.setting.results = t, r.stop()
    }).error(function(e) {
      r.error()
    })
  }, e.show = function(e) {
    r.set(e), t.show({
      controller: "showMembersDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/show-members.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    })
  }, e.resetPassword = function(a) {
    var n = t.confirm().title("Reset Password").textContent('The password for this account will be "!welcome10"').ariaLabel("Reset Password").ok("Reset").cancel("Cancel");
    t.show(n).then(function() {
      o.resetPassword(a).success(function() {
        e.subheader.refresh()
      }).error(function() {
        r.error()
      })
    }, function() {})
  }, e.deleteAccount = function(a) {
    var n = t.confirm().title("Delete Account").textContent("This account will be removed permanently.").ariaLabel("Delete Account").ok("Delete").cancel("Cancel");
    t.show(n).then(function() {
      o["delete"](a).success(function() {
        e.subheader.refresh()
      }).error(function() {
        r.error()
      })
    }, function() {})
  }, e.fab = {}, e.fab.icon = "mdi-plus", e.fab.label = "Team Leader", e.fab.show = !0, e.fab.action = function() {
    t.show({
      controller: "addTeamLeaderDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-team-leader.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.init = function(t) {
    e.setting = {}, o.teamLeader().success(function(o) {
      angular.forEach(o, function(e) {
        e.first_letter = e.first_name.charAt(0).toUpperCase(), e.created_at = new Date(e.created_at)
      }), e.setting.all = o, e.setting.all.show = !0, t && (r.stop(), r.stop())
    })
  }, e.init()
}]), adminModule.controller("workHoursContentContainerController", ["$scope", "$mdDialog", "Programme", "Preloader", function(e, t, r, o) {
  e.toolbar = {}, e.toolbar.parentState = "Settings", e.toolbar.childState = "Work Hours", e.subheader = {}, e.subheader.state = "work-hours", e.subheader.refresh = function() {
    o.preload(), e.init(!0)
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.setting.all.show = !1, o.preload(), r.search(e.toolbar).success(function(t) {
      e.setting.results = t, o.stop()
    }).error(function(e) {
      o.error()
    })
  }, e.fab = {}, e.fab.icon = "mdi-plus", e.fab.label = "Work Hours", e.fab.show = !0, e.fab.action = function() {
    t.show({
      controller: "addWorkHoursDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-work-hours.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.edit = function(r) {
    o.set(r), t.show({
      controller: "editWorkHoursDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/add-work-hours.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e["delete"] = function(a) {
    var n = t.confirm().title("Delete Work Hour Scheme").content("Are you sure you want to delete this work hour scheme?").ariaLabel("Delete Work Hour Scheme").ok("Delete").cancel("Cancel");
    t.show(n).then(function() {
      r["delete"](a).success(function() {
        e.subheader.refresh()
      }).error(function() {
        o.error()
      })
    }, function() {})
  }, e.init = function(t) {
    e.setting = {}, r.index().success(function(r) {
      angular.forEach(r, function(e) {
        e.first_letter = e.label.charAt(0).toUpperCase(), e.created_at = new Date(e.created_at)
      }), e.setting.all = r, e.setting.all.show = !0, t && (o.stop(), o.stop())
    })
  }, e.init()
}]), adminModule.controller("addDepartmentDialogController", ["$scope", "$mdDialog", "Preloader", "Department", function(e, t, r, o) {
  e.department = {};
  var a = !1;
  e.checkDuplicate = function() {
    e.duplicate = !1, o.checkDuplicate(e.department).success(function(t) {
      e.duplicate = t
    })
  }, e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    e.addDepartmentForm.$invalid ? angular.forEach(e.addDepartmentForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : a || e.duplicate || (a = !0, o.store(e.department).success(function(t) {
      t ? (a = !1, e.duplicate = t) : (r.stop(), a = !1)
    }, function() {
      r.error()
    }))
  }
}]), adminModule.controller("addPositionDialogController", ["$scope", "$stateParams", "$mdDialog", "Preloader", "Project", "Position", "Target", function(e, t, r, o, a, n, l) {
  var i = t.departmentID,
    s = t.projectID,
    c = !1;
  e.position = {}, e.position.effective_date = new Date, e.position.department_id = i, e.position.project_id = s, e.experiences = [{
    experience: "Beginner"
  }, {
    experience: "Moderately Experienced"
  }, {
    experience: "Experienced"
  }], a.show(s).success(function(t) {
    e.project = t, e.label = t.name
  }), e.checkDuplicate = function() {
    e.duplicate = !1, n.checkDuplicate(e.position).success(function(t) {
      e.duplicate = t
    })
  }, e.cancel = function() {
    r.cancel()
  }, e.submit = function() {
    e.showErrors = !0, e.addPositionForm.$invalid ? angular.forEach(e.addPositionForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : c || e.duplicate || (c = !0, n.store(e.position).success(function(t) {
      "boolean" == typeof t ? (c = !1, e.duplicate = t) : (angular.forEach(e.experiences, function(e) {
        e.position_id = t.id, e.department_id = i, e.project_id = s
      }), l.store(e.experiences).success(function() {
        o.stop(), c = !1
      }).error(function() {
        o.error(), c = !1
      }))
    }).error(function() {
      o.error(), c = !1
    }))
  }
}]), adminModule.controller("addProjectDialogController", ["$scope", "$stateParams", "$mdDialog", "Preloader", "Department", "Project", function(e, t, r, o, a, n) {
  var l = t.departmentID,
    i = !1;
  e.project = {}, e.project.department_id = l, a.show(l).success(function(t) {
    e.department = t
  }), e.checkDuplicate = function() {
    e.duplicate = !1, n.checkDuplicate(e.project).success(function(t) {
      e.duplicate = t
    })
  }, e.cancel = function() {
    r.cancel()
  }, e.submit = function() {
    e.addProjectForm.$invalid ? angular.forEach(e.addProjectForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : i || (i = !0, n.store(e.project).success(function(t) {
      t ? (i = !1, e.duplicate = t) : (o.stop(), i = !1)
    }).error(function() {
      o.error(), i = !1
    }))
  }
}]), adminModule.controller("addTargetDialogController", ["$scope", "$mdDialog", "Preloader", "Target", function(e, t, r, o) {
  e.target = {};
  var a = !1;
  e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    e.addTargetForm.$invalid ? angular.forEach(e.addTargetForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (r.preload(), a || (a = !0, o.store(e.target).then(function() {
      r.stop(), a = !1
    }, function() {
      r.error(), a = !1
    })))
  }
}]), adminModule.controller("addTeamLeaderDialogController", ["$scope", "$mdDialog", "Preloader", "Department", "User", function(e, t, r, o, a) {
  e.user = {}, e.user.role = "team-leader";
  var n = !1;
  o.index().success(function(t) {
    e.departments = t
  }), e.cancel = function() {
    t.cancel()
  }, e.checkEmail = function() {
    e.duplicate = !1, a.checkEmail(e.user).success(function(t) {
      e.duplicate = t
    }).error(function() {
      r.error()
    })
  }, e.submit = function() {
    if (e.showErrors = !0, e.addTeamLeaderForm.$invalid) angular.forEach(e.addTeamLeaderForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    });
    else {
      if (e.user.password != e.user.password_confirmation || e.duplicate) return;
      n || e.duplicate || (n = !0, a.store(e.user).success(function(e) {
        e || (r.stop(), n = !1)
      }).error(function() {
        n = !1, r.error()
      }))
    }
  }
}]), adminModule.controller("addWorkHoursDialogController", ["$scope", "$mdDialog", "Preloader", "Programme", function(e, t, r, o) {
  e.programme = {};
  var a = !1;
  e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    e.addProgrammeForm.$invalid ? angular.forEach(e.addProgrammeForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (r.preload(), a || (a = !0, o.store(e.programme).success(function() {
      r.stop(), a = !1
    }, function() {
      r.error()
    })))
  }
}]), adminModule.controller("approvalsDialogController", ["$scope", "$mdDialog", "Approval", "PerformanceApproval", "Preloader", function(e, t, r, o, a) {
  var n = a.get();
  r.details(n).success(function(t) {
    e.details = t, e.show = !0
  }), e.markAll = function() {
    e.checkAll ? e.checkAll = !0 : e.checkAll = !1, angular.forEach(e.details.request, function(t, r) {
      t.include = !e.checkAll
    })
  }, e.cancel = function() {
    t.cancel()
  }, e.approve = function() {
    a.preload(), "update" == e.details.action ? r.approve(e.details.request).success(function() {
      a.stop()
    }).error(function() {
      a.error()
    }) : r.approveDelete(e.details).success(function() {
      a.stop()
    }).error(function() {
      a.error()
    })
  }, e.decline = function() {
    a.preload(), "update" == e.details.action ? r.decline(e.details.request).success(function() {
      a.stop()
    }).error(function() {
      a.error()
    }) : r.declineDelete(e.details).success(function() {
      a.stop()
    }).error(function() {
      a.error()
    })
  }
}]), adminModule.controller("approvedApprovalsDetailsDialogController", ["$scope", "$mdDialog", "Approval", "PerformanceApproval", "Preloader", function(e, t, r, o, a) {
  var n = a.get();
  o.approvedDetails(n).success(function(t) {
    e.details = t
  }), e.cancel = function() {
    t.cancel()
  }
}]), adminModule.controller("declinedApprovalsDetailsDialogController", ["$scope", "$mdDialog", "Approval", "PerformanceApproval", "Preloader", function(e, t, r, o, a) {
  var n = a.get();
  o.declinedDetails(n).success(function(t) {
    e.details = t
  }), e.cancel = function() {
    t.cancel()
  }
}]), adminModule.controller("downloadReportDialogController", ["$scope", "$mdDialog", "$filter", "Preloader", "Report", "Performance", "Project", "Experience", "Programme", "Department", "Member", "Position", function(e, t, r, o, a, n, l, i, s, c, d, u) {
  e.details = {}, e.details.type = "Weekly", e.details.date_start = new Date, e.details.date_end = new Date, e.maxDate = new Date, s.index().success(function(t) {
    e.work_hours = t, e.getMondays()
  }), c.index().success(function(t) {
    e.departments = t
  }), e.fetchProjects = function() {
    var t = e.details.department,
      o = r("filter")(e.departments, {
        id: t
      });
    e.projects = o[0].projects
  }, e.fetchMembers = function() {
    var t = e.details.project;
    "all" == e.details.project ? (u.unique(e.details.department).success(function(t) {
      e.positions = t
    }), d.department(e.details.department).success(function(t) {
      angular.forEach(t, function(e) {
        e.member_id = e.id
      }), e.members = t
    })) : (l.show(t).success(function(t) {
      e.positions = t.positions
    }), i.members(t).success(function(t) {
      angular.forEach(t, function(e) {
        e.full_name = e.member.full_name
      }), e.members = t
    }))
  }, e.months = [{
    value: "01",
    month: "January"
  }, {
    value: "02",
    month: "February"
  }, {
    value: "03",
    month: "March"
  }, {
    value: "04",
    month: "April"
  }, {
    value: "05",
    month: "May"
  }, {
    value: "06",
    month: "June"
  }, {
    value: "07",
    month: "July"
  }, {
    value: "08",
    month: "August"
  }, {
    value: "09",
    month: "September"
  }, {
    value: "10",
    month: "October"
  }, {
    value: "11",
    month: "November"
  }, {
    value: "12",
    month: "December"
  }], e.months_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], e.years = [];
  for (var p = 2016, m = (new Date).getFullYear(); m >= p; m--) e.years.push(m);
  e.details.date_start_month = e.months_array[(new Date).getMonth()], e.details.date_start_year = e.years[0], e.getMondays = function() {
    e.details.date_end = null, e.details.date_start = null, e.details.weekend = [], n.getMondays(e.details).success(function(t) {
      e.mondays = t
    }).error(function() {
      o.error()
    })
  }, e.getWeekends = function() {
    e.details.date_end = null, e.details.weekend = [], n.getWeekends(e.details).success(function(t) {
      e.weekends = t
    }).error(function() {
      o.error()
    })
  }, e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    if (e.downloadReportForm.$invalid) e.showErrors = !0, angular.forEach(e.downloadReportForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    });
    else {
      if ("Weekly" == e.details.type) {
        var o = window.open("/report-download-summary/" + r("date")(e.details.date_start, "yyyy-MM-dd") + "/to/" + r("date")(e.details.date_end, "yyyy-MM-dd") + "/daily-work-hours/" + e.details.daily_work_hours, "_blank");
        o.focus()
      } else if ("Monthly" == e.details.type) {
        var o = window.open("/report-download-monthly-department/" + e.details.department + "/month/" + e.details.month + "/year/" + e.details.year + "/daily-work-hours/" + e.details.daily_work_hours, "_blank");
        o.focus()
      } else if ("Team Performance" == e.details.type) {
        var o = window.open("/report-team-performance/" + e.details.month + "/year/" + e.details.year + "/daily-work-hours/" + e.details.daily_work_hours + "/download/1", "_blank");
        o.focus()
      } else if ("Performance Evaluation" == e.details.type) {
        if (e.details.date_start = e.details.date_start.toDateString(), e.details.date_end = e.details.date_end.toDateString(), "all" == e.details.project) var o = window.open("/performance-evaluation-multiple/" + e.details.date_start + "/date_end/" + e.details.date_end + "/daily-work-hours/" + e.details.daily_work_hours + "/department/" + e.details.department + "/position/" + e.details.position + /member/ + e.details.member + "/download/1", "_blank");
        else var o = window.open("/performance-evaluation/" + e.details.date_start + "/date_end/" + e.details.date_end + "/daily-work-hours/" + e.details.daily_work_hours + "/department/" + e.details.department + "/project/" + e.details.project + "/position/" + e.details.position + /member/ + e.details.member + "/download/1", "_blank");
        o.focus()
      }
      t.hide()
    }
  }
}]), adminModule.controller("editPositionDialogController", ["$scope", "$stateParams", "$mdDialog", "Preloader", "Project", "Position", "Target", function(e, t, r, o, a, n, l) {
  var i = (t.departmentID, t.projectID, o.get()),
    s = !1;
  n.show(i).success(function(t) {
    e.position = t, e.position.effective_date = new Date(t.targets[0].effective_date), e.label = t.project.name, e.experiences = t.targets
	
  }).error(function() {
    o.error()
  }), e.experiences = [{
    experience: "Beginner",
    duration: "less than 3 months"
  }, {
    experience: "Moderately Experienced",
    duration: "3 to 6 months"
  }, {
    experience: "Experienced",
    duration: "6 months and beyond"
  }], e.checkDuplicate = function() {
    e.duplicate = !1, n.checkDuplicate(e.position).success(function(t) {
      e.duplicate = t
    })
  }, e.cancel = function() {
    r.cancel()
  }, e.submit = function() {
    e.showErrors = !0, e.addPositionForm.$invalid ? angular.forEach(e.addPositionForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : s || e.duplicate || (angular.forEach(e.experiences, function(t) {
      t.effective_date = e.position.effective_date.toDateString()
    }), s = !0, n.update(i, e.position).success(function(t) {
      "boolean" == typeof t ? (s = !1, e.duplicate = t) : l.update(i, e.experiences).success(function() {
        s = !1, o.stop()
      }).error(function() {
        s = !1, o.error()
      })
    }).error(function() {
      o.error(), s = !1
    }))
  }
}]), adminModule.controller("editWorkHoursDialogController", ["$scope", "$mdDialog", "Preloader", "Programme", function(e, t, r, o) {
  var a = r.get();
  o.show(a).success(function(t) {
    e.programme = t
  }).error(function() {
    r.error()
  });
  var n = !1;
  e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    e.addProgrammeForm.$invalid ? angular.forEach(e.addProgrammeForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (r.preload(), n || (n = !0, o.update(a, e.programme).success(function() {
      r.stop(), n = !1
    }, function() {
      r.error()
    })))
  }
}]), adminModule.controller("evaluateDialogController", ["$scope", "$mdDialog", "$filter", "Preloader", "Report", "Performance", "Project", "Experience", "Programme", "Department", "Member", "Position", function(e, t, r, o, a, n, l, i, s, c, d, u) {
  e.details = {}, e.details.date_start = new Date, e.details.date_end = new Date, e.maxDate = new Date, s.index().success(function(t) {
    e.work_hours = t
  }), c.index().success(function(t) {
    e.departments = t
  }), e.fetchProjects = function() {
    var t = e.details.department,
      o = r("filter")(e.departments, {
        id: t
      });
    e.projects = o[0].projects
  }, e.fetchMembers = function() {
    var t = e.details.project;
    "all" == e.details.project ? (u.unique(e.details.department).success(function(t) {
      e.positions = t
    }), d.department(e.details.department).success(function(t) {
      angular.forEach(t, function(e) {
        e.member_id = e.id
      }), e.members = t
    })) : (l.show(t).success(function(t) {
      e.positions = t.positions
    }), i.members(t).success(function(t) {
      angular.forEach(t, function(e) {
        e.full_name = e.member.full_name
      }), e.members = t
    }))
  }, e.months = [{
    value: "01",
    month: "January"
  }, {
    value: "02",
    month: "February"
  }, {
    value: "03",
    month: "March"
  }, {
    value: "04",
    month: "April"
  }, {
    value: "05",
    month: "May"
  }, {
    value: "06",
    month: "June"
  }, {
    value: "07",
    month: "July"
  }, {
    value: "08",
    month: "August"
  }, {
    value: "09",
    month: "September"
  }, {
    value: "10",
    month: "October"
  }, {
    value: "11",
    month: "November"
  }, {
    value: "12",
    month: "December"
  }], e.months_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], e.years = [];
  for (var p = 2016, m = (new Date).getFullYear(); m >= p; m--) e.years.push(m);
  e.details.date_start_month = e.months_array[(new Date).getMonth()], e.details.date_start_year = e.years[0], e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    e.performanceEvaluationForm.$invalid ? (e.showErrors = !0, angular.forEach(e.performanceEvaluationForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    })) : (e.details.date_start = e.details.date_start.toDateString(), e.details.date_end = e.details.date_end.toDateString(), "all" == e.details.project ? n.evaluationMultiple(e.details.date_start, e.details.date_end, e.details.daily_work_hours, e.details.department, e.details.position, e.details.member).success(function(e) {
      o.stop(e)
    }).error(function() {
      o.error()
    }) : n.evaluation(e.details.date_start, e.details.date_end, e.details.daily_work_hours, e.details.department, e.details.project, e.details.position, e.details.member).success(function(e) {
      o.stop(e)
    }).error(function() {
      o.error()
    }))
  }
}]), adminModule.controller("performanceMonthlyViewDialogController", ["$scope", "$mdDialog", "Performance", "Preloader", function(e, t, r, o) {
  e.member = o.get(), r.monthly(e.member).success(function(t) {
    e.member = t, angular.forEach(t.positions, function(e) {
      angular.forEach(e.performances, function(e) {
        e.date_start = new Date(e.date_start), e.date_end = new Date(e.date_end)
      })
    }), e.positions = t.positions
  }).error(function() {
    o.error()
  }), e.cancel = function() {
    t.cancel()
  }
}]), adminModule.controller("showMembersDialogController", ["$scope", "$mdDialog", "Preloader", "User", "Member", function(e, t, r, o, a) {
  var n = r.get();
  e.cancel = function() {
    t.cancel()
  }, a.teamLeader(n).success(function(t) {
    e.members = t
  }), o.show(n).success(function(t) {
    e.user = t
  })
}]), adminModule.controller("showPositionDialogController", ["$scope", "$mdDialog", "Preloader", "Project", "Position", function(e, t, r, o, a) {
  var n = r.get();
  e.cancel = function() {
    t.cancel()
  }, e.add = function() {
    t.hide()
  }, e.showTargets = function(e) {
    t.hide(e)
  }, a.project(n).success(function(t) {
    e.positions = t
  }), o.show(n).success(function(t) {
    e.project = t
  })
}]), adminModule.controller("showProjectsDialogController", ["$scope", "$mdDialog", "Preloader", "Department", "Project", function(e, t, r, o, a) {
  var n = r.get();
  e.cancel = function() {
    t.cancel()
  }, e.add = function() {
    t.hide()
  }, e.showPositions = function(e) {
    t.hide(e)
  }, a.department(n).success(function(t) {
    e.projects = t
  }), o.show(n).success(function(t) {
    e.department = t
  })
}]), adminModule.controller("showTargetsDialogController", ["$scope", "$stateParams", "$mdDialog", "Preloader", "Target", "Position", function(e, t, r, o, a, n) {
  var l = o.get();
  e.cancel = function() {
    r.cancel()
  }, n.show(l).success(function(t) {
    e.position = t
  }), a.position(l).success(function(t) {
    e.targets = t
  })
}]), adminModule.controller("notificationToastController", ["$scope", "$state", "Preloader", function(e, t, r) {
  e.notification = r.getNotification(), e.viewNotification = function() {
    t.go(e.notification.state, {
      departmentID: e.notification.department_id
    })
  }
}]);
