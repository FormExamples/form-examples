(function () {
  'use strict';
  const NS = (window.AgileChecklistDashboard = window.AgileChecklistDashboard || {});

  NS.SAMPLE_CHECKLISTS = [
    { id: 'C001', date: '2025-07-15', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 57, teamsPercent: 72, stakeholdersPercent: 64, practicesPercent: 56, overallPercent: 64, maturity: 'developing', weakSections: ['Practices'], flags: ['finished-work-risk'] },
    { id: 'C002', date: '2025-10-15', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 57, teamsPercent: 80, stakeholdersPercent: 71, practicesPercent: 67, overallPercent: 73, maturity: 'developing', weakSections: [], flags: [] },
    { id: 'C003', date: '2026-01-15', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 57, teamsPercent: 88, stakeholdersPercent: 79, practicesPercent: 78, overallPercent: 82, maturity: 'mature', weakSections: [], flags: [] },
    { id: 'C004', date: '2026-04-12', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 57, teamsPercent: 96, stakeholdersPercent: 86, practicesPercent: 89, overallPercent: 90, maturity: 'optimising', weakSections: [], flags: [] },

    { id: 'C005', date: '2025-10-13', respondent: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', answered: 57, teamsPercent: 80, stakeholdersPercent: 79, practicesPercent: 72, overallPercent: 77, maturity: 'mature', weakSections: [], flags: [] },
    { id: 'C006', date: '2026-01-13', respondent: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', answered: 57, teamsPercent: 80, stakeholdersPercent: 79, practicesPercent: 72, overallPercent: 77, maturity: 'mature', weakSections: [], flags: [] },
    { id: 'C007', date: '2026-04-13', respondent: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', answered: 57, teamsPercent: 84, stakeholdersPercent: 79, practicesPercent: 72, overallPercent: 78, maturity: 'mature', weakSections: [], flags: [] },

    { id: 'C008', date: '2025-10-15', respondent: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', answered: 57, teamsPercent: 84, stakeholdersPercent: 71, practicesPercent: 78, overallPercent: 78, maturity: 'mature', weakSections: [], flags: [] },
    { id: 'C009', date: '2026-01-15', respondent: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', answered: 57, teamsPercent: 76, stakeholdersPercent: 57, practicesPercent: 67, overallPercent: 67, maturity: 'developing', weakSections: [], flags: [] },
    { id: 'C010', date: '2026-04-15', respondent: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', answered: 57, teamsPercent: 68, stakeholdersPercent: 43, practicesPercent: 50, overallPercent: 54, maturity: 'developing', weakSections: ['Stakeholders'], flags: ['stakeholders-trust-risk'] },

    { id: 'C011', date: '2026-01-16', respondent: 'Dana Patel', role: 'agile-coach', team: 'Draco', organisation: 'Acme Engineering', answered: 57, teamsPercent: 60, stakeholdersPercent: 29, practicesPercent: 44, overallPercent: 44, maturity: 'initial', weakSections: ['Stakeholders', 'Practices'], flags: ['stakeholders-trust-risk', 'practices-discipline-risk', 'experimentation-blocked'] },
    { id: 'C012', date: '2026-04-16', respondent: 'Dana Patel', role: 'agile-coach', team: 'Draco', organisation: 'Acme Engineering', answered: 57, teamsPercent: 52, stakeholdersPercent: 21, practicesPercent: 39, overallPercent: 37, maturity: 'initial', weakSections: ['Stakeholders', 'Practices'], flags: ['stakeholders-trust-risk', 'practices-discipline-risk', 'experimentation-blocked', 'psychological-safety-risk'] },

    { id: 'C013', date: '2026-04-17', respondent: 'Eli Singh', role: 'team-member', team: 'Eridanus', organisation: 'Acme Engineering', answered: 57, teamsPercent: 32, stakeholdersPercent: 14, practicesPercent: 22, overallPercent: 23, maturity: 'ad-hoc', weakSections: ['Teams', 'Stakeholders', 'Practices'], flags: ['teams-autonomy-risk', 'stakeholders-trust-risk', 'practices-discipline-risk', 'finished-work-risk', 'experimentation-blocked', 'psychological-safety-risk'] },
    { id: 'C013b', date: '2026-04-19', respondent: 'Anonymous', role: '', team: 'Eridanus', organisation: 'Acme Engineering', answered: 57, teamsPercent: 36, stakeholdersPercent: 21, practicesPercent: 28, overallPercent: 28, maturity: 'initial', weakSections: ['Teams', 'Stakeholders', 'Practices'], flags: ['teams-autonomy-risk', 'psychological-safety-risk'], isAnonymous: true },

    { id: 'C014', date: '2026-04-18', respondent: 'Farah Lopez', role: 'team-lead', team: 'Fornax', organisation: 'Acme Engineering', answered: 18, teamsPercent: 75, stakeholdersPercent: null, practicesPercent: null, overallPercent: null, maturity: 'insufficient-data', weakSections: [], flags: ['insufficient-data'] },
  ];
})();
