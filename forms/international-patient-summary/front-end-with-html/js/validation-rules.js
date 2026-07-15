// IPS section-population rules.
//
// Each rule reports whether the corresponding IPS section is
// "populated" (has at least one usable entry / required scalars
// filled) or "empty". Mandatory sections drive the Complete /
// Partial / Incomplete grading; optional sections do not affect
// grading but are tracked in the per-section audit table.
//
// IPS-001 .. IPS-008  Mandatory sections (ISO 27269 / FHIR IPS IG)
// IPS-009 .. IPS-010  Optional sections

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} IPSRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {boolean} mandatory
 * @property {(d: AssessmentData) => 'ok' | 'empty'} evaluate
 */

// Wrapped in an IIFE; published via window.InternationalPatientSummary.

/** Patient demographics is "populated" only when the IPS-required
 *  identifiers are present: a name, a date of birth, and a sex code. */
function demographicsPopulated(d) {
  const p = d.patientDemographics;
  const hasName =
    String(p.givenName || '').trim() !== '' &&
    String(p.familyName || '').trim() !== '';
  return hasName &&
    String(p.dateOfBirth || '').trim() !== '' &&
    String(p.sex || '').trim() !== '';
}

/** Problem list: at least one row with a non-empty description. */
function problemListPopulated(d) {
  return d.problemList.some((p) => String(p.description || '').trim() !== '');
}

/** Medications: at least one row with a non-empty name. */
function medicationsPopulated(d) {
  return d.medicationSummary.some((m) => String(m.name || '').trim() !== '');
}

/** Allergies: at least one row, possibly the special "no known allergies"
 *  marker per IPS guidance — substance "no-known-allergies" or any
 *  recorded substance is acceptable. */
function allergiesPopulated(d) {
  return d.allergiesIntolerances.some(
    (a) => String(a.substance || '').trim() !== ''
  );
}

/** Immunisations: at least one row with a non-empty vaccine name. */
function immunisationsPopulated(d) {
  return d.immunisations.some((i) => String(i.vaccine || '').trim() !== '');
}

/** Procedures: at least one row with a non-empty description. */
function proceduresPopulated(d) {
  return d.procedures.some((p) => String(p.description || '').trim() !== '');
}

/** Results & investigations: at least one row with a test name. */
function resultsPopulated(d) {
  return d.resultsInvestigations.some((r) => String(r.testName || '').trim() !== '');
}

/** Medical devices (optional): at least one row with a description. */
function devicesPopulated(d) {
  return d.medicalDevices.some((dv) => String(dv.description || '').trim() !== '');
}

/** Advance directives (optional): at least one of the three yes/no
 *  signals has been answered, OR free-text notes provided. */
function advanceDirectivesPopulated(d) {
  const a = d.advanceDirectives;
  return (
    a.dnrInPlace !== '' ||
    a.livingWillInPlace !== '' ||
    a.consentToShareEu !== '' ||
    String(a.directiveNotes || '').trim() !== ''
  );
}

/** Authoring clinician: name, role, organisation, and signoff status. */
function authoringClinicianPopulated(d) {
  const c = d.authoringClinician;
  return (
    String(c.clinicianName || '').trim() !== '' &&
    String(c.clinicianRole || '').trim() !== '' &&
    String(c.organisation || '').trim() !== '' &&
    String(c.authoringStatus || '').trim() !== ''
  );
}

/** @type {IPSRule[]} */
const validationRules = [
  {
    id: 'IPS-001',
    category: 'Patient Demographics',
    description: 'Identifying patient details (name, DOB, sex) populated.',
    mandatory: true,
    evaluate: (d) => (demographicsPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-002',
    category: 'Problem List',
    description: 'At least one problem (active or past) recorded.',
    mandatory: true,
    evaluate: (d) => (problemListPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-003',
    category: 'Medication Summary',
    description: 'At least one current or recent medication recorded.',
    mandatory: true,
    evaluate: (d) => (medicationsPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-004',
    category: 'Allergies & Intolerances',
    description: 'Allergies recorded, including "no known allergies" marker if applicable.',
    mandatory: true,
    evaluate: (d) => (allergiesPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-005',
    category: 'Immunisations',
    description: 'At least one immunisation recorded.',
    mandatory: true,
    evaluate: (d) => (immunisationsPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-006',
    category: 'Procedures',
    description: 'At least one procedure recorded.',
    mandatory: true,
    evaluate: (d) => (proceduresPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-007',
    category: 'Results & Investigations',
    description: 'At least one diagnostic result or investigation recorded.',
    mandatory: true,
    evaluate: (d) => (resultsPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-008',
    category: 'Authoring Clinician',
    description: 'Authoring clinician identified and signoff status set.',
    mandatory: true,
    evaluate: (d) => (authoringClinicianPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-009',
    category: 'Medical Devices / Implants',
    description: 'Medical devices recorded (optional).',
    mandatory: false,
    evaluate: (d) => (devicesPopulated(d) ? 'ok' : 'empty')
  },
  {
    id: 'IPS-010',
    category: 'Advance Directives & Consent',
    description: 'Advance directives or cross-border consent recorded (optional).',
    mandatory: false,
    evaluate: (d) => (advanceDirectivesPopulated(d) ? 'ok' : 'empty')
  }
];

export const sectionPopulationCheckers = {
  demographicsPopulated,
  problemListPopulated,
  medicationsPopulated,
  allergiesPopulated,
  immunisationsPopulated,
  proceduresPopulated,
  resultsPopulated,
  devicesPopulated,
  advanceDirectivesPopulated,
  authoringClinicianPopulated
};

export { validationRules };
