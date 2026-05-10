(function () {
  'use strict';
  const NS = (window.AgilePrinciplesDashboard = window.AgilePrinciplesDashboard || {});
  const API_BASE = '/api/assessments';

  NS.fetchAssessments = function () {
    return fetch(API_BASE)
      .then(function (res) {
        if (!res.ok) throw new Error('API ' + res.status);
        return res.json();
      })
      .catch(function () { return NS.SAMPLE_ASSESSMENTS; });
  };
})();
