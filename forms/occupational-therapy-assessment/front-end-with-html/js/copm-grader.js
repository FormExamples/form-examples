// COPM (Canadian Occupational Performance Measure) grader.
// Pure functions: calculate average performance and satisfaction scores
// (1-10) and their category labels from patient assessment data.
//
// COPM Scoring:
//   Average Performance Score (1-10):
//     < 5  = Significant issues
//     5-7  = Moderate concerns
//     > 7  = Good performance
//   Average Satisfaction Score (1-10):
//     < 5  = Significant issues
//     5-7  = Moderate concerns
//     > 7  = Good satisfaction

(function () {
  'use strict';

  const NS = window.OccupationalTherapyAssessment;

  /**
   * @param {object} data Assessment data
   * @returns {{performanceScore: number, satisfactionScore: number,
   *           performanceCategoryLabel: string, satisfactionCategoryLabel: string,
   *           firedRules: object[]}}
   */
  function calculateCOPM(data) {
    const firedRules = [];
    const perf = data.performanceRatings;
    const sat = data.satisfactionRatings;

    const performanceScores = [
      perf.activity1.performanceScore,
      perf.activity2.performanceScore,
      perf.activity3.performanceScore,
      perf.activity4.performanceScore,
      perf.activity5.performanceScore
    ];

    const satisfactionScores = [
      sat.activity1.satisfactionScore,
      sat.activity2.satisfactionScore,
      sat.activity3.satisfactionScore,
      sat.activity4.satisfactionScore,
      sat.activity5.satisfactionScore
    ];

    const perfNames = [
      perf.activity1.name, perf.activity2.name, perf.activity3.name,
      perf.activity4.name, perf.activity5.name
    ];
    const satNames = [
      sat.activity1.name, sat.activity2.name, sat.activity3.name,
      sat.activity4.name, sat.activity5.name
    ];

    const activities = NS.copmActivities;

    let perfTotal = 0;
    let perfCount = 0;
    for (let i = 0; i < performanceScores.length; i++) {
      const score = performanceScores[i];
      if (score !== null && score !== undefined && score !== '') {
        const numScore = Number(score);
        firedRules.push({
          id: activities[i].id,
          domain: 'Performance',
          description: perfNames[i] || activities[i].text,
          score: numScore
        });
        perfTotal += numScore;
        perfCount++;
      }
    }

    let satTotal = 0;
    let satCount = 0;
    for (let i = 0; i < satisfactionScores.length; i++) {
      const score = satisfactionScores[i];
      if (score !== null && score !== undefined && score !== '') {
        const numScore = Number(score);
        firedRules.push({
          id: `COPM-SAT-0${i + 1}`,
          domain: 'Satisfaction',
          description: satNames[i] || `Activity ${i + 1} satisfaction`,
          score: numScore
        });
        satTotal += numScore;
        satCount++;
      }
    }

    const performanceScore = perfCount > 0
      ? Math.round((perfTotal / perfCount) * 10) / 10
      : 0;
    const satisfactionScore = satCount > 0
      ? Math.round((satTotal / satCount) * 10) / 10
      : 0;

    const performanceCategoryLabel = NS.copmPerformanceCategory(performanceScore);
    const satisfactionCategoryLabel = NS.copmPerformanceCategory(satisfactionScore);

    return {
      performanceScore,
      satisfactionScore,
      performanceCategoryLabel,
      satisfactionCategoryLabel,
      firedRules
    };
  }

  window.OccupationalTherapyAssessment = window.OccupationalTherapyAssessment || {};
  Object.assign(window.OccupationalTherapyAssessment, {
    calculateCOPM
  });
})();
