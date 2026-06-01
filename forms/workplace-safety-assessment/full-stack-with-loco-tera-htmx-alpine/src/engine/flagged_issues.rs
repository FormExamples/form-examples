// Flagged-issue detection. Independent of grade aggregation; raises
// auditor-facing flags prioritised as high / medium / low for findings
// that warrant targeted follow-up beyond the headline grade.
//
// Flag catalogue (per UK HSE workplace-safety audit, RIDDOR 2013):
//   HIGH    -> FLAG-FIRE-001, FLAG-FIRE-002, FLAG-ELEC-001, FLAG-ELEC-002,
//              FLAG-CHEM-001, FLAG-CHEM-002, FLAG-INC-001
//   MEDIUM  -> FLAG-PPE-001, FLAG-PPE-002, FLAG-PPE-003, FLAG-MH-001,
//              FLAG-TRN-001, FLAG-TRN-002, FLAG-INC-002, FLAG-INC-003
//   LOW     -> FLAG-SIG-001, FLAG-SIG-002, FLAG-HSK-001, FLAG-FIRE-003

use super::types::{AdditionalFlag, AssessmentData};

pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH-priority flags ──────────────────────────────────────
    if data.fire_safety.fire_extinguishers_serviced == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-FIRE-001".to_string(),
            category: "Fire Safety".to_string(),
            message: "Fire extinguishers have no current annual service record — immediate servicing required.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.fire_safety.emergency_egress_clear == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-FIRE-002".to_string(),
            category: "Fire Safety".to_string(),
            message: "Emergency egress route is blocked or obstructed — clear immediately and re-inspect.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.electrical_safety.damaged_equipment_observed == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ELEC-001".to_string(),
            category: "Electrical Safety".to_string(),
            message: "Damaged electrical equipment observed — quarantine and remove from service.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.electrical_safety.fixed_wiring_test_in_date == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ELEC-002".to_string(),
            category: "Electrical Safety".to_string(),
            message: "Fixed wiring test (EICR) is not in date — book a competent electrician.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.chemical_biological_hazards.untreated_spills_observed == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CHEM-001".to_string(),
            category: "Chemical & Biological".to_string(),
            message: "Untreated chemical or biological spill observed — clean up using spill kit and PPE.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.chemical_biological_hazards.coshh_register_present == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CHEM-002".to_string(),
            category: "Chemical & Biological".to_string(),
            message: "COSHH register is missing — required by the Control of Substances Hazardous to Health Regulations 2002.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.incident_reporting.riddor_reportable_incidents_reported == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-INC-001".to_string(),
            category: "Incident Reporting".to_string(),
            message: "RIDDOR-reportable incidents have not been reported to HSE — legal duty under RIDDOR 2013.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM-priority flags ────────────────────────────────────
    if data.ppe_hazard_controls.ppe_available == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PPE-001".to_string(),
            category: "PPE & Hazard Controls".to_string(),
            message: "Appropriate PPE is not available for the task — re-stock and retrain.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.ppe_hazard_controls.ppe_correctly_used == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PPE-002".to_string(),
            category: "PPE & Hazard Controls".to_string(),
            message: "PPE is not being correctly used — coaching and supervision required.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.ppe_hazard_controls.ppe_stock_maintained == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PPE-003".to_string(),
            category: "PPE & Hazard Controls".to_string(),
            message: "PPE stock levels inadequate — review re-order triggers.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.ergonomics_manual_handling.manual_handling_assessment_current == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Ergonomics & Manual Handling".to_string(),
            message: "Manual handling risk assessment is overdue — schedule reassessment.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.training_competence.mandatory_training_up_to_date == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRN-001".to_string(),
            category: "Training & Competence".to_string(),
            message: "Mandatory training is overdue for one or more staff — book refreshers.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.training_competence.infection_control_training_current == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRN-002".to_string(),
            category: "Training & Competence".to_string(),
            message: "Infection control training is not current — book refreshers.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.incident_reporting.near_miss_reporting_active == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-INC-002".to_string(),
            category: "Incident Reporting".to_string(),
            message: "Near-miss reporting is under-engaged — promote a no-blame reporting culture.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Disproportionately low near-miss vs incident counts also flag.
    if let (Some(incidents), Some(near_misses)) = (
        data.incident_reporting.incidents_last12_months,
        data.incident_reporting.near_misses_last12_months,
    ) {
        if incidents > 0 && near_misses < incidents {
            flags.push(AdditionalFlag {
                id: "FLAG-INC-003".to_string(),
                category: "Incident Reporting".to_string(),
                message: format!(
                    "Near-miss count ({near_misses}) is lower than incident count ({incidents}) — likely under-reporting."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── LOW-priority flags ───────────────────────────────────────
    if data.ppe_hazard_controls.signage_legible == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SIG-001".to_string(),
            category: "PPE & Hazard Controls".to_string(),
            message: "Signage is faded or illegible — replace at next opportunity.".to_string(),
            priority: "low".to_string(),
        });
    }

    if data.ppe_hazard_controls.hazard_signage_visible == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SIG-002".to_string(),
            category: "PPE & Hazard Controls".to_string(),
            message: "Hazard signage is missing in places — install where required.".to_string(),
            priority: "low".to_string(),
        });
    }

    if data.ppe_hazard_controls.housekeeping_satisfactory == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-HSK-001".to_string(),
            category: "PPE & Hazard Controls".to_string(),
            message: "Minor housekeeping issues observed — schedule a tidy-up.".to_string(),
            priority: "low".to_string(),
        });
    }

    if data.fire_safety.assembly_point_signposted == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-FIRE-003".to_string(),
            category: "Fire Safety".to_string(),
            message: "Assembly point is not clearly signposted — install signage.".to_string(),
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
