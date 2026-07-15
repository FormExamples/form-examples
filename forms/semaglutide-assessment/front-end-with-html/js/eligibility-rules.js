// Semaglutide eligibility rules.
//
// Two declarative arrays of rule definitions:
//   - absoluteContraindications: any "yes" answer makes the patient ineligible.
//   - relativeContraindications: any "yes" answer makes the patient
//     "Conditional" (requires clinician review / monitoring).
//
// Plus BMI thresholds for the weight-management indication.
//
// Ported 1:1 from `src/lib/engine/eligibility-rules.ts`.

/**
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} EligibilityRuleDefinition
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {'absolute' | 'relative'} type
 */

/**
 * Absolute contraindications - these make a patient ineligible for semaglutide.
 * @type {EligibilityRuleDefinition[]}
 */
const absoluteContraindications = [
  {
    id: 'CONTRA-ABS-001',
    category: 'Endocrine',
    description: 'Personal history of medullary thyroid carcinoma (MTC)',
    type: 'absolute'
  },
  {
    id: 'CONTRA-ABS-002',
    category: 'Endocrine',
    description: 'Family history of medullary thyroid carcinoma (MTC)',
    type: 'absolute'
  },
  {
    id: 'CONTRA-ABS-003',
    category: 'Endocrine',
    description: 'Multiple Endocrine Neoplasia syndrome type 2 (MEN2)',
    type: 'absolute'
  },
  {
    id: 'CONTRA-ABS-004',
    category: 'Gastrointestinal',
    description: 'History of pancreatitis',
    type: 'absolute'
  },
  {
    id: 'CONTRA-ABS-005',
    category: 'Reproductive',
    description: 'Pregnancy planned or currently pregnant',
    type: 'absolute'
  },
  {
    id: 'CONTRA-ABS-006',
    category: 'Diabetes',
    description: 'Type 1 diabetes mellitus',
    type: 'absolute'
  },
  {
    id: 'CONTRA-ABS-007',
    category: 'Allergy',
    description: 'Known allergy or hypersensitivity to semaglutide',
    type: 'absolute'
  }
];

/**
 * Relative contraindications - these require additional monitoring or clinical judgement.
 * @type {EligibilityRuleDefinition[]}
 */
const relativeContraindications = [
  {
    id: 'CONTRA-REL-001',
    category: 'Gastrointestinal',
    description: 'Gastroparesis - semaglutide may worsen delayed gastric emptying',
    type: 'relative'
  },
  {
    id: 'CONTRA-REL-002',
    category: 'Gastrointestinal',
    description: 'History of gallstones - GLP-1 RAs may increase cholelithiasis risk',
    type: 'relative'
  },
  {
    id: 'CONTRA-REL-003',
    category: 'Ophthalmology',
    description: 'Severe diabetic retinopathy - rapid HbA1c reduction may worsen',
    type: 'relative'
  },
  {
    id: 'CONTRA-REL-004',
    category: 'Mental Health',
    description: 'History of eating disorder - weight loss medication requires careful monitoring',
    type: 'relative'
  },
  {
    id: 'CONTRA-REL-005',
    category: 'Mental Health',
    description: 'Suicidal ideation - GLP-1 RA safety monitoring required',
    type: 'relative'
  },
  {
    id: 'CONTRA-REL-006',
    category: 'Reproductive',
    description: 'Currently breastfeeding - insufficient safety data',
    type: 'relative'
  },
  {
    id: 'CONTRA-REL-007',
    category: 'Gastrointestinal',
    description: 'Severe gastrointestinal disease - may exacerbate symptoms',
    type: 'relative'
  }
];

/**
 * BMI eligibility thresholds by indication.
 */
const bmiThresholds = {
  'weight-management': {
    minimumBmi: 30,
    minimumBmiWithComorbidity: 27,
    description: 'BMI >= 30, or >= 27 with weight-related comorbidity'
  },
  'type2-diabetes': {
    minimumBmi: null,
    minimumBmiWithComorbidity: null,
    description: 'No BMI threshold for type 2 diabetes indication'
  },
  'cardiovascular-risk-reduction': {
    minimumBmi: null,
    minimumBmiWithComorbidity: null,
    description: 'No BMI threshold for cardiovascular risk reduction'
  }
};

export { absoluteContraindications, relativeContraindications, bmiThresholds };
