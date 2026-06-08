//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect WHO Surgical Safety Checklist safety flags. These are computed
/// independently of phase completion — they alert the operating team to
/// items that require explicit attention regardless of how far through the
/// checklist they are. Priority: high > medium > low.
///
/// Flag catalogue (per WHO *Safe Surgery Saves Lives Starter Kit*):
///
/// - FLAG-ID-001  — Sign In #1 unanswered or "no"
/// - FLAG-SITE-001 — Sign In #2 = "no" (site not marked and not bilateral/midline/NA)
/// - FLAG-ANAES-001 — Sign In #3 = "no"
/// - FLAG-OXI-001  — Sign In #4 = "no"
/// - FLAG-ALL-001  — Sign In #5 = "yes" (known allergy)
/// - FLAG-AIR-001  — Sign In #6 = "yes" (difficult airway risk)
/// - FLAG-BL-001   — Sign In #7 = "yes" (high blood-loss risk)
/// - FLAG-ABX-001  — Time Out #3 = "no"
/// - FLAG-STER-001 — Time Out #8 = "no"
/// - FLAG-IMG-001  — Time Out #10 = "no"
/// - FLAG-CNT-001  — Sign Out #2 = "no" (count discrepancy)
/// - FLAG-SPEC-001 — Sign Out #3 = "no"
/// - FLAG-EQP-001  — Sign Out #4 has content (equipment problem)
/// - FLAG-ABA-001  — Case abandoned before sign-out
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH PRIORITY ─────────────────────────────────────────────

    if data.sign_in.identity_site_procedure_consent != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ID-001".to_string(),
            category: "Identity".to_string(),
            message: "Patient identity, site, procedure, and consent NOT confirmed before induction".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.sign_in.anaesthesia_check_complete != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ANAES-001".to_string(),
            category: "Anaesthesia".to_string(),
            message: "Anaesthesia machine and medication check NOT confirmed complete".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.sign_in.pulse_oximeter_on_patient != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-OXI-001".to_string(),
            category: "Monitoring".to_string(),
            message: "Pulse oximeter NOT confirmed on the patient and functioning".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.sign_in.known_allergy == "yes" {
        let detail = if data.sign_in.known_allergy_detail.trim().is_empty() {
            "no details recorded".to_string()
        } else {
            data.sign_in.known_allergy_detail.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ALL-001".to_string(),
            category: "Allergy".to_string(),
            message: format!("Known patient allergy flagged: {detail}"),
            priority: "high".to_string(),
        });
    }

    if data.sign_in.difficult_airway_aspiration_risk == "yes-equipment-available" {
        flags.push(AdditionalFlag {
            id: "FLAG-AIR-001".to_string(),
            category: "Airway".to_string(),
            message: "Difficult airway or aspiration risk identified — confirm equipment and assistance available".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.sign_in.blood_loss_risk == "yes-two-ivs-and-fluids-planned" {
        flags.push(AdditionalFlag {
            id: "FLAG-BL-001".to_string(),
            category: "Blood Loss".to_string(),
            message: "High blood-loss risk identified — confirm two IV access points and fluids/blood are planned".to_string(),
            priority: "high".to_string(),
        });
    }

    if !data.time_out.antibiotic_prophylaxis_within_60min.is_empty()
        && data.time_out.antibiotic_prophylaxis_within_60min != "yes"
        && data.time_out.antibiotic_prophylaxis_within_60min != "not-applicable"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-ABX-001".to_string(),
            category: "Antibiotic Prophylaxis".to_string(),
            message: "Antibiotic prophylaxis NOT given within the last 60 minutes".to_string(),
            priority: "high".to_string(),
        });
    }

    if !data.time_out.nursing_sterility_confirmed.is_empty()
        && data.time_out.nursing_sterility_confirmed != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-STER-001".to_string(),
            category: "Sterility".to_string(),
            message: "Sterility (including indicator results) NOT confirmed by nursing team".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.sign_out.counts_confirmed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CNT-001".to_string(),
            category: "Counts".to_string(),
            message: "COUNT DISCREPANCY: instrument, sponge, or needle counts NOT confirmed correct".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.sign_out.specimens_labelled == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SPEC-001".to_string(),
            category: "Specimens".to_string(),
            message: "Specimen labelling NOT confirmed correct (read aloud including patient name)".to_string(),
            priority: "high".to_string(),
        });
    }

    if !data.case_details.abandoned_reason.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-ABA-001".to_string(),
            category: "Lifecycle".to_string(),
            message: format!(
                "Case abandoned before sign-out: {}",
                data.case_details.abandoned_reason.trim()
            ),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM PRIORITY ────────────────────────────────────────────

    if data.sign_in.site_marked == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SITE-001".to_string(),
            category: "Site Marking".to_string(),
            message: "Surgical site NOT marked and laterality not declared as bilateral / midline / NA".to_string(),
            priority: "medium".to_string(),
        });
    }

    if !data.time_out.essential_imaging_displayed.is_empty()
        && data.time_out.essential_imaging_displayed != "yes"
        && data.time_out.essential_imaging_displayed != "not-applicable"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-IMG-001".to_string(),
            category: "Imaging".to_string(),
            message: "Essential imaging NOT displayed in the operating room".to_string(),
            priority: "medium".to_string(),
        });
    }

    if !data.sign_out.equipment_problems.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-EQP-001".to_string(),
            category: "Equipment".to_string(),
            message: format!(
                "Equipment problem noted at sign-out: {}",
                data.sign_out.equipment_problems.trim()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW PRIORITY ───────────────────────────────────────────────

    if !data.sign_out.recovery_concerns.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-REC-001".to_string(),
            category: "Recovery".to_string(),
            message: format!(
                "Recovery / management concerns flagged: {}",
                data.sign_out.recovery_concerns.trim()
            ),
            priority: "low".to_string(),
        });
    }

    if !data.time_out.nursing_equipment_concerns.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-EQP-002".to_string(),
            category: "Equipment".to_string(),
            message: format!(
                "Nursing team raised equipment concerns at Time Out: {}",
                data.time_out.nursing_equipment_concerns.trim()
            ),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
