use chrono::NaiveDate;

use super::types::{AdditionalFlag, AssessmentData};

/// Detect hospital-discharge safety flags. These are independent of the
/// NICE NG27 completeness validator and raise clinician-facing alerts for
/// safety-critical gaps and risk patterns. Flag IDs are preserved verbatim
/// from the front-end JavaScript implementation. Sorted urgent > high >
/// medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Safety-critical: medication reconciliation ────────────
    if data.discharge_medications.reconciliation_completed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-MEDS-001".to_string(),
            category: "Discharge Medications".to_string(),
            message: "Medication reconciliation NOT completed - high risk of medication error on discharge.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.discharge_medications.allergies_reviewed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-MEDS-002".to_string(),
            category: "Discharge Medications".to_string(),
            message: "Allergies NOT reviewed - serious safety concern.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if !data.discharge_medications.medications.is_empty()
        && data
            .discharge_medications
            .medications
            .iter()
            .any(|m| m.name.is_empty() || m.dose.is_empty() || m.frequency.is_empty())
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MEDS-003".to_string(),
            category: "Discharge Medications".to_string(),
            message: "One or more medications missing dose, route, or frequency.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Pending investigations without chase plan ──────────────
    if data.followup_arrangements.investigations_pending == "yes"
        && data.followup_arrangements.results_to_be_chased_by_gp != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-FU-001".to_string(),
            category: "Follow-up".to_string(),
            message: "Investigations pending but no clear plan for chasing results.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── No follow-up at all ────────────────────────────────────
    if data.followup_arrangements.gp_followup_required == "no"
        && data.followup_arrangements.outpatient_followup_required == "no"
        && data.followup_arrangements.appointments.is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-FU-002".to_string(),
            category: "Follow-up".to_string(),
            message: "No follow-up arranged - confirm this is appropriate for the diagnosis.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Diagnosis quality ──────────────────────────────────────
    let primary_dx_count = data
        .diagnoses
        .diagnoses
        .iter()
        .filter(|x| x.kind == "primary" && !x.description.is_empty())
        .count();
    if primary_dx_count == 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-DX-001".to_string(),
            category: "Diagnoses".to_string(),
            message: "No primary diagnosis recorded.".to_string(),
            priority: "high".to_string(),
        });
    } else if primary_dx_count > 1 {
        flags.push(AdditionalFlag {
            id: "FLAG-DX-002".to_string(),
            category: "Diagnoses".to_string(),
            message: format!(
                "{primary_dx_count} primary diagnoses recorded - typically only one is expected."
            ),
            priority: "medium".to_string(),
        });
    }

    if !data.diagnoses.diagnoses.is_empty()
        && data.diagnoses.diagnoses.iter().all(|x| x.icd10.is_empty())
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DX-003".to_string(),
            category: "Diagnoses".to_string(),
            message: "No ICD-10 codes assigned to any diagnosis - coding required for tariff and audit.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Discharge destination / vulnerability ──────────────────
    let destination = &data.community_care_instructions.discharge_destination;
    if (destination == "care-home" || destination == "nursing-home")
        && data.patient_acknowledgement.carer_informed != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DEST-001".to_string(),
            category: "Community Care".to_string(),
            message: "Discharge to care/nursing home but carer or care-home staff not informed.".to_string(),
            priority: "high".to_string(),
        });
    }

    if destination == "home"
        && data.community_care_instructions.care_responsibility == "self"
        && data.community_care_instructions.package_of_care_in_place != "yes"
        && (data.community_care_instructions.district_nurse_referral == "yes"
            || data.community_care_instructions.physiotherapy_referral == "yes"
            || data.community_care_instructions.occupational_therapy_referral == "yes")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DEST-002".to_string(),
            category: "Community Care".to_string(),
            message: "Patient self-caring at home with active community referrals but no package of care recorded.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Length of stay anomalies ───────────────────────────────
    let adm = &data.admission_summary.admission_date;
    let dis = &data.admission_summary.discharge_date;
    if !adm.is_empty() && !dis.is_empty() {
        if let (Ok(a), Ok(d)) = (
            NaiveDate::parse_from_str(adm, "%Y-%m-%d"),
            NaiveDate::parse_from_str(dis, "%Y-%m-%d"),
        ) {
            let days = (d - a).num_days();
            if days < 0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-DATE-001".to_string(),
                    category: "Admission Summary".to_string(),
                    message: "Discharge date is before admission date.".to_string(),
                    priority: "urgent".to_string(),
                });
            } else if days >= 21 {
                flags.push(AdditionalFlag {
                    id: "FLAG-DATE-002".to_string(),
                    category: "Admission Summary".to_string(),
                    message: format!(
                        "Length of stay {days} days - prolonged stay; review for delayed discharge."
                    ),
                    priority: "medium".to_string(),
                });
            }
        }
    }

    // ─── Sign-off integrity ─────────────────────────────────────
    if data.clinician_signoff.responsible_consultant_informed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SIGN-001".to_string(),
            category: "Clinician Sign-off".to_string(),
            message: "Responsible consultant NOT informed of discharge.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Patient comprehension ──────────────────────────────────
    if data.patient_acknowledgement.patient_understands_plan == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACK-001".to_string(),
            category: "Patient Acknowledgement".to_string(),
            message: "Patient does NOT confirm understanding of discharge plan.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.patient_acknowledgement.questions_answered == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACK-002".to_string(),
            category: "Patient Acknowledgement".to_string(),
            message: "Patient questions not yet fully answered.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.patient_acknowledgement.written_summary_provided == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACK-003".to_string(),
            category: "Patient Acknowledgement".to_string(),
            message: "No written discharge summary provided to patient.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Safety-netting ─────────────────────────────────────────
    if data.warning_signs.safety_neting_provided == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SAFE-001".to_string(),
            category: "Warning Signs".to_string(),
            message: "Safety-netting advice NOT provided - required by NICE NG27.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.warning_signs.written_info_given == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SAFE-002".to_string(),
            category: "Warning Signs".to_string(),
            message: "No written information given on warning signs.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: urgent > high > medium > low
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
