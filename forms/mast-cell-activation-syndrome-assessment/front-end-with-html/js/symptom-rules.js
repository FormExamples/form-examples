// MCAS symptom rules — option lists shared by the form and the report.

/**
 * @typedef {Object} SymptomDomainDefinition
 * @property {string} id
 * @property {string} domain
 * @property {string[]} symptoms
 * @property {string} description
 */

/** @type {SymptomDomainDefinition[]} */
const symptomDomains = [
  {
    id: 'MCAS-DERM',
    domain: 'Dermatological',
    symptoms: ['Flushing', 'Urticaria', 'Angioedema', 'Pruritus'],
    description:
      'Skin-related symptoms including flushing, hives, swelling, and itching'
  },
  {
    id: 'MCAS-GI',
    domain: 'Gastrointestinal',
    symptoms: ['Abdominal Pain', 'Nausea', 'Diarrhea', 'Bloating'],
    description:
      'Digestive symptoms including pain, nausea, diarrhea, and bloating'
  },
  {
    id: 'MCAS-CV',
    domain: 'Cardiovascular',
    symptoms: ['Tachycardia', 'Hypotension', 'Presyncope', 'Syncope'],
    description:
      'Heart and blood pressure symptoms including rapid heart rate and fainting'
  },
  {
    id: 'MCAS-RESP',
    domain: 'Respiratory',
    symptoms: ['Wheezing', 'Dyspnea', 'Nasal Congestion', 'Throat Tightening'],
    description:
      'Breathing-related symptoms including wheezing and airway tightening'
  },
  {
    id: 'MCAS-NEURO',
    domain: 'Neurological',
    symptoms: ['Headache', 'Brain Fog', 'Dizziness', 'Fatigue'],
    description:
      'Neurological symptoms including cognitive difficulties and fatigue'
  }
];

/** Severity options scored 0-3 for each symptom. */
const severityOptions = [
  { value: 0, label: 'None (0)' },
  { value: 1, label: 'Mild (1)' },
  { value: 2, label: 'Moderate (2)' },
  { value: 3, label: 'Severe (3)' }
];

/** Symptom frequency options. */
const frequencyOptions = [
  { value: 'never', label: 'Never' },
  { value: 'rarely', label: 'Rarely (< monthly)' },
  { value: 'sometimes', label: 'Sometimes (monthly)' },
  { value: 'often', label: 'Often (weekly)' },
  { value: 'daily', label: 'Daily' }
];

export { symptomDomains, severityOptions, frequencyOptions };
