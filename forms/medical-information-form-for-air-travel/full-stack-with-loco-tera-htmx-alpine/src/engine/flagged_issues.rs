//! Catalogue of MEDIF safety-flag IDs. The actual flag detection logic
//! lives in [`super::fitness_grader::evaluate_fitness`]; this module
//! exposes the canonical flag ID list for documentation, drift detection,
//! and unit testing of unique IDs.
//!
//! Flag IDs are preserved verbatim from
//! `front-end-form-with-html/js/app.js`.

/// Every safety-flag ID that the engine can emit. Order mirrors the JS source.
pub const FLAG_IDS: &[&str] = &[
    // Cardiac
    "F-CARDIAC-MI",
    "F-CARDIAC-MI-RECENT",
    "F-CARDIAC-UNSTABLE-ANGINA",
    "F-CARDIAC-NYHA-IV",
    // Pulmonary
    "F-PULM-PNEUMOTHORAX",
    "F-PULM-HYPOXAEMIA",
    "F-PULM-LOW-SPO2",
    "F-PULM-COPD-SEVERE",
    "F-PULM-ASTHMA-SEVERE",
    "F-PULM-ASTHMA-MILD",
    "F-PULM-PE",
    // Gas / surgery / fracture / DVT / scuba / stroke
    "F-GAS-CAVITY",
    "F-GAS-PNEUMO",
    "F-GAS-CAST",
    "F-SURG-RECENT",
    "F-SURG-2WK",
    "F-MSK-FRACTURE",
    "F-DVT",
    "F-SCUBA",
    "F-STROKE",
    // Pregnancy
    "F-PREG-LATE",
    "F-PREG-MULTIPLE-LATE",
    "F-PREG-CERT",
    "F-PREG-MULTIPLE-CERT",
    // Communicable
    "F-COMM-INFECTIOUS",
    "F-COMM-CONVALESCENT",
    // Anaemia
    "F-ANAEMIA",
    "F-ANAEMIA-MOD",
    // Equipment
    "F-O2-HIGH-FLOW",
    "F-POC",
    "F-POC-BATTERY",
    "F-STRETCHER",
    "F-INCUBATOR",
    "F-IV-PUMP",
    "F-DG-BATTERY",
    "F-ESCORT",
    "F-WCHC",
    // Submitter / coverage
    "F-PSYCH",
];
