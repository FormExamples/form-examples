// Morse Fall Scale (MFS) item registry and ancillary rule registry.
//
// The MFS is a six-item bedside instrument that produces a total score in
// the range 0..=125. Each item has a fixed set of mutually-exclusive
// options with a pre-defined integer score.
//
// MFS-001: History of falling (immediate or within last 3 months)
// MFS-002: Secondary diagnosis
// MFS-003: Ambulatory aid
// MFS-004: IV / heparin lock
// MFS-005: Gait / transferring
// MFS-006: Mental status
//
// Total range: 0..=125
//   0..=24   : Low Risk
//   25..=44  : Moderate Risk
//   >= 45    : High Risk
//   Critical : recurrent falls with injury, anticoagulated, or MFS >= 75.

use super::types::{AssessmentData, MorseFallScale};

#[derive(Debug, Clone)]
pub struct MfsOption {
    pub score: i32,
    pub label: &'static str,
}

/// Field selector for an MFS item — used by the grader to read the value
/// out of the `MorseFallScale` struct.
pub type MfsFieldSelector = fn(&MorseFallScale) -> Option<i32>;

#[derive(Clone)]
pub struct MfsItem {
    pub id: &'static str,
    pub field: &'static str,
    pub field_get: MfsFieldSelector,
    pub label: &'static str,
    pub description: &'static str,
    pub options: &'static [MfsOption],
}

const HISTORY_OF_FALLING_OPTIONS: &[MfsOption] = &[
    MfsOption { score: 0,  label: "No" },
    MfsOption { score: 25, label: "Yes" },
];

const SECONDARY_DIAGNOSIS_OPTIONS: &[MfsOption] = &[
    MfsOption { score: 0,  label: "No" },
    MfsOption { score: 15, label: "Yes" },
];

const AMBULATORY_AID_OPTIONS: &[MfsOption] = &[
    MfsOption { score: 0,  label: "None / bed rest / wheelchair / nurse" },
    MfsOption { score: 15, label: "Crutches / cane / walker" },
    MfsOption { score: 30, label: "Furniture (uses furniture for support)" },
];

const IV_OR_HEPARIN_LOCK_OPTIONS: &[MfsOption] = &[
    MfsOption { score: 0,  label: "No" },
    MfsOption { score: 20, label: "Yes" },
];

const GAIT_TRANSFERRING_OPTIONS: &[MfsOption] = &[
    MfsOption { score: 0,  label: "Normal / bed rest / immobile" },
    MfsOption { score: 10, label: "Weak (slow, stooped, but able)" },
    MfsOption { score: 20, label: "Impaired (clutches, unsteady, jerky)" },
];

const MENTAL_STATUS_OPTIONS: &[MfsOption] = &[
    MfsOption { score: 0,  label: "Oriented to own ability" },
    MfsOption { score: 15, label: "Forgets / overestimates own ability" },
];

pub fn mfs_items() -> Vec<MfsItem> {
    vec![
        MfsItem {
            id: "MFS-001",
            field: "historyOfFalling",
            field_get: |m| m.history_of_falling,
            label: "History of falling",
            description: "Has the patient fallen within the last 3 months, or on the current admission?",
            options: HISTORY_OF_FALLING_OPTIONS,
        },
        MfsItem {
            id: "MFS-002",
            field: "secondaryDiagnosis",
            field_get: |m| m.secondary_diagnosis,
            label: "Secondary diagnosis",
            description: "Does the patient have more than one medical diagnosis listed on the chart?",
            options: SECONDARY_DIAGNOSIS_OPTIONS,
        },
        MfsItem {
            id: "MFS-003",
            field: "ambulatoryAid",
            field_get: |m| m.ambulatory_aid,
            label: "Ambulatory aid",
            description: "What ambulatory aid does the patient use to walk?",
            options: AMBULATORY_AID_OPTIONS,
        },
        MfsItem {
            id: "MFS-004",
            field: "ivOrHeparinLock",
            field_get: |m| m.iv_or_heparin_lock,
            label: "IV / heparin lock",
            description: "Does the patient have an intravenous line or heparin/saline lock in place?",
            options: IV_OR_HEPARIN_LOCK_OPTIONS,
        },
        MfsItem {
            id: "MFS-005",
            field: "gaitTransferring",
            field_get: |m| m.gait_transferring,
            label: "Gait / transferring",
            description: "How does the patient walk and transfer?",
            options: GAIT_TRANSFERRING_OPTIONS,
        },
        MfsItem {
            id: "MFS-006",
            field: "mentalStatus",
            field_get: |m| m.mental_status,
            label: "Mental status",
            description: "How does the patient assess their own ability to ambulate?",
            options: MENTAL_STATUS_OPTIONS,
        },
    ]
}

// ----------------------------------------------------------------------
// Ancillary clinical-heuristic rules. These supplement the raw MFS score
// and drive both the Critical-override and the flag detection module.
// ----------------------------------------------------------------------

pub fn is_anticoagulated(d: &AssessmentData) -> bool {
    d.medication_review.anticoagulants == "yes"
}

pub fn has_recurrent_falls_with_injury(d: &AssessmentData) -> bool {
    d.fall_history.recurrent_falls_with_injury == "yes"
}

pub fn has_recent_injurious_fall(d: &AssessmentData) -> bool {
    d.fall_history.has_fallen_in_past_year == "yes"
        && d.fall_history.most_recent_fall_injurious == "yes"
}

pub fn has_severe_orthostatic_hypotension(d: &AssessmentData) -> bool {
    d.mobility_gait.orthostatic_hypotension_severe == "yes"
}

pub fn has_dementia(d: &AssessmentData) -> bool {
    d.cognitive.dementia_diagnosis == "yes"
}

pub fn hip_protectors_absent(d: &AssessmentData) -> bool {
    d.environmental.hip_protectors_used == "no"
}

pub fn has_polypharmacy(d: &AssessmentData) -> bool {
    if d.medication_review.polypharmacy == "yes" {
        return true;
    }
    d.medication_review.medications.len() >= 4
}
