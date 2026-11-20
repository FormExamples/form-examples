  
  const API_BASE = '/api/agile-principles-assessment/assessments';

  export const fetchAssessments = function () {
    return fetch(API_BASE)
      .then(function (res) {
        if (!res.ok) throw new Error('API ' + res.status);
        return res.json();
      })
      .catch(function () { return NS.SAMPLE_ASSESSMENTS; });
  };
