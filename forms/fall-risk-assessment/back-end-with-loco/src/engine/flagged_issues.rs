//! Detection of additional flagged issues.

// Flagged-issue detection for the Fall Risk Assessment.
//
// Independent of the raw MFS score, this module raises clinician-facing
// flags grouped by priority so that the report can surface items that
// influence — or do not influence — the MFS but still matter for
// fall-prevention planning.
//
// Priority bands:
//   high   - acute clinical risks (injurious fall, anticoagulant, severe
//            orthostatic hypotension, dementia, hip protectors absent for
//            a high-risk patient)
//   medium - modifiable contributing factors (polypharmacy, sedatives,
//            uncorrected vision, environmental hazards, footwear)
//   low    - care-process gaps (intervention declined, missed referral)
//
// Flags are sorted high -> medium -> low.

use super::mfs_rules::{
    has_dementia, has_polypharmacy, has_recent_injurious_fall,
    has_severe_orthostatic_hypotension, hip_protectors_absent, is_anticoagulated,
};
use super::types::{AdditionalFlag, AssessmentData};

/// Detect additional flags.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH priority ────────────────────────────────────────

    if has_recent_injurious_fall(data) {
        let detail = data.fall_history.most_recent_fall_injury_details.trim();
        let message = if detail.is_empty() {
            "Recent injurious fall.".to_string()
        } else {
            format!("Recent injurious fall: {detail}")
        };
        flags.push(AdditionalFlag {
            id: "FLAG-FALL-001".to_string(),
            category: "Fall History".to_string(),
            message,
            priority: "high".to_string(),
        });
    }

    if is_anticoagulated(data) {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-001".to_string(),
            category: "Medications".to_string(),
            message: "Patient is on anticoagulant therapy — markedly elevated bleeding risk if a fall occurs.".to_string(),
            priority: "high".to_string(),
        });
    }

    if has_severe_orthostatic_hypotension(data) {
        flags.push(AdditionalFlag {
            id: "FLAG-MOB-001".to_string(),
            category: "Mobility".to_string(),
            message: "Severe orthostatic hypotension — review antihypertensives and assess hydration / vasoactive medications.".to_string(),
            priority: "high".to_string(),
        });
    }

    if has_dementia(data) {
        flags.push(AdditionalFlag {
            id: "FLAG-COG-001".to_string(),
            category: "Cognition".to_string(),
            message: "Diagnosis of dementia — increased fall risk; consider supervision, environmental cues, and carer education.".to_string(),
            priority: "high".to_string(),
        });
    }

    // Hip protectors absent for a high-risk MFS patient.
    if hip_protectors_absent(data) {
        // Avoid recursion: compute the raw MFS severity directly here.
        let (_score, severity, _co, _cr, _ac, _fr) =
            super::fall_risk_grader::grade_fall_risk(data);
        if severity == "high" || severity == "critical" {
            flags.push(AdditionalFlag {
                id: "FLAG-ENV-001".to_string(),
                category: "Environment".to_string(),
                message: "High fall risk without hip protectors — consider hip protectors for fracture prevention.".to_string(),
                priority: "high".to_string(),
            });
        }
    }

    // ─── MEDIUM priority ──────────────────────────────────────

    if has_polypharmacy(data) {
        let count = data.medication_review.medications.len();
        let message = if count >= 4 {
            format!("Polypharmacy detected ({count} medications) — schedule a medication review.")
        } else {
            "Polypharmacy reported — schedule a medication review.".to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-MED-002".to_string(),
            category: "Medications".to_string(),
            message,
            priority: "medium".to_string(),
        });
    }

    if data.medication_review.sedatives_or_hypnotics == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-003".to_string(),
            category: "Medications".to_string(),
            message: "Sedatives or hypnotics in use — consider deprescribing; counsel on night-time fall risk.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.vision_sensory.vision_impairment == "yes"
        && data.vision_sensory.vision_corrected != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-VIS-001".to_string(),
            category: "Vision".to_string(),
            message: "Vision impairment uncorrected — refer for ophthalmology / optometry review.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Environmental hazards: fire one combined flag listing the active hazards.
    let mut env_hazards: Vec<&str> = Vec::new();
    if data.environmental.loos_throw_rugs == "yes" {
        env_hazards.push("loose throw rugs");
    }
    if data.environmental.cluttered_walkways == "yes" {
        env_hazards.push("cluttered walkways");
    }
    if data.environmental.poor_lighting == "yes" {
        env_hazards.push("poor lighting");
    }
    if data.environmental.stairs_without_handrails == "yes" {
        env_hazards.push("stairs without handrails");
    }
    if data.environmental.bathroom_grab_bars_absent == "yes" {
        env_hazards.push("no bathroom grab bars");
    }
    if data.environmental.bed_height_problem == "yes" {
        env_hazards.push("unsuitable bed height");
    }
    if !env_hazards.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-002".to_string(),
            category: "Environment".to_string(),
            message: format!("Environmental hazards present: {}.", env_hazards.join(", ")),
            priority: "medium".to_string(),
        });
    }

    if data.environmental.unsuitable_footwear == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-003".to_string(),
            category: "Environment".to_string(),
            message: "Unsuitable footwear — recommend well-fitting non-slip shoes.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW priority ─────────────────────────────────────────

    if data.previous_interventions.intervention_declined == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-INT-001".to_string(),
            category: "Interventions".to_string(),
            message: "Patient has declined a recommended fall-prevention intervention — document, educate, revisit.".to_string(),
            priority: "low".to_string(),
        });
    }

    if data.previous_interventions.missed_referral == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-INT-002".to_string(),
            category: "Interventions".to_string(),
            message: "Previous referral missed — re-issue (falls clinic, physiotherapy, occupational therapy as appropriate).".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
