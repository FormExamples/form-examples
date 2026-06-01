//! Catalogue of MEDIF airline-aligned fitness-to-fly rule IDs. The actual
//! rule evaluation lives in [`super::fitness_grader::evaluate_fitness`];
//! this module exposes the canonical rule ID list for documentation,
//! drift detection, and unit testing of unique IDs.
//!
//! Rule IDs are preserved verbatim from
//! `front-end-form-with-html/js/app.js` so the front-end report and
//! back-end report share a single contract.

/// Every rule ID that the fitness engine can fire. Order mirrors the
/// JS `evaluateFitness` source for ease of cross-referencing.
pub const RULE_IDS: &[&str] = &[
    // Cardiac
    "R-CARDIAC-MI-7D",
    "R-CARDIAC-MI-14D",
    "R-CARDIAC-UNSTABLE-ANGINA",
    "R-CARDIAC-NYHA-IV",
    "R-CARDIAC-NYHA-III",
    // Pulmonary
    "R-PULM-PNEUMOTHORAX-14D",
    "R-PULM-SPO2-LT-85",
    "R-PULM-SPO2-LT-92",
    "R-PULM-HCT-FAIL",
    "R-PULM-COPD-SEVERE",
    "R-PULM-ASTHMA-SEVERE",
    "R-PULM-PE-6WK",
    // Gas / surgery / fracture / DVT / scuba / stroke
    "R-GAS-CAVITY",
    "R-GAS-PNEUMO",
    "R-GAS-CAST",
    "R-SURG-RECENT-10D",
    "R-DVT-RECENT",
    "R-SCUBA-24H",
    "R-STROKE-10D",
    // Pregnancy
    "R-PREG-SINGLETON-GT-36",
    "R-PREG-MULTIPLE-GT-32",
    "R-PREG-SINGLETON-28-36",
    "R-PREG-MULTIPLE-24-32",
    // Communicable
    "R-COMM-INFECTIOUS",
    "R-COMM-CONVALESCENT",
    // Anaemia
    "R-ANAEMIA-SEVERE",
    "R-ANAEMIA-MOD",
    // Equipment
    "R-O2-GT-4LPM",
    "R-O2-LOW-FLOW",
    "R-POC",
    "R-POC-BATTERY-INSUFFICIENT",
    "R-STRETCHER",
    "R-INCUBATOR",
    "R-IV-PUMP",
    "R-DG-BATTERY",
    // Submitter / coverage
    "R-PSYCH",
];
