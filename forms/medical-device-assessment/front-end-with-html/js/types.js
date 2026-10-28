// State shape for the Medical Device Assessment wizard.
//
// The scoring engine's own fields come from device-grader.js
// (createDefaultAssessment); this module layers on the descriptive fields the
// wizard collects but the engine ignores (manufacturer, assessor, device
// identification, notes), mirroring sql/02..04. Unanswered text and enum
// fields are '' and unanswered dates are null.

import { createDefaultAssessment } from './device-grader.js';

/** @returns {Record<string, any>} a fresh, fully-defaulted wizard state */
export function emptyAssessment() {
  return {
    ...createDefaultAssessment(),
    assessmentDate: null,
    modelOrCatalogueNumber: '',
    uniqueDeviceIdentifier: '',
    intendedUser: '',
    targetJurisdiction: '',
    assessorNotes: '',
    manufacturer: {
      name: '',
      email: '',
      phone: '',
      postalAddressAsFullText: '',
      countryAsIso31661Alpha2: '',
      postcode: '',
      singleRegistrationNumber: '',
      authorizedRepresentativeName: '',
      unitedKingdomResponsiblePersonName: ''
    },
    assessor: {
      name: '',
      email: '',
      phone: '',
      role: '',
      organization: ''
    }
  };
}

export const CLASS_ORDER = ['I', 'IIa', 'IIb', 'III'];

export const ROUTE_LABELS = {
  'self-declaration': 'Self-declaration (Class I)',
  'notified-body-partial': 'Notified body, partial involvement (Is / Im / Ir)',
  'notified-body-full': 'Notified body, full conformity assessment',
  '': 'Not determined'
};

export const READINESS_LABELS = {
  ready: 'Ready',
  gaps: 'Gaps to close',
  blocked: 'Blocked',
  '': 'Not determined'
};

/** Format a class with its Class I suffix, e.g. "Class Is". */
export function classLabel(deviceClass, suffix) {
  return deviceClass ? `Class ${deviceClass}${suffix || ''}` : 'Not determined';
}
