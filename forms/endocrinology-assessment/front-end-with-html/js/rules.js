import { maxStatus } from './types.js';

// Endocrinology axis-grading rules.
//
// Each axis is graded against an AxisStatus value:
//   normal      - clinical and biochemical indices within reference range
//   subclinical - biochemical abnormality without symptoms
//   mild        - mild symptomatic disturbance
//   moderate    - moderate symptomatic disturbance
//   severe      - severe symptomatic disturbance / out-of-range biochemistry
//
// Reference ranges (adult, indicative; clinical context required):
//   TSH         0.4 - 4.0   mIU/L
//   FT4         9   - 25    pmol/L
//   FT3         3.5 - 6.5   pmol/L
//   Cortisol AM 140 - 700   nmol/L (peak)
//   ACTH        2   - 11    pmol/L
//   HbA1c       <42 normal, 42-47 prediabetes, >=48 diabetes (mmol/mol)
//   Fasting glc <5.6 normal, 5.6-6.9 IFG, >=7.0 diabetes (mmol/L)
//   Prolactin   <500 mU/L (women non-pregnant), <325 (men)
//   IGF-1       age-dependent (12 - 40 nmol/L typical adults)
//   PTH         1.6 - 6.9   pmol/L
//   Vitamin D   >=50 sufficient, 25-49 insufficient, <25 deficient (nmol/L)
//   Ca corrected 2.20 - 2.60 mmol/L

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AxisStatus} AxisStatus
 *
 * @typedef {Object} AxisRule
 * @property {string} id
 * @property {string} axis
 * @property {string} description
 * @property {(d: AssessmentData) => { status: AxisStatus, findings: string[] }} evaluate
 */

/** @type {AxisRule[]} */
const axisRules = [
  {
    id: 'AXIS-THY',
    axis: 'Thyroid',
    description: 'Thyroid axis grading from TSH/FT4/FT3 and clinical features.',
    evaluate: (d) => {
      const findings = [];
      let status = '';
      const t = d.thyroidAxis;

      if (t.tsh !== null) {
        if (t.tsh > 10) {
          findings.push(`TSH ${t.tsh} mIU/L — overt hypothyroidism range.`);
          status = maxStatus(status, 'severe');
        } else if (t.tsh > 4.0) {
          findings.push(`TSH ${t.tsh} mIU/L — elevated.`);
          status = maxStatus(status, 'mild');
        } else if (t.tsh < 0.1) {
          findings.push(`TSH ${t.tsh} mIU/L — markedly suppressed (overt hyperthyroidism range).`);
          status = maxStatus(status, 'severe');
        } else if (t.tsh < 0.4) {
          findings.push(`TSH ${t.tsh} mIU/L — suppressed.`);
          status = maxStatus(status, 'mild');
        }
      }

      if (t.ft4 !== null) {
        if (t.ft4 < 9) {
          findings.push(`FT4 ${t.ft4} pmol/L — low.`);
          status = maxStatus(status, 'moderate');
        } else if (t.ft4 > 25) {
          findings.push(`FT4 ${t.ft4} pmol/L — high.`);
          status = maxStatus(status, 'moderate');
        }
      }

      if (t.ft3 !== null) {
        if (t.ft3 < 3.5) {
          findings.push(`FT3 ${t.ft3} pmol/L — low.`);
          status = maxStatus(status, 'moderate');
        } else if (t.ft3 > 6.5) {
          findings.push(`FT3 ${t.ft3} pmol/L — high.`);
          status = maxStatus(status, 'moderate');
        }
      }

      if (t.antibodiesPositive === 'yes') {
        findings.push('Positive thyroid autoantibodies.');
        status = maxStatus(status, 'subclinical');
      }
      if (t.goitre === 'yes') {
        findings.push('Goitre present on examination.');
        status = maxStatus(status, 'mild');
      }

      // Promote subclinical -> mild when symptoms coexist with biochemistry.
      const sx = d.presentingSymptoms;
      const symptomatic = sx.heatIntolerance === 'yes' ||
        sx.coldIntolerance === 'yes' || sx.palpitations === 'yes' ||
        sx.tremor === 'yes';
      if (status === 'subclinical' && symptomatic) {
        status = 'mild';
        findings.push('Coexisting thyroid-related symptoms.');
      }

      if (!status) {
        status = anyAnswered(t) ? 'normal' : '';
      }
      return { status, findings };
    }
  },
  {
    id: 'AXIS-ADR',
    axis: 'Adrenal',
    description: 'Adrenal axis grading from cortisol/ACTH/aldosterone and clinical features.',
    evaluate: (d) => {
      const findings = [];
      let status = '';
      const a = d.adrenalAxis;

      if (a.morningCortisol !== null) {
        if (a.morningCortisol < 100) {
          findings.push(`Morning cortisol ${a.morningCortisol} nmol/L — adrenal insufficiency suspected.`);
          status = maxStatus(status, 'severe');
        } else if (a.morningCortisol < 140) {
          findings.push(`Morning cortisol ${a.morningCortisol} nmol/L — borderline, dynamic testing required.`);
          status = maxStatus(status, 'moderate');
        } else if (a.morningCortisol > 700) {
          findings.push(`Morning cortisol ${a.morningCortisol} nmol/L — elevated.`);
          status = maxStatus(status, 'mild');
        }
      }
      if (a.acth !== null) {
        if (a.acth > 22) {
          findings.push(`ACTH ${a.acth} pmol/L — elevated (suggests primary adrenal failure or ectopic).`);
          status = maxStatus(status, 'moderate');
        } else if (a.acth < 2) {
          findings.push(`ACTH ${a.acth} pmol/L — suppressed.`);
          status = maxStatus(status, 'mild');
        }
      }
      if (a.hyperpigmentation === 'yes') {
        findings.push('Hyperpigmentation on examination.');
        status = maxStatus(status, 'moderate');
      }
      if (a.cushingoidFeatures === 'yes') {
        findings.push('Cushingoid features on examination.');
        status = maxStatus(status, 'moderate');
      }
      if (a.posturalHypotension === 'yes') {
        findings.push('Postural hypotension.');
        status = maxStatus(status, 'mild');
      }

      if (!status) status = anyAnswered(a) ? 'normal' : '';
      return { status, findings };
    }
  },
  {
    id: 'AXIS-GLU',
    axis: 'Glucose',
    description: 'Glucose metabolism grading from HbA1c, fasting glucose, and history.',
    evaluate: (d) => {
      const findings = [];
      let status = '';
      const g = d.glucoseMetabolism;

      if (g.hba1c !== null) {
        if (g.hba1c >= 75) {
          findings.push(`HbA1c ${g.hba1c} mmol/mol — markedly elevated diabetes range.`);
          status = maxStatus(status, 'severe');
        } else if (g.hba1c >= 58) {
          findings.push(`HbA1c ${g.hba1c} mmol/mol — sub-optimally controlled diabetes range.`);
          status = maxStatus(status, 'moderate');
        } else if (g.hba1c >= 48) {
          findings.push(`HbA1c ${g.hba1c} mmol/mol — diabetes range.`);
          status = maxStatus(status, 'mild');
        } else if (g.hba1c >= 42) {
          findings.push(`HbA1c ${g.hba1c} mmol/mol — pre-diabetes range.`);
          status = maxStatus(status, 'subclinical');
        }
      }

      if (g.fastingGlucose !== null) {
        if (g.fastingGlucose >= 11.1) {
          findings.push(`Fasting glucose ${g.fastingGlucose} mmol/L — markedly elevated.`);
          status = maxStatus(status, 'severe');
        } else if (g.fastingGlucose >= 7.0) {
          findings.push(`Fasting glucose ${g.fastingGlucose} mmol/L — diabetes range.`);
          status = maxStatus(status, 'moderate');
        } else if (g.fastingGlucose >= 5.6) {
          findings.push(`Fasting glucose ${g.fastingGlucose} mmol/L — impaired fasting glucose.`);
          status = maxStatus(status, 'subclinical');
        }
      }

      if (g.randomGlucose !== null && g.randomGlucose >= 11.1) {
        findings.push(`Random glucose ${g.randomGlucose} mmol/L — diabetes range.`);
        status = maxStatus(status, 'moderate');
      }

      if (g.hypoglycaemiaEpisodes === 'yes') {
        findings.push('History of hypoglycaemic episodes.');
        status = maxStatus(status, 'mild');
      }

      if (g.knownDiabetes === 'yes' && status === '') {
        findings.push('Known diabetes — ongoing review required.');
        status = 'mild';
      }

      if (!status) status = anyAnswered(g) ? 'normal' : '';
      return { status, findings };
    }
  },
  {
    id: 'AXIS-REP',
    axis: 'Reproductive',
    description: 'Reproductive axis grading from gonadotropins, sex steroids, and history.',
    evaluate: (d) => {
      const findings = [];
      let status = '';
      const r = d.reproductiveAxis;

      if (r.menstrualIrregularity === 'yes') {
        findings.push('Menstrual irregularity reported.');
        status = maxStatus(status, 'mild');
      }
      if (r.infertility === 'yes') {
        findings.push('Infertility concern.');
        status = maxStatus(status, 'moderate');
      }
      if (r.libidoChange === 'yes') {
        findings.push('Libido change reported.');
        status = maxStatus(status, 'mild');
      }
      if (r.galactorrhoea === 'yes') {
        findings.push('Galactorrhoea reported.');
        status = maxStatus(status, 'moderate');
      }
      if (r.fsh !== null && r.fsh > 25) {
        findings.push(`FSH ${r.fsh} IU/L — suggests primary gonadal failure.`);
        status = maxStatus(status, 'moderate');
      }
      if (r.lh !== null && r.lh > 25) {
        findings.push(`LH ${r.lh} IU/L — elevated.`);
        status = maxStatus(status, 'mild');
      }
      if (d.demographics.sex === 'male' && r.testosterone !== null && r.testosterone < 8) {
        findings.push(`Testosterone ${r.testosterone} nmol/L — low (hypogonadism range).`);
        status = maxStatus(status, 'moderate');
      }
      if (d.demographics.sex === 'female' && r.testosterone !== null && r.testosterone > 2.5) {
        findings.push(`Testosterone ${r.testosterone} nmol/L — elevated for female reference.`);
        status = maxStatus(status, 'mild');
      }

      if (!status) status = anyAnswered(r) ? 'normal' : '';
      return { status, findings };
    }
  },
  {
    id: 'AXIS-PIT',
    axis: 'Pituitary',
    description: 'Pituitary grading from prolactin/IGF-1/GH and visual / mass effect features.',
    evaluate: (d) => {
      const findings = [];
      let status = '';
      const p = d.pituitaryFunction;

      if (p.prolactin !== null) {
        if (p.prolactin > 5000) {
          findings.push(`Prolactin ${p.prolactin} mU/L — macroprolactinoma range.`);
          status = maxStatus(status, 'severe');
        } else if (p.prolactin > 1000) {
          findings.push(`Prolactin ${p.prolactin} mU/L — prolactinoma range.`);
          status = maxStatus(status, 'moderate');
        } else if (p.prolactin > 500) {
          findings.push(`Prolactin ${p.prolactin} mU/L — mildly elevated.`);
          status = maxStatus(status, 'mild');
        }
      }
      if (p.igf1 !== null && p.igf1 > 50) {
        findings.push(`IGF-1 ${p.igf1} nmol/L — elevated (acromegaly screening).`);
        status = maxStatus(status, 'moderate');
      }
      if (p.growthHormone !== null && p.growthHormone > 5) {
        findings.push(`GH ${p.growthHormone} ng/mL — elevated.`);
        status = maxStatus(status, 'mild');
      }
      if (p.visualDisturbance === 'yes') {
        findings.push('Visual disturbance — possible chiasmal compression.');
        status = maxStatus(status, 'severe');
      }
      if (p.headaches === 'yes') {
        findings.push('Headaches reported.');
        status = maxStatus(status, 'mild');
      }
      if (p.acromegalicFeatures === 'yes') {
        findings.push('Acromegalic features on examination.');
        status = maxStatus(status, 'moderate');
      }

      if (!status) status = anyAnswered(p) ? 'normal' : '';
      return { status, findings };
    }
  },
  {
    id: 'AXIS-BON',
    axis: 'Bone & Calcium',
    description: 'Bone and calcium grading from PTH, vitamin D, calcium, and skeletal events.',
    evaluate: (d) => {
      const findings = [];
      let status = '';
      const b = d.boneCalcium;

      if (b.calciumCorrected !== null) {
        if (b.calciumCorrected > 3.0 || b.calciumCorrected < 1.9) {
          findings.push(`Corrected calcium ${b.calciumCorrected} mmol/L — markedly out of range.`);
          status = maxStatus(status, 'severe');
        } else if (b.calciumCorrected > 2.6) {
          findings.push(`Corrected calcium ${b.calciumCorrected} mmol/L — hypercalcaemia.`);
          status = maxStatus(status, 'moderate');
        } else if (b.calciumCorrected < 2.2) {
          findings.push(`Corrected calcium ${b.calciumCorrected} mmol/L — hypocalcaemia.`);
          status = maxStatus(status, 'moderate');
        }
      }
      if (b.pth !== null) {
        if (b.pth > 6.9) {
          findings.push(`PTH ${b.pth} pmol/L — elevated.`);
          status = maxStatus(status, 'mild');
        } else if (b.pth < 1.6) {
          findings.push(`PTH ${b.pth} pmol/L — suppressed.`);
          status = maxStatus(status, 'mild');
        }
      }
      if (b.vitaminD !== null) {
        if (b.vitaminD < 25) {
          findings.push(`Vitamin D ${b.vitaminD} nmol/L — deficient.`);
          status = maxStatus(status, 'moderate');
        } else if (b.vitaminD < 50) {
          findings.push(`Vitamin D ${b.vitaminD} nmol/L — insufficient.`);
          status = maxStatus(status, 'mild');
        }
      }
      if (b.fragilityFracture === 'yes') {
        findings.push('Fragility fracture history.');
        status = maxStatus(status, 'moderate');
      }
      if (b.bonePain === 'yes') {
        findings.push('Bone pain reported.');
        status = maxStatus(status, 'mild');
      }

      if (!status) status = anyAnswered(b) ? 'normal' : '';
      return { status, findings };
    }
  }
];

/** True if any field on a (flat) section object has a non-empty / non-null value. */
function anyAnswered(section) {
  for (const k of Object.keys(section)) {
    const v = section[k];
    if (v !== null && v !== undefined && v !== '') return true;
  }
  return false;
}

export { axisRules, anyAnswered };
