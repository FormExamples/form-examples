use super::types::{AdditionalFlag, AssessmentData};
use super::utils::calculate_age;

/// Detect Organ Donation Assessment safety flags. Independent of rule
/// firing, these surface clinician-facing alerts for safety-critical
/// findings.
///
/// Priorities (sorted high > medium > low):
///   - high   — absolute contraindications and safety-critical findings
///   - medium — extended-criteria markers, modest organ dysfunction,
///              CMV/EBV mismatch, etc.
///   - low    — advanced age, controlled hypertension, mild dyslipidaemia
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let is_living = data.donor_type_registration.donor_type == "living";

    // ─── Demographics ───────────────────────────────────────────
    let age = calculate_age(&data.demographics.date_of_birth);
    if let Some(a) = age {
        if a > 70 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-001".to_string(),
                category: "Demographics".to_string(),
                message: format!(
                    "Donor age {a} years — extended-criteria donor; review organ-specific suitability."
                ),
                priority: "medium".to_string(),
            });
        } else if a >= 60 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-002".to_string(),
                category: "Demographics".to_string(),
                message: format!(
                    "Donor age {a} years — advanced age; expanded-criteria donor."
                ),
                priority: "low".to_string(),
            });
        }
        if is_living && a < 18 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-003".to_string(),
                category: "Demographics".to_string(),
                message: format!(
                    "Living donor age {a} years — minor cannot give legal consent under HTA Act 2004."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(b) = data.demographics.bmi {
        if b >= 35.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-004".to_string(),
                category: "Demographics".to_string(),
                message: format!(
                    "BMI {b} — obesity increases anaesthetic and surgical risk."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Medical history ────────────────────────────────────────
    let mh = &data.medical_history;
    if mh.has_malignancy == "yes" && mh.has_cns_malignancy != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Medical History".to_string(),
            message: "Active non-CNS malignancy — absolute contraindication for organ donation.".to_string(),
            priority: "high".to_string(),
        });
    }
    if mh.has_cjd_risk == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-002".to_string(),
            category: "Medical History".to_string(),
            message: "CJD risk identified — transmission risk; donation contraindicated.".to_string(),
            priority: "high".to_string(),
        });
    }
    if mh.has_uncontrolled_sepsis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-003".to_string(),
            category: "Medical History".to_string(),
            message: "Uncontrolled sepsis — absolute contraindication for organ donation.".to_string(),
            priority: "high".to_string(),
        });
    }
    if mh.has_active_infection == "yes" && mh.has_uncontrolled_sepsis != "yes" {
        let detail = if mh.active_infection_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            mh.active_infection_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-MH-004".to_string(),
            category: "Medical History".to_string(),
            message: format!("Active infection: {detail} — review before proceeding."),
            priority: "medium".to_string(),
        });
    }
    if mh.has_autoimmune_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-005".to_string(),
            category: "Medical History".to_string(),
            message: "Autoimmune disease — risk of disease transmission; review with transplant team.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if mh.has_diabetes == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-006".to_string(),
            category: "Medical History".to_string(),
            message: "Diabetes mellitus — extended-criteria donor for kidney/pancreas.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if mh.has_hypertension == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-007".to_string(),
            category: "Medical History".to_string(),
            message: "Hypertension present — extended-criteria donor; assess end-organ damage.".to_string(),
            priority: "low".to_string(),
        });
    }
    if mh.has_cardiovascular_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-008".to_string(),
            category: "Medical History".to_string(),
            message: "Cardiovascular disease — review fitness for surgery and organ-specific suitability.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if mh.iv_drug_use_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-009".to_string(),
            category: "Medical History".to_string(),
            message: "IV drug use history — increased viral transmission risk; extend NAT screening.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Organ function ─────────────────────────────────────────
    let of = &data.organ_function;
    if of.severe_organ_failure == "yes" {
        let detail = if of.severe_organ_failure_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            of.severe_organ_failure_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-OF-001".to_string(),
            category: "Organ Function".to_string(),
            message: format!(
                "Severe organ failure incompatible with donation: {detail}."
            ),
            priority: "high".to_string(),
        });
    }
    if let Some(v) = of.egfr {
        if v < 60.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-OF-002".to_string(),
                category: "Organ Function".to_string(),
                message: format!(
                    "eGFR {v} mL/min/1.73m² — renal dysfunction; kidney donation not recommended."
                ),
                priority: "medium".to_string(),
            });
        } else if v < 90.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-OF-003".to_string(),
                category: "Organ Function".to_string(),
                message: format!(
                    "eGFR {v} mL/min/1.73m² — mild renal impairment; review."
                ),
                priority: "low".to_string(),
            });
        }
    }
    if let Some(v) = of.alt {
        if v > 120.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-OF-004".to_string(),
                category: "Organ Function".to_string(),
                message: format!(
                    "ALT {v} U/L — significantly elevated; investigate hepatic function."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(v) = of.ejection_fraction {
        if v < 50.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-OF-005".to_string(),
                category: "Organ Function".to_string(),
                message: format!(
                    "Ejection fraction {v}% — reduced; heart donation unlikely."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(v) = of.pao2_fio2_ratio {
        if v < 300.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-OF-006".to_string(),
                category: "Organ Function".to_string(),
                message: format!(
                    "PaO2/FiO2 ratio {v} — impaired gas exchange; review lung suitability."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(v) = of.hba1c {
        if v > 6.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-OF-007".to_string(),
                category: "Organ Function".to_string(),
                message: format!(
                    "HbA1c {v}% — diabetes-range; consider impact on pancreas/kidney donation."
                ),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Infectious disease ─────────────────────────────────────
    let id = &data.infectious_disease_screening;
    // Loop preserving the JS-style IDs `FLAG-ID-<camelCaseField>`.
    let positive_labels: &[(&str, &str, &str)] = &[
        ("hivStatus", "HIV", &id.hiv_status),
        ("hbsAg", "Hepatitis B (HBsAg)", &id.hbs_ag),
        ("hbcAb", "Hepatitis B (anti-HBc)", &id.hbc_ab),
        ("hcvAb", "Hepatitis C antibody", &id.hcv_ab),
        ("htlvStatus", "HTLV", &id.htlv_status),
        ("syphilisScreen", "Syphilis", &id.syphilis_screen),
        ("tuberculosisScreen", "Tuberculosis", &id.tuberculosis_screen),
    ];
    for (key, label, value) in positive_labels {
        if *value == "positive" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-ID-{key}"),
                category: "Infectious Disease".to_string(),
                message: format!("{label} screen positive — typically contraindicates donation."),
                priority: "high".to_string(),
            });
        }
    }
    if id.cmv_status == "positive" {
        flags.push(AdditionalFlag {
            id: "FLAG-ID-CMV".to_string(),
            category: "Infectious Disease".to_string(),
            message: "CMV positive donor — review for D+/R- mismatch and prophylaxis plan.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if id.ebv_status == "positive" {
        flags.push(AdditionalFlag {
            id: "FLAG-ID-EBV".to_string(),
            category: "Infectious Disease".to_string(),
            message: "EBV positive donor — review for D+/R- mismatch (PTLD risk).".to_string(),
            priority: "medium".to_string(),
        });
    }
    if id.recent_infection == "yes" {
        let detail = if id.infection_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            id.infection_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ID-INF".to_string(),
            category: "Infectious Disease".to_string(),
            message: format!("Recent infection: {detail} — defer until resolved."),
            priority: "medium".to_string(),
        });
    }
    if id.recent_travel == "yes" {
        let detail = if id.travel_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            id.travel_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ID-TRV".to_string(),
            category: "Infectious Disease".to_string(),
            message: format!("Recent travel: {detail} — review for endemic disease exposure."),
            priority: "low".to_string(),
        });
    }

    // ─── Immunological ──────────────────────────────────────────
    let im = &data.immunological_assessment;
    if im.abo_compatibility == "incompatible" {
        flags.push(AdditionalFlag {
            id: "FLAG-IM-001".to_string(),
            category: "Immunological".to_string(),
            message: "ABO incompatibility — absolute contraindication unless desensitisation programme used.".to_string(),
            priority: "high".to_string(),
        });
    }
    if im.crossmatch_result == "incompatible" {
        flags.push(AdditionalFlag {
            id: "FLAG-IM-002".to_string(),
            category: "Immunological".to_string(),
            message: "Positive crossmatch — donor-specific antibodies; donation contraindicated.".to_string(),
            priority: "high".to_string(),
        });
    }
    if im.donor_specific_antibodies == "yes" {
        let detail = if im.dsa_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            im.dsa_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-IM-003".to_string(),
            category: "Immunological".to_string(),
            message: format!("Donor-specific antibodies present: {detail}."),
            priority: "medium".to_string(),
        });
    }
    if let Some(v) = im.pra {
        if v > 50.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-IM-004".to_string(),
                category: "Immunological".to_string(),
                message: format!(
                    "PRA {v}% — highly sensitised recipient; matching difficult."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Surgical / anaesthetic ─────────────────────────────────
    let su = &data.surgical_assessment;
    if su.asa_grade == "IV" || su.asa_grade == "V" {
        flags.push(AdditionalFlag {
            id: "FLAG-SU-001".to_string(),
            category: "Surgical".to_string(),
            message: format!(
                "ASA Grade {} — life-threatening systemic disease; surgical risk extreme.",
                su.asa_grade
            ),
            priority: "high".to_string(),
        });
    } else if su.asa_grade == "III" {
        flags.push(AdditionalFlag {
            id: "FLAG-SU-002".to_string(),
            category: "Surgical".to_string(),
            message: "ASA Grade III — severe systemic disease; high surgical risk.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if su.anaesthetic_complications == "yes" {
        let detail = if su.complication_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            su.complication_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-SU-003".to_string(),
            category: "Surgical".to_string(),
            message: format!("Previous anaesthetic complications: {detail}."),
            priority: "medium".to_string(),
        });
    }
    if su.mallampati_score == "III" || su.mallampati_score == "IV" {
        flags.push(AdditionalFlag {
            id: "FLAG-SU-004".to_string(),
            category: "Surgical".to_string(),
            message: format!(
                "Mallampati {} — anticipate difficult airway.",
                su.mallampati_score
            ),
            priority: "medium".to_string(),
        });
    }
    if su.surgical_fitness == "abnormal" {
        let detail = if su.surgical_fitness_notes.trim().is_empty() {
            "details not provided".to_string()
        } else {
            su.surgical_fitness_notes.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-SU-005".to_string(),
            category: "Surgical".to_string(),
            message: format!("Abnormal surgical fitness assessment: {detail}."),
            priority: "medium".to_string(),
        });
    }
    if su.smoking_status == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-SU-006".to_string(),
            category: "Surgical".to_string(),
            message: "Current smoker — increased peri-operative respiratory risk.".to_string(),
            priority: "low".to_string(),
        });
    }
    if su.alcohol_use == "heavy" {
        flags.push(AdditionalFlag {
            id: "FLAG-SU-007".to_string(),
            category: "Surgical".to_string(),
            message: "Heavy alcohol use — review hepatic function and withdrawal risk.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Psychological (Living donor only) ──────────────────────
    if is_living {
        let ps = &data.psychological_assessment;
        if ps.coercion_concerns == "yes" {
            let detail = if ps.coercion_details.trim().is_empty() {
                "details not provided".to_string()
            } else {
                ps.coercion_details.clone()
            };
            flags.push(AdditionalFlag {
                id: "FLAG-PS-001".to_string(),
                category: "Psychological".to_string(),
                message: format!(
                    "Coercion concerns identified: {detail} — escalate; donation must not proceed."
                ),
                priority: "high".to_string(),
            });
        }
        if ps.mental_capacity_confirmed == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-002".to_string(),
                category: "Psychological".to_string(),
                message: "Mental capacity not confirmed — informed consent invalid; donation must not proceed.".to_string(),
                priority: "high".to_string(),
            });
        }
        if ps.willing_to_proceed == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-003".to_string(),
                category: "Psychological".to_string(),
                message: "Donor unwilling to proceed — donation must not occur.".to_string(),
                priority: "high".to_string(),
            });
        }
        if ps.ambivalence == "yes" {
            let detail = if ps.ambivalence_details.trim().is_empty() {
                "details not provided".to_string()
            } else {
                ps.ambivalence_details.clone()
            };
            flags.push(AdditionalFlag {
                id: "FLAG-PS-004".to_string(),
                category: "Psychological".to_string(),
                message: format!(
                    "Donor ambivalence: {detail} — allow time and offer further counselling."
                ),
                priority: "medium".to_string(),
            });
        }
        if ps.understands_procedure == "no" || ps.understands_risks == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-005".to_string(),
                category: "Psychological".to_string(),
                message: "Donor does not fully understand procedure or risks — additional counselling required before consent.".to_string(),
                priority: "medium".to_string(),
            });
        }
        if ps.anxiety_about_procedure == "severe" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-006".to_string(),
                category: "Psychological".to_string(),
                message: "Severe anxiety about procedure — psychological support recommended.".to_string(),
                priority: "medium".to_string(),
            });
        }
        if ps.support_network == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-007".to_string(),
                category: "Psychological".to_string(),
                message: "No support network identified — arrange additional aftercare.".to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Ethical & legal (Living donor only) ────────────────────
    if is_living {
        let el = &data.ethical_legal_requirements;
        if el.hta_act_2004_compliant == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-EL-001".to_string(),
                category: "Ethical / Legal".to_string(),
                message: "HTA Act 2004 compliance not confirmed — donation cannot proceed.".to_string(),
                priority: "high".to_string(),
            });
        }
        if el.informed_consent_given == "no" || el.consent_form_signed == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-EL-002".to_string(),
                category: "Ethical / Legal".to_string(),
                message: "Informed consent incomplete — donation cannot proceed without signed consent.".to_string(),
                priority: "high".to_string(),
            });
        }
        if el.financial_reward_check == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-EL-003".to_string(),
                category: "Ethical / Legal".to_string(),
                message: "Financial reward / inducement check not satisfied — HTA Act 2004 prohibits reward; escalate to donor advocate.".to_string(),
                priority: "high".to_string(),
            });
        }
        if el.independent_assessor_review == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-EL-004".to_string(),
                category: "Ethical / Legal".to_string(),
                message: "Independent assessor review not yet completed — required before HTA approval.".to_string(),
                priority: "medium".to_string(),
            });
        }
        if el.questions_answered == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-EL-005".to_string(),
                category: "Ethical / Legal".to_string(),
                message: "Donor questions not yet answered — complete counselling before consent.".to_string(),
                priority: "medium".to_string(),
            });
        }
        if el.ethics_committee_approval == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-EL-006".to_string(),
                category: "Ethical / Legal".to_string(),
                message: "Ethics committee approval not yet received.".to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Eligibility decision ───────────────────────────────────
    let ea = &data.eligibility_allocation;
    if ea.eligibility_decision == "unsuitable" {
        let reason = if ea.deferral_reason.trim().is_empty() {
            "reason not provided".to_string()
        } else {
            ea.deferral_reason.clone()
        };
        let duration = if ea.deferral_duration.trim().is_empty() {
            "duration not specified".to_string()
        } else {
            ea.deferral_duration.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-EA-001".to_string(),
            category: "Eligibility".to_string(),
            message: format!("Assessor recorded UNSUITABLE: {reason} ({duration})."),
            priority: "high".to_string(),
        });
    } else if ea.eligibility_decision == "conditionally-suitable" {
        let conditions = if ea.eligibility_conditions.trim().is_empty() {
            "conditions not specified".to_string()
        } else {
            ea.eligibility_conditions.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-EA-002".to_string(),
            category: "Eligibility".to_string(),
            message: format!("Assessor recorded CONDITIONALLY SUITABLE: {conditions}."),
            priority: "medium".to_string(),
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
