var teamLeaderModule = angular.module("teamLeaderModule", ["sharedModule"]);
teamLeaderModule.config(["$stateProvider", function(e) {
  e.state("main", {
    url: "/",
    views: {
      "": {
        templateUrl: "/app/shared/views/main.view.html",
        controller: "mainViewController"
      },
      "toolbar@main": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "left-sidenav@main": {
        templateUrl: "/app/components/team-leader/templates/sidenavs/main-left.sidenav.html",
        controller: "leftSidenavController"
      },
      "content-container@main": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "mainMonthlyContentContainerController"
      },
      "content@main": {
        templateUrl: "/app/components/team-leader/templates/content/main-monthly.content.template.html"
      },
      "right-sidenav@main": {
        templateUrl: "/app/components/team-leader/templates/sidenavs/main-monthly-right.sidenav.html"
      }
    }
  }).state("main.weekly-report", {
    url: "weekly-report",
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "mainContentContainerController"
      },
      "toolbar@main.weekly-report": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.weekly-report": {
        templateUrl: "/app/shared/templates/main.content.template.html"
      },
      "right-sidenav@main.weekly-report": {
        templateUrl: "/app/components/team-leader/templates/sidenavs/main-right.sidenav.html"
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
  }).state("main.members", {
    url: "members",
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "membersContentContainerController"
      },
      "toolbar@main.members": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.members": {
        templateUrl: "/app/components/team-leader/templates/content/members.content.template.html"
      }
    }
  }).state("main.create-member", {
    url: "member/create",
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "createMemberContentContainerController"
      },
      "toolbar@main.create-member": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.create-member": {
        templateUrl: "/app/components/team-leader/templates/content/create-member-content.template.html"
      }
    }
  }).state("main.edit-member", {
    url: "member/{memberID}/edit",
    params: {
      memberID: null
    },
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "editMemberContentContainerController"
      },
      "toolbar@main.edit-member": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.edit-member": {
        templateUrl: "/app/components/team-leader/templates/content/edit-member-content.template.html"
      }
    }
  }).state("main.report", {
    url: "report",
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "reportContentContainerController"
      },
      "toolbar@main.report": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.report": {
        templateUrl: "/app/components/team-leader/templates/content/report.content.template.html"
      },
      "right-sidenav@main.report": {
        templateUrl: "/app/components/team-leader/templates/sidenavs/report-right.sidenav.html"
      }
    },
    onEnter: ["$state", "User", function(e, t) {
      t.index().success(function(t) {
        "manager" == t.role && e.go("page-not-found")
      })
    }]
  }).state("main.edit-report", {
    url: "edit-report/{reportID}",
    params: {
      reportID: null
    },
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "editReportContentContainerController"
      },
      "toolbar@main.edit-report": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.edit-report": {
        templateUrl: "/app/shared/templates/content/edit-report.content.template.html"
      }
    },
    onEnter: ["$state", "User", function(e, t) {
      t.index().success(function(t) {
        "manager" == t.role && e.go("page-not-found")
      })
    }]
  }).state("main.approvals", {
    url: "approvals",
    views: {
      "content-container": {
        templateUrl: "/app/components/team-leader/views/content-container.view.html",
        controller: "approvalsContentContainerController"
      },
      "toolbar@main.approvals": {
        templateUrl: "/app/components/team-leader/templates/toolbar.template.html"
      },
      "content@main.approvals": {
        templateUrl: "/app/shared/templates/content/approval.content.template.html"
      }
    },
    onEnter: ["$state", "User", function(e, t) {
      t.index().success(function(t) {
        "manager" == t.role && e.go("page-not-found")
      })
    }]
  })
}]), teamLeaderModule.controller("activityContentContainerController", ["$scope", "$mdDialog", "Activity", "Preloader", "User", function(e, t, r, a, o) {
  e.form = {}, e.activity = {}, e.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var n = 2016;
  e.years = [];
  for (var i = (new Date).getFullYear(); i >= n; i--) e.years.push(i);
  e.activity.month = e.months[(new Date).getMonth()], e.activity.year = (new Date).getFullYear(), e.toolbar = {}, e.toolbar.hideSearchIcon = !0, e.toolbar.childState = "Activities", e.subheader = {}, e.subheader.refresh = function() {
    a.preload(), e.init(!0)
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.searchUserInput = function() {
    e.report.show = !1
  }, e.showDetails = function(e) {
    a.set(e), t.show({
      controller: "reportDialogController",
      templateUrl: "/app/shared/templates/dialogs/report.dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.showHistory = function(e) {
    a.set(e), t.show({
      controller: "performanceHistoryDialogController",
      templateUrl: "/app/shared/templates/dialogs/performance-history.dialog.template.html",
      parent: angular.element(document.body)
    })
  };
  var l = function(e) {
    return e.created_at = new Date(e.created_at), e.first_letter = e.user.first_name.charAt(0).toUpperCase(), e
  };
  e.search = function() {
    a.preload(), r.reportSubmitted(e.activity).success(function(t) {
      angular.forEach(t, function(e) {
        l(e)
      }), e.submitted = t
    }).error(function() {
      a.error()
    }), r.reportUpdated(e.activity).success(function(t) {
      angular.forEach(t, function(e) {
        l(e)
      }), e.updated = t
    }).error(function() {
      a.error()
    }), r.reportDeleted(e.activity).success(function(t) {
      angular.forEach(t, function(e) {
        l(e)
      }), a.stop(), a.stop(), e.deleted = t
    }).error(function() {
      a.error()
    })
  }, e.init = function(t) {
    r.reportSubmitted().success(function(t) {
      angular.forEach(t, function(e) {
        l(e)
      }), e.submitted = t
    }).error(function() {
      a.error()
    }), r.reportUpdated().success(function(t) {
      angular.forEach(t, function(e) {
        l(e)
      }), e.updated = t
    }).error(function() {
      a.error()
    }), r.reportDeleted().success(function(t) {
      angular.forEach(t, function(e) {
        l(e)
      }), e.deleted = t
    }).error(function() {
      a.error()
    }), t && a.stop()
  }, e.init()
}]), teamLeaderModule.controller("approvalsContentContainerController", ["$scope", "$mdDialog", "PerformanceApproval", "Approval", "Preloader", "User", function(e, t, r, a, o, n) {
  e.form = {}, e.approval = {}, e.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var i = 2016;
  e.years = [];
  for (var l = (new Date).getFullYear(); l >= i; l--) e.years.push(l);
  e.approval.month = e.months[(new Date).getMonth()], e.approval.year = (new Date).getFullYear(), e.toolbar = {}, e.toolbar.hideSearchIcon = !0, e.toolbar.childState = "Approvals", e.subheader = {}, e.subheader.state = "approvals", e.subheader.refresh = function() {
    o.preload(), e.init(!0)
  }, e.showPending = function(r) {
    o.set(r), t.show({
      controller: "approvalsDialogController",
      templateUrl: "/app/components/team-leader/templates/dialogs/approval.dialog.template.html",
      parent: angular.element(document.body)
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.showApprovedDetails = function(r) {
    o.set(r), t.show({
      controller: "approvedApprovalsDetailsDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    }).then(function() {
      e.subheader.refresh()
    })
  }, e.showDeclinedDetails = function(r) {
    o.set(r), t.show({
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
  }, e.searchUserInput = function() {
    e.report.show = !1
  }, e.search = function() {
    o.preload(), a.pendingUser(e.approval).success(function(t) {
      e.pendingApprovals = t
    }).error(function() {
      o.error()
    }), r.approvedUser(e.approval).success(function(t) {
      e.approved = t
    }).error(function() {
      o.error()
    }), r.declinedUser(e.approval).success(function(t) {
      e.declined = t, o.stop()
    }).error(function() {
      o.error()
    })
  }, e.init = function(t) {
    a.pendingUser().success(function(t) {
      e.pendingApprovals = t
    }).error(function() {
      o.error()
    }), r.approvedUser().success(function(t) {
      e.approved = t
    }).error(function() {
      o.error()
    }), r.declinedUser().success(function(t) {
      e.declined = t
    }).error(function() {
      o.error()
    }), t && o.stop()
  }, e.init()
}]), teamLeaderModule.controller("createMemberContentContainerController", ["$scope", "$state", "Project", "Member", "Experience", "Preloader", function(e, t, r, a, o, n) {
  e.form = {}, e.member = {}, e.member_projects = [], e.maxDate = new Date, r.index().success(function(t) {
    e.projects = t, angular.forEach(t, function(t, r) {
      e.member_projects.push({})
    })
  }).error(function() {
    n.error()
  });
  var i = !1;
  e.toolbar = {}, e.toolbar.parentState = "Members", e.toolbar.childState = "Create", e.toolbar.showBack = !0, e.toolbar.back = function() {
    t.go("main.members")
  }, e.toolbar.hideSearchIcon = !0, e.fab = {}, e.fab.icon = "mdi-check", e.fab.label = "Submit", e.fab.show = !0, e.fab.action = function() {
    e.submit()
  }, e.checkDuplicate = function() {
    e.duplicate = !1, a.checkDuplicate(e.member).success(function(t) {
      e.duplicate = t
    }).error(function() {
      n.error()
    })
  }, e.submit = function() {
    e.form.memberForm.$invalid ? angular.forEach(e.form.memberForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : i || (i = !0, a.store(e.member).then(function(e) {
      return "boolean" == typeof e.data ? void(i = !1) : e.data
    }).then(function(r) {
      r && (angular.forEach(e.member_projects, function(e) {
        e.member_id = r, e.project && (e.date_started = e.date_started.toDateString())
      }), o.store(e.member_projects).success(function() {
        t.go("main.members")
      }).error(function() {
        i = !1, n.error()
      }))
    }, function() {
      i = !1, n.error()
    }))
  }
}]), teamLeaderModule.controller("editMemberContentContainerController", ["$scope", "$state", "$stateParams", "Project", "Member", "Experience", "Preloader", function(e, t, r, a, o, n, i) {
  var l = r.memberID;
  e.form = {}, e.member = {}, e.member_projects = [], e.maxDate = new Date;
  var s = !1;
  e.toolbar = {}, e.toolbar.parentState = "Edit", e.toolbar.showBack = !0, e.toolbar.back = function() {
    t.go("main.members")
  }, e.toolbar.hideSearchIcon = !0, e.fab = {}, e.fab.icon = "mdi-check", e.fab.label = "Submit", e.fab.show = !0, e.fab.action = function() {
    e.submit()
  }, e.checkDuplicate = function() {
    e.duplicate = !1, o.checkDuplicate(e.member).success(function(t) {
      e.duplicate = t
    }).error(function() {
      i.error()
    })
  }, e.submit = function() {
    e.form.memberForm.$invalid ? angular.forEach(e.form.memberForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : s || (s = !0, o.update(l, e.member).then(function(e) {
      return "boolean" == typeof e.data ? void(s = !1) : e.data
    }).then(function(r) {
      r && (angular.forEach(e.member_projects, function(e) {
        e.member_id = r, e.project && (e.date_started = e.date_started.toDateString())
      }), n.store(e.member_projects).success(function() {
        t.go("main.members")
      }).error(function() {
        s = !1, i.error()
      }))
    }, function() {
      s = !1, i.error()
    }))
  }, e.init = function() {
    a.index().success(function(t) {
      e.projects = t, angular.forEach(t, function(t, r) {
        e.member_projects.push({})
      }), o.show(l).success(function(t) {
        var r = 0;
        angular.forEach(e.projects, function(t, a) {
          n.relation(t.id, l).success(function(t) {
            t && (t.date_started = new Date(t.date_started), e.member_projects.splice(a, 1, t)), r++, r == e.projects.length && (e.show = !0)
          })
        }), e.toolbar.childState = t.full_name, e.member = t
      })
    })
  }()
}]), teamLeaderModule.controller("editReportContentContainerController", ["$scope", "$filter", "$mdDialog", "$state", "$mdToast", "$stateParams", "Preloader", "Performance", "Position", "Project", "PerformanceHistory", function(e, t, r, a, o, n, i, l, s, c, d) {
  var m = n.reportID,
    u = !1;
  e.form = {}, e.details = {}, e.toolbar = {}, e.toolbar.items = [], e.toolbar.getItems = function(r) {
    var a = r ? t("filter")(e.toolbar.items, r) : e.toolbar.items;
    return a
  }, e.toolbar.childState = "Edit Report", e.toolbar.showBack = !0, e.toolbar.back = function() {
    a.go("main.weekly-report")
  }, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.subheader = {}, e.subheader.state = "report", e.deletePerformance = function(t) {
    var a = r.confirm().title("Delete performance").textContent("This performance will be deleted permanently. If you would just change something you can edit this instead.").ariaLabel("Delete performance").ok("Delete").cancel("Cancel");
    r.show(a).then(function() {
      i.preload();
      var r = e.performances.indexOf(t);
      l["delete"](t.id).success(function() {
        e.performances.splice(r, 1), i.stop()
      })
    }, function() {})
  };
  var p = function(e, t) {
    var r;
    return r = 12 * (t.getFullYear() - e.getFullYear()), r -= e.getMonth() + 1, r += t.getMonth(), 0 >= r ? 0 : r
  };
  l.report(m).success(function(r) {
    angular.forEach(r, function(r) {
      var a = t("filter")(r.member.experiences, {
        project_id: r.project_id
      }, !0);
      r.date_started = new Date(a[0].date_started);
      var o = p(r.date_started, new Date(r.date_start));
      r.experience = 3 > o ? "Beginner" : o >= 3 && 6 > o ? "Moderately Experienced" : "Experienced";
      var n = {};
      n.display = r.member.full_name, e.toolbar.items.push(n), r.first_letter = r.member.full_name.charAt(0).toUpperCase()
    }), e.performances = r, e.details.date_start = new Date(r[0].date_start), e.details.date_end = new Date(r[0].date_end), e.details.project_name = r[0].project.name, e.details.daily_work_hours = r[0].daily_work_hours, e.details.first_letter = r[0].project.name.charAt(0).toUpperCase(), e.details.weekly_hours = ((e.details.date_end - e.details.date_start) / 864e5 + 1) * e.details.daily_work_hours, e.details.date_start = e.details.date_start.toDateString(), e.details.date_end = e.details.date_end.toDateString(), c.show(r[0].project_id).success(function(r) {
      e.project = r, angular.forEach(r.positions, function(r) {
        var a = [],
          o = 0;
        if (angular.forEach(r.targets, function(t) {
            var r = new Date(t.effective_date).setHours(0, 0, 0, 0);
            !t.deleted_at && r <= new Date(e.details.date_start) ? (a.splice(o, 0, t), o++) : t.deleted_at && r < new Date(e.details.date_start) && (a.splice(o, 0, t), o++)
          }), a.length) {
          e["default"] = "false";
          var n = t("filter")(a, {
              experience: "Beginner"
            }, !0),
            i = t("filter")(a, {
              experience: "Moderately Experienced"
            }, !0),
            l = t("filter")(a, {
              experience: "Experienced"
            }, !0);
          t("filter")(a, {
            experience: "Experienced"
          }, !0)
        } else {
          e["default"] = "true";
          var n = t("filter")(r.targets, {
              experience: "Beginner",
              deleted_at: null
            }, !0),
            i = t("filter")(r.targets, {
              experience: "Moderately Experienced",
              deleted_at: null
            }, !0),
            l = t("filter")(r.targets, {
              experience: "Experienced",
              deleted_at: null
            }, !0);
          t("filter")(r.targets, {
            experience: "Experienced",
            deleted_at: null
          }, !0)
        }
        r.targets = [], r.targets.push(n[0]), r.targets.push(i[0]), r.targets.push(l[0])
      })
    }), c.department(r[0].department_id).success(function(t) {
      e.projects = t
    })
  }).error(function() {
    a.go("page-not-found")
  }), e.checkAllPerformance = function() {
    angular.forEach(e.performances, function(t) {
      t.weekly_hours = e.details.weekly_hours, t.include ? (t.include = !1, e.checkLimitAll = !1, e.getTarget()) : (t.include = !0, e.checkLimitAll = !0), e.checkLimitAll && l.checkLimitEditAll(e.performances).success(function(t) {
        e.performances = t
      })
    })
  }, e.checkLimit = function(t) {
    var r = e.performances.indexOf(t);
    e.details.current_hours_worked = t.hours_worked, l.checkLimitEdit(e.performances[r].member_id, e.details).success(function(t) {
      e.performances[r].limit = t
    }).error(function() {
      e.performances[r].limit = e.details.weekly_hours
    }), e.getTarget(t)
  }, e.resetMembers = function() {
    angular.forEach(e.performances, function(t, r) {
      t.hours_worked = null, e.checkLimit(t)
    })
  }, e.getTarget = function(r) {
    var a = e.performances.indexOf(r),
      o = t("filter")(e.project.positions, {
        id: r.position_id
      }),
      n = t("filter")(o[0].targets, {
        experience: r.experience
      }, !0);
    e.performances[a].target_id = n[0].id
  }, e.checkBalance = function(t) {
    var r = e.performances.indexOf(t);
    e.performances[r].balance = e.performances[r].limit - e.performances[r].hours_worked, e.performances[r].balance = e.performances[r].balance ? e.performances[r].balance.toFixed(2) : 0
  }, e.fab = {}, e.fab.icon = "mdi-check", e.fab.label = "Submit", e.fab.show = !0, e.fab.action = function() {
    if (e.showErrors = !0, e.form.editReportForm.$invalid) angular.forEach(e.form.editReportForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }), r.show(r.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("Error").content("Please complete the forms or check the errors.").ariaLabel("Error").ok("Got it!"));
    else if (i.preload(), !u) {
      u = !0;
      var t = 0;
      angular.forEach(e.performances, function(r) {
        r.date_start = e.details.date_start, r.date_end = e.details.date_end, r.daily_work_hours = e.details.daily_work_hours, t = r.include ? t + 1 : t
      }), t ? d.store(e.performances).success(function() {
        l.update(m, e.performances).success(function() {
          o.show(o.simple().content("Changes saved.").position("bottom right").hideDelay(3e3)), e.toolbar.back(), i.stop(), u = !1
        }).error(function() {
          i.error()
        })
      }).error(function() {
        i.error(), u = !1
      }) : r.show(r.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("Report not submitted.").content("Empty reports are not submitted.").ariaLabel("Empty Report").ok("Got it!"))
    }
  }
}]), teamLeaderModule.controller("leftSidenavController", ["$scope", "$mdSidenav", "User", function(e, t, r) {
  e.menu = {}, r.index().success(function(t) {
    var r = t;
    "team-leader" == r.role ? e.menu.section = [{
      name: "Dashboard",
      state: "main",
      icon: "mdi-view-dashboard"
    }, {
      name: "Weekly Report",
      state: "main.weekly-report",
      icon: "mdi-view-carousel"
    }, {
      name: "Activities",
      state: "main.activity",
      icon: "mdi-file-document-box"
    }, {
      name: "Members",
      state: "main.members",
      icon: "mdi-account-multiple"
    }, {
      name: "Report",
      state: "main.report",
      icon: "mdi-file-document"
    }] : "manager" == r.role ? e.menu.section = [{
      name: "Dashboard",
      state: "main",
      icon: "mdi-view-dashboard"
    }, {
      name: "Weekly Report",
      state: "main.weekly-report",
      icon: "mdi-view-carousel"
    }, {
      name: "Members",
      state: "main.members",
      icon: "mdi-account-multiple"
    }] : e.menu.section = [{
      name: "Dashboard",
      state: "main",
      icon: "mdi-view-dashboard"
    }, {
      name: "Approvals",
      state: "main.approvals",
      icon: "mdi-file-document-box"
    }, {
      name: "Members",
      state: "main.members",
      icon: "mdi-account-multiple"
    }]
  }), e.setActive = function(e) {
    angular.element($('[aria-label="section-' + e + '"]').closest("li").toggleClass("active")), angular.element($('[aria-label="section-' + e + '"]').closest("li").siblings().removeClass("active"))
  }
}]), teamLeaderModule.controller("mainContentContainerController", ["$scope", "$filter", "$state", "$mdToast", "$mdDialog", "Approval", "Preloader", "Member", "Position", "Report", "Performance", "Target", "User", "WalkThrough", "Project", function(e, t, r, a, o, n, i, l, s, c, d, m, u, p, f) {
  e.filterDate = {}, e.filterData = {}, e.filterDate.type = "Weekly", e.rightSidenav = {}, e.rightSidenav.show = !0, e.rightSidenav.items = [], e.rightSidenav.queryMember = function(r) {
    var a = r ? t("filter")(e.rightSidenav.items, r) : e.rightSidenav.items;
    return a
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
  for (var h = 2016, b = (new Date).getFullYear(); b >= h; b--) e.years.push(b);
  e.filterDate.date_start_month = e.months_array[(new Date).getMonth()], e.filterDate.date_start_year = e.years[0], e.getMondays = function() {
    e.filterDate.date_end = null, e.filterDate.date_start = null, e.filterDate.weekend = [], d.getMondays(e.filterDate).success(function(t) {
      e.mondays = t
    }).error(function() {
      i.error()
    })
  }, e.getWeekends = function() {
    e.filterDate.date_end = null, e.filterDate.weekend = [], d.getWeekends(e.filterDate).success(function(t) {
      e.weekends = t
    }).error(function() {
      i.error()
    })
  }, e.getPositions = function() {
    s.project(e.projects[e.filterData.project].id).success(function(t) {
      e.positions = t
    })
  }, e.clearFilter = function() {
    e.rightSidenav.searchText = "", e.filterData.project = "", e.filterDate.date_start = "", e.filterDate.date_end = "", e.filterData.position = "", e.filterData.submitter = ""
  }, e.toolbar = {}, e.toolbar.childState = "Weekly Report", e.toolbar.hideSearchIcon = !0, e.subheader = {}, e.subheader.show = !0, e.subheader.state = "weekly", e.subheader.refresh = function() {
    e.report.show = !1, i.preload(), e.init(!0)
  }, e.subheader.download = function() {
    o.show({
      controller: "downloadReportDialogController",
      templateUrl: "/app/components/team-leader/templates/dialogs/download-report-dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.subheader.evaluate = function() {
    o.show({
      controller: "evaluateDialogController",
      templateUrl: "/app/components/team-leader/templates/dialogs/evaluate-dialog.template.html",
      parent: angular.element(document.body)
    }).then(function(e) {
      if (i.set(e), e.multiple) var t = "/app/shared/templates/dialogs/performance-evaluation-multiple.dialog.template.html";
      else var t = "/app/shared/templates/dialogs/performance-evaluation.dialog.template.html";
      o.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: t,
        parent: angular.element(document.body)
      })
    })
  }, e.searchUserInput = function() {
    e.report.show = !1, i.preload(), c.search(e.filterDate).success(function(t) {
      e.report.results = t, angular.forEach(t, function(e) {
        g(e)
      }), i.stop()
    }).error(function(e) {
      i.error()
    })
  }, e.show = function(e) {
    i.set(e), o.show({
      controller: "otherPerformanceDialogController",
      templateUrl: "/app/shared/templates/dialogs/other-performance.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    })
  }, e.fab = {}, e.fab.show = !1, e.editReport = function(e) {
    r.go("main.edit-report", {
      reportID: e
    })
  }, e.deleteReport = function(t) {
    var r = o.confirm().title("Delete report").content("This report will be deleted permanently.").ok("Delete").cancel("Cancel");
    o.show(r).then(function() {
      i.preload(), n.reportDelete(t).success(function() {
        c["delete"](t).success(function() {
          i.stop(), a.show(a.simple().content("Report deleted.").position("bottom right").hideDelay(3e3)), e.subheader.refresh()
        }).error(function() {
          i.error()
        })
      })
    }, function() {})
  };
  var g = function(e) {
    e.created_at = new Date(e.created_at), e.date_start = new Date(e.date_start), e.date_end = new Date(e.date_end);
    var r = new Date,
      a = Math.abs(r.getTime() - e.created_at.getTime());
    return e.diffDays = Math.ceil(a / 864e5), e.locked = e.diffDays > 7, e.project.beginner = [], e.project.moderately_experienced = [], e.project.experienced = [], e.project.quality = [], angular.forEach(e.project.positions, function(r) {
      var a = [],
        o = 0;
      if (angular.forEach(r.targets, function(t) {
          var r = new Date(t.created_at).setHours(0, 0, 0, 0);
          !t.deleted_at && r <= new Date(e.date_start) ? (a.splice(o, 0, t), o++) : t.deleted_at && r < e.date_start && (a.splice(o, 0, t), o++)
        }), a.length) var n = t("filter")(a, {
          experience: "Beginner"
        }, !0),
        i = t("filter")(a, {
          experience: "Moderately Experienced"
        }, !0),
        l = t("filter")(a, {
          experience: "Experienced"
        }, !0),
        s = t("filter")(a, {
          experience: "Experienced"
        }, !0);
      else var n = t("filter")(r.targets, {
          experience: "Beginner",
          deleted_at: null
        }, !0),
        i = t("filter")(r.targets, {
          experience: "Moderately Experienced",
          deleted_at: null
        }, !0),
        l = t("filter")(r.targets, {
          experience: "Experienced",
          deleted_at: null
        }, !0),
        s = t("filter")(r.targets, {
          experience: "Experienced",
          deleted_at: null
        }, !0);
      e.project.beginner.push(n[0].productivity), e.project.moderately_experienced.push(i[0].productivity), e.project.experienced.push(l[0].productivity), e.project.quality.push(s[0].quality)
    }), e
  };
  e.init = function(t) {
    l.index().success(function(t) {
      angular.forEach(t, function(t) {
        var r = {};
        r.full_name = t.full_name, e.rightSidenav.items.push(r)
      })
    }), u.department().success(function(t) {
      e.users = t
    }), s.index().success(function(t) {
      e.positions = t
    }), f.index().success(function(t) {
      e.projects = t
    }), e.getMondays(), e.report = {}, e.report.paginated = [], e.report.page = 2, c.paginateDetails().success(function(r) {
      e.report.details = r, e.report.paginated = r.data, e.report.show = !0, r.data.length && angular.forEach(r.data, function(e) {
        g(e)
      }), e.report.paginateLoad = function() {
        e.report.busy || e.report.page > e.report.details.last_page || (e.report.busy = !0, c.paginateDetails(e.report.page).success(function(t) {
          e.report.page++, angular.forEach(t.data, function(t) {
            g(t), e.report.paginated.push(t)
          }), e.report.busy = !1
        }).error(function() {
          i.error()
        }))
      }, t && (i.stop(), i.stop())
    }).error(function() {
      i.error()
    })
  }, e.init()
}]), teamLeaderModule.controller("mainMonthlyContentContainerController", ["$scope", "$filter", "$mdDialog", "Preloader", "Report", "Programme", "Member", function(e, t, r, a, o, n, i) {
  e.report = {}, e.form = {}, e.months_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], e.years = [];
  for (var l = 2016, s = (new Date).getFullYear(); s >= l; s--) e.years.push(s);
  e.rightSidenav = {}, e.rightSidenav.searchText = "", e.rightSidenav.show = !0, e.rightSidenav.month = e.months_array[(new Date).getMonth()], e.rightSidenav.year = (new Date).getFullYear(), e.rightSidenav.items = [], e.rightSidenav.queryMember = function(r) {
    var a = r ? t("filter")(e.rightSidenav.items, r) : e.rightSidenav.items;
    return a
  }, i.index().success(function(t) {
    angular.forEach(t, function(t) {
      var r = {};
      r.full_name = t.full_name, e.rightSidenav.items.push(r)
    })
  }), n.index().success(function(t) {
    e.hours = t
  }), e.clearFilter = function() {
    e.rightSidenav.searchText = "", e.rightSidenav.month = e.months_array[(new Date).getMonth()], e.rightSidenav.year = (new Date).getFullYear(), e.rightSidenav.daily_work_hours = ""
  }, e.toolbar = {}, e.toolbar.childState = "Dashboard", e.toolbar.hideSearchIcon = !0, e.subheader = {}, e.subheader.show = !0, e.subheader.state = "dashboard", e.subheader.refresh = function() {
    e.report = {}, a.preload(), e.init(!0, e.rightSidenav)
  }, e.subheader.download = function() {
    r.show({
      controller: "downloadReportDialogController",
      templateUrl: "/app/components/team-leader/templates/dialogs/download-report-dialog.template.html",
      parent: angular.element(document.body)
    })
  }, e.subheader.evaluate = function() {
    r.show({
      controller: "evaluateDialogController",
      templateUrl: "/app/components/team-leader/templates/dialogs/evaluate-dialog.template.html",
      parent: angular.element(document.body)
    }).then(function(e) {
      a.set(e), e.department ? r.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: "/app/shared/templates/dialogs/performance-evaluation-multiple.dialog.template.html",
        parent: angular.element(document.body)
      }) : r.show({
        controller: "performanceEvaluationDialogController",
        templateUrl: "/app/shared/templates/dialogs/performance-evaluation.dialog.template.html",
        parent: angular.element(document.body)
      })
    })
  }, e.searchFilter = function() {
    e.form.filterSearchForm.$invalid ? angular.forEach(e.form.filterSearchForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (a.preload(), e.init(!0, e.rightSidenav))
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.init = function(t, r) {
    o.searchMonthly(r).success(function(r) {
      angular.forEach(r, function(e) {
        e.count = 0, angular.forEach(e.positions, function(t) {
          t.head_count && (e.count += t.head_count)
        })
      }), e.reports = r, t && a.stop()
    }).error(function() {
      a.error()
    })
  }, e.view = function(e, t, o) {
    e.date_start = t, e.date_end = o, a.set(e), r.show({
      controller: "performanceMonthlyViewDialogController",
      templateUrl: "/app/components/admin/templates/dialogs/performance-monthly-view.dialog.template.html",
      parent: angular.element(document.body),
      clickOutsideToClose: !0
    })
  }
}]), teamLeaderModule.controller("membersContentContainerController", ["$scope", "$filter", "$state", "$mdDialog", "Preloader", "Member", "User", function(e, t, r, a, o, n, i) {
  e.toolbar = {}, e.toolbar.childState = "Members", e.toolbar.items = [], e.toolbar.getItems = function(r) {
    var a = r ? t("filter")(e.toolbar.items, r) : e.toolbar.items;
    return a
  }, e.subheader = {}, e.subheader.state = "members", e.subheader.refresh = function() {
    o.preload(), e.init(!0)
  }, e.fab = {}, e.fab.icon = "mdi-plus", e.fab.label = "Member", e.fab.action = function() {
    r.go("main.create-member")
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.searchText = "", e.searchBar = !1
  };
  var l = function(t) {
    return angular.forEach(t, function(t) {
      t.first_letter = t.full_name.charAt(0).toUpperCase(), angular.forEach(t.experiences, function(e) {
        e.date_started = new Date(e.date_started)
      });
      var r = {};
      r.display = t.full_name, e.toolbar.items.push(r)
    }), t
  };
  e.searchUserInput = function() {
    e.member.all.show = !1, o.preload(), n.search(e.toolbar).success(function(t) {
      l(t), e.member.results = t, o.stop()
    }).error(function(e) {
      o.error()
    })
  }, e.editMember = function(e) {
    r.go("main.edit-member", {
      memberID: e
    })
  }, e.deleteMember = function(t) {
    var r = a.confirm().title("Delete Member").content("This member will not be included to your report anymore.").ariaLabel("Delete Member").ok("Delete").cancel("Cancel");
    a.show(r).then(function() {
      n["delete"](t).success(function() {
        e.subheader.refresh()
      })
    }, function() {})
  }, e.init = function(t) {
    e.member = {}, i.index().then(function(r) {
      e.fab.show = "team-leader" == r.data.role, n.department().success(function(r) {
        l(r), e.member.all = r, e.member.all.show = !0, e.option = !0, t && (o.stop(), o.stop())
      }).error(function() {
        o.error()
      })
    }, function() {
      o.error()
    })
  }, e.init()
}]), teamLeaderModule.controller("notificationToastController", ["$scope", "$state", "Preloader", function(e, t, r) {
  e.notification = r.getNotification(), e.viewNotification = function() {
    t.go(e.notification.state)
  }
}]), teamLeaderModule.controller("reportContentContainerController", ["$scope", "$filter", "$state", "$mdDialog", "$mdToast", "Preloader", "Member", "Project", "Position", "Performance", "User", "Programme", "Experience", function(e, t, r, a, o, n, i, l, s, c, d, m, u) {
  var p = (n.getUser(), !1);
  e.form = {}, e.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], e.years = [];
  for (var f = 2016, h = (new Date).getFullYear(); h >= f; h--) e.years.push(h);
  e.details = {}, e.details.date_start_month = e.months[(new Date).getMonth()], e.details.date_start_year = e.years[0], e.getMondays = function() {
    e.details.date_end = null, e.details.date_start = null, e.details.weekend = [], c.getMondays(e.details).success(function(t) {
      e.mondays = t, e.show = !0
    }).error(function() {
      n.error()
    })
  }, e.getWeekends = function() {
    e.details.date_end = null, e.details.weekend = [], c.getWeekends(e.details).success(function(t) {
      e.weekends = t
    }).error(function() {
      n.error()
    })
  }, e.setDefaultPosition = function() {
    angular.forEach(e.members, function(t) {
      t.output || t.hours_worked || (t.position_id = e.details.position_id, e.getTarget(t))
    })
  }, e.showPositions = function(r) {
    e.toolbar.items = [], s.project(r).success(function(t) {
      e.positions = t
    }), u.members(r).success(function(t) {
      e.members = t, e.resetMembers()
    }), l.show(r).success(function(r) {
      e.project = r, angular.forEach(r.positions, function(r) {
        var a = [],
          o = 0;
        if (angular.forEach(r.targets, function(t) {
            var r = new Date(t.effective_date).setHours(0, 0, 0, 0);
            !t.deleted_at && r <= new Date(e.details.date_start) ? (a.splice(o, 0, t), o++) : t.deleted_at && r < new Date(e.details.date_start) && (a.splice(o, 0, t), o++)
          }), a.length) {
          e["default"] = "false";
          var n = t("filter")(a, {
              experience: "Beginner"
            }, !0),
            i = t("filter")(a, {
              experience: "Moderately Experienced"
            }, !0),
            l = t("filter")(a, {
              experience: "Experienced"
            }, !0);
          t("filter")(a, {
            experience: "Experienced"
          }, !0)
        } else {
          e["default"] = "true";
          var n = t("filter")(r.targets, {
              experience: "Beginner",
              deleted_at: null
            }, !0),
            i = t("filter")(r.targets, {
              experience: "Moderately Experienced",
              deleted_at: null
            }, !0),
            l = t("filter")(r.targets, {
              experience: "Experienced",
              deleted_at: null
            }, !0);
          t("filter")(r.targets, {
            experience: "Experienced",
            deleted_at: null
          }, !0)
        }
        r.targets = [], r.targets.push(n[0]), r.targets.push(i[0]), r.targets.push(l[0])
      })
    })
  }, e.toolbar = {}, e.toolbar.items = [], e.toolbar.getItems = function(r) {
    var a = r ? t("filter")(e.toolbar.items, r) : e.toolbar.items;
    return a
  }, e.toolbar.childState = "Report", e.subheader = {}, e.subheader.state = "report", e.subheader.refresh = function() {
    n.preload(), e.init(!0);
  }, e.searchBar = !1, e.showSearchBar = function() {
    e.searchBar = !0
  }, e.hideSearchBar = function() {
    e.toolbar.userInput = "", e.searchBar = !1
  }, e.rightSidenav = {}, e.rightSidenav.show = !0, e.fab = {}, e.fab.icon = "mdi-check", e.fab.label = "Submit", e.fab.show = !0, e.fab.action = function() {
    if (e.showErrors = !0, e.form.createReportForm.$invalid) angular.forEach(e.form.createReportForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }), a.show(a.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("Error").content("Please complete the forms or check the errors.").ariaLabel("Error").ok("Got it!"));
    else if (!p) {
      p = !0;
      var t = 0;
      angular.forEach(e.members, function(r) {
        r.date_start = e.details.date_start, r.date_end = e.details.date_end, r.project_id = e.details.project_id, r.daily_work_hours = e.details.daily_work_hours, t = r.include ? t + 1 : t
      }), t ? (n.preload(), c.store(e.members).success(function() {
        o.show(o.simple().content("Report Submitted.").position("bottom right").hideDelay(3e3)), n.stop(), r.go("main"), p = !1
      }).error(function() {
        n.error(), p = !1
      })) : a.show(a.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("Report not submitted.").content("Empty reports are not submitted.").ariaLabel("Empty Report").ok("Got it!"))
    }
  }, e.checkLimit = function(t) {
    var r = e.members.indexOf(t);
    c.checkLimit(e.members[r].member.id, e.details).success(function(t) {
      e.members[r].limit = t
    }).error(function() {
      e.members[r].limit = e.details.weekly_hours
    })
  }, e.resetMembers = function() {
    e.details.weekly_hours = ((new Date(e.details.date_end) - new Date(e.details.date_start)) / 864e5 + 1) * e.details.daily_work_hours, e.showMembers = !1, angular.forEach(e.members, function(t, r) {
      t.hours_worked = null, t.date_start = e.details.date_start, t.date_end = e.details.date_end, t.daily_work_hours = e.details.daily_work_hours, t.weekly_hours = e.details.weekly_hours
    }), c.checkLimitAll(e.members).success(function(t) {
      e.members = t, angular.forEach(e.members, function(t) {
        t.date_started = new Date(t.date_started), t.first_letter = t.member.full_name.charAt(0).toUpperCase(), t.output_error = 0;
        var r = {};
        r.display = t.member.full_name, e.toolbar.items.push(r), e.getTarget(t)
      }), e.showMembers = !0
    })
  }, e.checkBalance = function(t) {
    var r = e.members.indexOf(t);
    e.members[r].balance = e.members[r].limit - e.members[r].hours_worked, e.members[r].balance = e.members[r].balance ? e.members[r].balance.toFixed(2) : 0
  };
  var b = function(e, t) {
    var r;
    return r = 12 * (t.getFullYear() - e.getFullYear()), r -= e.getMonth() + 1, r += t.getMonth(), 0 >= r ? 0 : r
  };
  e.getTarget = function(r) {
    if (r.position_id) {
      var a = (e.members.indexOf(r), t("filter")(e.project.positions, {
          id: r.position_id
        })),
        o = b(new Date(r.date_started), new Date(e.details.date_start));
      r.experience = 3 > o ? "Beginner" : o >= 3 && 6 > o ? "Moderately Experienced" : "Experienced";
      var n = t("filter")(a[0].targets, {
        experience: r.experience
      }, !0);
      r.target_id = n[0].id
    }
  }, e.init = function(t) {
    i.updateTenure().then(function() {}).then(function() {
      l.index().success(function(t) {
        e.projects = t
      }).error(function() {
        n.error()
      })
    }).then(function() {
      m.index().success(function(t) {
        e.work_hours = t
      })
    }).then(function() {
      e.getMondays(), t && (n.stop(), n.stop())
    }, function() {
      n.error()
    })
  }, e.init()
}]), teamLeaderModule.controller("addMemberDialogController", ["$scope", "$mdDialog", "Preloader", "User", "Member", function(e, t, r, a, o) {
  var n = r.getUser(),
    i = !1;
  n || a.index().success(function(e) {
    n = e
  }), e.cancel = function() {
    t.cancel()
  }, e.member = {}, e.member.team_leader_id = n.id, e.submit = function() {
    e.showErrors = !0, e.addMemberForm.$invalid ? angular.forEach(e.addMemberForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (r.preload(), console.log(i), i || (i = !0, o.store(e.member).then(function() {
      r.stop(), i = !1
    }, function() {
      r.error(), i = !1
    })))
  }
}]), teamLeaderModule.controller("approvalsDialogController", ["$scope", "$mdDialog", "Approval", "PerformanceApproval", "Preloader", function(e, t, r, a, o) {
  var n = o.get();
  e.user = o.getUser(), r.details(n).success(function(t) {
    e.details = t
  }), e.markAll = function() {
    e.checkAll ? e.checkAll = !0 : e.checkAll = !1, angular.forEach(e.details.request, function(t, r) {
      t.include = !e.checkAll
    })
  }, e.cancel = function() {
    t.cancel()
  }, e.cancelRequest = function() {
    o.preload(), r["delete"](n).success(function() {
      o.stop()
    }).error(function() {
      o.error()
    })
  }
}]), teamLeaderModule.controller("approvedApprovalsDetailsDialogController", ["$scope", "$mdDialog", "Approval", "PerformanceApproval", "Preloader", function(e, t, r, a, o) {
  var n = o.get();
  a.approvedDetails(n).success(function(t) {
    e.details = t
  }), e.cancel = function() {
    t.cancel()
  }
}]), teamLeaderModule.controller("declinedApprovalsDetailsDialogController", ["$scope", "$mdDialog", "Approval", "PerformanceApproval", "Preloader", function(e, t, r, a, o) {
  var n = o.get();
  a.declinedDetails(n).success(function(t) {
    e.details = t
  }), e.cancel = function() {
    t.cancel()
  }
}]), teamLeaderModule.controller("downloadReportDialogController", ["$scope", "$mdDialog", "$filter", "Preloader", "Report", "Performance", "Programme", "Project", "Position", "Member", "Experience", function(e, t, r, a, o, n, i, l, s, c, d) {
  e.details = {}, e.details.type = "Weekly", e.details.date_start = new Date, e.details.date_end = new Date, e.maxDate = new Date;
  var m = a.getUser();
  m || User.index().success(function(e) {
    m = e
  }).error(function() {
    a.error()
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
  for (var u = 2016, p = (new Date).getFullYear(); p >= u; p--) e.years.push(p);
  e.details.date_start_month = e.months_array[(new Date).getMonth()], e.details.date_start_year = e.years[0], e.getMondays = function() {
    e.details.date_end = null, e.details.date_start = null, e.details.weekend = [], n.getMondays(e.details).success(function(t) {
      e.mondays = t
    }).error(function() {
      a.error()
    })
  }, e.getWeekends = function() {
    e.details.date_end = null, e.details.weekend = [], n.getWeekends(e.details).success(function(t) {
      e.weekends = t
    }).error(function() {
      a.error()
    })
  }, e.fetchMembers = function() {
    var t = e.details.project;
    "all" == e.details.project ? s.unique().success(function(t) {
      e.positions = t
    }) : l.show(t).success(function(t) {
      e.positions = t.positions
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
        var a = window.open("/report-download-weekly-department/" + m.department_id + "/date_start/" + r("date")(e.details.date_start, "yyyy-MM-dd") + "/to/" + r("date")(e.details.date_end, "yyyy-MM-dd") + "/daily-work-hours/" + e.details.daily_work_hours, "_blank");
        a.focus()
      } else if ("Monthly" == e.details.type) {
        var a = window.open("/report-download-monthly-department/" + m.department_id + "/month/" + e.details.month + "/year/" + e.details.year + "/daily-work-hours/" + e.details.daily_work_hours, "_blank");
        a.focus()
      } else if ("Team Performance" == e.details.type) {
        var a = window.open("/report-team-performance/" + e.details.month + "/year/" + e.details.year + "/daily-work-hours/" + e.details.daily_work_hours + "/download/1", "_blank");
        a.focus()
      } else if ("Performance Evaluation" == e.details.type) {
        if (e.details.date_start = e.details.date_start.toDateString(), e.details.date_end = e.details.date_end.toDateString(), "all" == e.details.project) var a = window.open("/performance-evaluation-multiple/" + e.details.date_start + "/date_end/" + e.details.date_end + "/daily-work-hours/" + e.details.daily_work_hours + "/department/" + e.details.department + "/position/" + e.details.position + /member/ + e.details.member + "/download/1", "_blank");
        else var a = window.open("/performance-evaluation/" + e.details.date_start + "/date_end/" + e.details.date_end + "/daily-work-hours/" + e.details.daily_work_hours + "/department/" + e.details.department + "/project/" + e.details.project + "/position/" + e.details.position + /member/ + e.details.member + "/download/1", "_blank");
        a.focus()
      }
      t.hide()
    }
  }, e.init = function() {
    l.index().success(function(t) {
      e.projects = t
    }), i.index().success(function(t) {
      e.work_hours = t, e.getMondays()
    }).error(function() {
      a.error()
    }), c.index().success(function(t) {
      angular.forEach(t, function(e) {
        e.member_id = e.id
      }), e.members = t
    })
  }(), e.getPositions = function() {
    l.show(e.details.project).success(function(t) {
      e.positions = t.positions
    })
  }
}]), teamLeaderModule.controller("editMemberDialogController", ["$scope", "$mdDialog", "Preloader", "Member", function(e, t, r, a) {
  var o = r.get(),
    n = !1;
  e.cancel = function() {
    t.cancel()
  }, a.show(o).success(function(t) {
    e.member = t
  }), e.submit = function() {
    e.showErrors = !0, e.editMemberForm.$invalid ? angular.forEach(e.editMemberForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    }) : (r.preload(), n || (n = !0, a.update(o, e.member).then(function() {
      r.stop(), n = !1
    }, function() {
      r.error(), n = !1
    })))
  }
}]), teamLeaderModule.controller("evaluateDialogController", ["$scope", "$mdDialog", "$filter", "Preloader", "Report", "Performance", "Project", "Experience", "Programme", "Department", "Member", "Position", function(e, t, r, a, o, n, i, l, s, c, d, m) {
  e.details = {}, e.details.date_start = new Date, e.details.date_end = new Date, e.maxDate = new Date, i.index().success(function(t) {
    e.projects = t
  }), s.index().success(function(t) {
    e.work_hours = t
  }).error(function() {
    a.error()
  }), d.index().success(function(t) {
    e.members = t
  }), e.getPositions = function() {
    "all" == e.details.project ? m.unique().success(function(t) {
      e.positions = t
    }) : i.show(e.details.project).success(function(t) {
      e.positions = t.positions
    })
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
  for (var u = 2016, p = (new Date).getFullYear(); p >= u; p--) e.years.push(p);
  e.details.date_start_month = e.months_array[(new Date).getMonth()], e.details.date_start_year = e.years[0], e.cancel = function() {
    t.cancel()
  }, e.submit = function() {
    e.performanceEvaluationForm.$invalid ? (e.showErrors = !0, angular.forEach(e.performanceEvaluationForm.$error, function(e) {
      angular.forEach(e, function(e) {
        e.$setTouched()
      })
    })) : (e.details.date_start = e.details.date_start.toDateString(), e.details.date_end = e.details.date_end.toDateString(), "all" == e.details.project ? n.evaluationMultiple(e.details.date_start, e.details.date_end, e.details.daily_work_hours, e.details.department, e.details.position, e.details.member).success(function(e) {
      e.multiple = !0, a.stop(e)
    }).error(function() {
      a.error()
    }) : n.evaluation(e.details.date_start, e.details.date_end, e.details.daily_work_hours, e.details.department, e.details.project, e.details.position, e.details.member).success(function(e) {
      a.stop(e)
    }).error(function() {
      a.error()
    }))
  }
}]), teamLeaderModule.controller("performanceMonthlyViewDialogController", ["$scope", "$mdDialog", "Performance", "Preloader", function(e, t, r, a) {
  e.member = a.get(), r.monthly(e.member).success(function(t) {
    e.member = t, angular.forEach(t.positions, function(e) {
      angular.forEach(e.performances, function(e) {
        e.date_start = new Date(e.date_start), e.date_end = new Date(e.date_end)
      })
    }), e.positions = t.positions
  }).error(function() {
    a.error()
  }), e.cancel = function() {
    t.cancel()
  }
}]);
