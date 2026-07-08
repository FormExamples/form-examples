// Sample team / department aggregates for the occupational health
// dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every overall risk band (Low / Moderate /
// High / Very High), every worst-domain category, and a mix of tenure
// bands and response counts (8-50 employees per aggregate).
//
// All entries are anonymous, group-level aggregates only — there are no
// individual employee identifiers anywhere in this dataset.

(function () {
'use strict';
window.WorkplaceStressAssessmentDashboard =
  window.WorkplaceStressAssessmentDashboard || {};

/** @type {import('./types.js').TeamRow[]} */
const sampleTeams = [
  {
    id: '1',
    department: 'Emergency Department',
    responsesCount: 42,
    tenureBand: 'Mixed',
    domainMeans: {
      demands: 1.9,
      control: 2.4,
      managerSupport: 2.6,
      peerSupport: 3.1,
      relationships: 2.8,
      role: 3.4,
      change: 2.2
    },
    overallRisk: 'Very High',
    worstDomain: 'Demands'
  },
  {
    id: '2',
    department: 'Intensive Care Unit',
    responsesCount: 28,
    tenureBand: '3-5 years',
    domainMeans: {
      demands: 2.1,
      control: 2.8,
      managerSupport: 3.0,
      peerSupport: 3.6,
      relationships: 3.2,
      role: 3.8,
      change: 2.5
    },
    overallRisk: 'Very High',
    worstDomain: 'Demands'
  },
  {
    id: '3',
    department: 'Operating Theatres',
    responsesCount: 35,
    tenureBand: '5-10 years',
    domainMeans: {
      demands: 2.4,
      control: 2.5,
      managerSupport: 2.7,
      peerSupport: 3.4,
      relationships: 3.0,
      role: 3.6,
      change: 2.8
    },
    overallRisk: 'High',
    worstDomain: 'Control'
  },
  {
    id: '4',
    department: 'Mental Health Inpatient',
    responsesCount: 21,
    tenureBand: '1-3 years',
    domainMeans: {
      demands: 2.6,
      control: 2.9,
      managerSupport: 2.3,
      peerSupport: 3.2,
      relationships: 2.7,
      role: 3.5,
      change: 2.6
    },
    overallRisk: 'High',
    worstDomain: 'Manager Support'
  },
  {
    id: '5',
    department: 'Community Nursing',
    responsesCount: 18,
    tenureBand: '5-10 years',
    domainMeans: {
      demands: 2.7,
      control: 3.4,
      managerSupport: 3.2,
      peerSupport: 2.5,
      relationships: 3.1,
      role: 3.7,
      change: 2.9
    },
    overallRisk: 'High',
    worstDomain: 'Peer Support'
  },
  {
    id: '6',
    department: 'Radiology',
    responsesCount: 24,
    tenureBand: '3-5 years',
    domainMeans: {
      demands: 3.1,
      control: 3.3,
      managerSupport: 3.4,
      peerSupport: 3.5,
      relationships: 2.6,
      role: 3.6,
      change: 3.0
    },
    overallRisk: 'Moderate',
    worstDomain: 'Relationships'
  },
  {
    id: '7',
    department: 'Pharmacy',
    responsesCount: 16,
    tenureBand: 'Mixed',
    domainMeans: {
      demands: 3.0,
      control: 3.5,
      managerSupport: 3.2,
      peerSupport: 3.8,
      relationships: 3.4,
      role: 2.7,
      change: 2.9
    },
    overallRisk: 'Moderate',
    worstDomain: 'Role'
  },
  {
    id: '8',
    department: 'Estates and Facilities',
    responsesCount: 30,
    tenureBand: '10+ years',
    domainMeans: {
      demands: 3.2,
      control: 3.0,
      managerSupport: 3.3,
      peerSupport: 3.5,
      relationships: 3.4,
      role: 3.6,
      change: 2.4
    },
    overallRisk: 'Moderate',
    worstDomain: 'Change'
  },
  {
    id: '9',
    department: 'Finance and Procurement',
    responsesCount: 12,
    tenureBand: '5-10 years',
    domainMeans: {
      demands: 3.6,
      control: 3.8,
      managerSupport: 3.7,
      peerSupport: 3.9,
      relationships: 3.8,
      role: 4.0,
      change: 3.4
    },
    overallRisk: 'Low',
    worstDomain: 'Change'
  },
  {
    id: '10',
    department: 'Information Technology',
    responsesCount: 22,
    tenureBand: '1-3 years',
    domainMeans: {
      demands: 3.5,
      control: 4.1,
      managerSupport: 3.9,
      peerSupport: 4.0,
      relationships: 3.9,
      role: 4.2,
      change: 3.6
    },
    overallRisk: 'Low',
    worstDomain: 'Demands'
  },
  {
    id: '11',
    department: 'Human Resources',
    responsesCount: 9,
    tenureBand: '<1 year',
    domainMeans: {
      demands: 3.8,
      control: 3.9,
      managerSupport: 4.1,
      peerSupport: 4.2,
      relationships: 4.0,
      role: 4.1,
      change: 3.7
    },
    overallRisk: 'Low',
    worstDomain: 'Change'
  },
  {
    id: '12',
    department: 'Outpatient Clinics',
    responsesCount: 50,
    tenureBand: 'Mixed',
    domainMeans: {
      demands: 2.8,
      control: 3.1,
      managerSupport: 3.0,
      peerSupport: 3.3,
      relationships: 3.2,
      role: 3.4,
      change: 2.7
    },
    overallRisk: 'High',
    worstDomain: 'Change'
  }
];

window.WorkplaceStressAssessmentDashboard.sampleTeams = sampleTeams;
})();
