//! Detects clinically significant issues in a WHO Counter-Referral Form
//! submission. These are independent of pure completeness — for example,
//! the patient may have an urgent follow-up timeframe (which still requires
//! the primary care facility to be alerted in <24h), or the referral
//! facility may have failed to discuss the patient's care with the
//! receiving primary care provider before discharge.
//!
//! Priorities (urgent → high → medium → low) drive sort order in the
//! report.

use crate::engine::counter_referral_rules::{has_any_status_flag, has_text};
use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();

    // ─── Urgent follow-up timeframe (urgent) ──────────────────
    if data.facility_details.follow_up_timeframe == "urgent-within-24-hours" {
        flags.push(FlaggedIssue {
            id: "FLAG-FU-001".into(),
            category: "Follow-up".into(),
            message:
                "Urgent follow-up required within 24 hours - primary care facility must be alerted immediately."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Missing deterioration instructions (urgent) ──────────
    if !has_text(&data.recommendations.deterioration_instructions) {
        flags.push(FlaggedIssue {
            id: "FLAG-DET-001".into(),
            category: "Deterioration plan".into(),
            message:
                "No instructions provided for what to do if the patient's condition deteriorates."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Communication breakdown (high) ───────────────────────
    if !data
        .facility_details
        .communication
        .discussed_with_primary_care_provider
        && !data
            .facility_details
            .communication
            .discussed_with_initiating_facility
    {
        flags.push(FlaggedIssue {
            id: "FLAG-COM-001".into(),
            category: "Communication".into(),
            message:
                "Referral facility did not discuss follow-up care with either the primary care provider or the initiating facility."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Palliative care (high) ───────────────────────────────
    if data.recommendations.status_flags.palliative_care {
        flags.push(FlaggedIssue {
            id: "FLAG-PAL-001".into(),
            category: "Palliative care".into(),
            message:
                "Patient is on a palliative care pathway - ensure goals of care and family wishes are documented and shared."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Patient/family not informed (high) ───────────────────
    if data.assessment.patient_family_informed == "no" {
        flags.push(FlaggedIssue {
            id: "FLAG-INF-001".into(),
            category: "Patient communication".into(),
            message:
                "Patient/family have not been informed of the diagnosis - primary care provider should follow up at first contact."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── ICU stay during admission (medium) ───────────────────
    if data.situation.icu_stay {
        flags.push(FlaggedIssue {
            id: "FLAG-ICU-001".into(),
            category: "ICU stay".into(),
            message: "Patient was admitted to the ICU during the referral episode.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Surgery during admission (medium) ────────────────────
    if data.situation.surgery {
        flags.push(FlaggedIssue {
            id: "FLAG-SURG-001".into(),
            category: "Surgery".into(),
            message:
                "Patient underwent surgery during the referral episode - review wound care and post-operative monitoring needs."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Pregnancy (medium) ───────────────────────────────────
    if data.situation.pregnant == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-PREG-001".into(),
            category: "Pregnancy".into(),
            message: "Patient is pregnant - coordinate antenatal follow-up with primary care."
                .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Cognitive impairment (medium) ────────────────────────
    if data.recommendations.status_flags.cognitive_impairment {
        flags.push(FlaggedIssue {
            id: "FLAG-COG-001".into(),
            category: "Cognitive impairment".into(),
            message:
                "Cognitive impairment status flag set - ensure carer or family are present at follow-up appointments."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Carer-dependent (medium) ─────────────────────────────
    if data.recommendations.status_flags.carer_dependent {
        flags.push(FlaggedIssue {
            id: "FLAG-CAR-001".into(),
            category: "Carer-dependent".into(),
            message: "Patient is carer-dependent - confirm support is in place before discharge."
                .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Spinal precautions (medium) ──────────────────────────
    if data.recommendations.status_flags.spinal_precautions {
        flags.push(FlaggedIssue {
            id: "FLAG-SPN-001".into(),
            category: "Spinal precautions".into(),
            message:
                "Spinal precautions flagged - primary care should reinforce handling and mobilisation guidance."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Weight-bearing restrictions (medium) ─────────────────
    if data.recommendations.status_flags.weight_bearing_restrictions {
        flags.push(FlaggedIssue {
            id: "FLAG-WB-001".into(),
            category: "Weight-bearing".into(),
            message:
                "Weight-bearing restrictions flagged - review with patient and arrange physiotherapy follow-up."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Pending investigations (low) ─────────────────────────
    if has_text(&data.recommendations.pending_investigations) {
        flags.push(FlaggedIssue {
            id: "FLAG-INV-001".into(),
            category: "Pending investigations".into(),
            message: "Investigation results are still pending and require chase-up at follow-up."
                .into(),
            priority: FlagPriority::Low,
        });
    }

    // ─── Hospitalised (low) ───────────────────────────────────
    if data.situation.hospitalized && !data.situation.icu_stay && !data.situation.surgery {
        flags.push(FlaggedIssue {
            id: "FLAG-HOSP-001".into(),
            category: "Hospitalisation".into(),
            message: "Patient was hospitalised during the referral episode.".into(),
            priority: FlagPriority::Low,
        });
    }

    // ─── Any other status flag (low summary) — only emit when nothing
    // else covered them. Skip: cognitive/carer/spinal/wb/palliative are
    // already individually flagged above. Kept as a safety net for future
    // status flag additions.
    if has_any_status_flag(data)
        && !data.recommendations.status_flags.cognitive_impairment
        && !data.recommendations.status_flags.carer_dependent
        && !data.recommendations.status_flags.spinal_precautions
        && !data.recommendations.status_flags.weight_bearing_restrictions
        && !data.recommendations.status_flags.palliative_care
    {
        flags.push(FlaggedIssue {
            id: "FLAG-STAT-000".into(),
            category: "Status".into(),
            message: "A status flag is set for this patient - review recommendations carefully."
                .into(),
            priority: FlagPriority::Low,
        });
    }

    fn order(p: FlagPriority) -> u8 {
        match p {
            FlagPriority::Urgent => 0,
            FlagPriority::High => 1,
            FlagPriority::Medium => 2,
            FlagPriority::Low => 3,
        }
    }
    flags.sort_by_key(|f| order(f.priority));
    flags
}
