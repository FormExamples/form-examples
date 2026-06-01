use super::types::{AdditionalFlag, AssessmentData};
use super::utils::calculate_age;

/// Detect bone marrow donation safety flags. Flag IDs mirror the canonical
/// JS engine in `front-end-form-with-html/js/flagged-issues.js` verbatim.
/// Priority order returned: high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HLA / matching ─────────────────────────────────────────
    let hla = &data.donor_registration_hla_typing;
    if hla.crossmatch_result == "positive" {
        flags.push(AdditionalFlag {
            id: "FLAG-HLA-001".to_string(),
            category: "HLA Matching".to_string(),
            message: "Positive crossmatch — donor-specific antibodies present; donation contraindicated.".to_string(),
            priority: "high".to_string(),
        });
    }
    if hla.hla_match_level == "7-of-10" {
        flags.push(AdditionalFlag {
            id: "FLAG-HLA-002".to_string(),
            category: "HLA Matching".to_string(),
            message: "7/10 HLA match — three antigen mismatches; high GvHD / rejection risk.".to_string(),
            priority: "high".to_string(),
        });
    }
    if hla.hla_match_level == "haploidentical" {
        flags.push(AdditionalFlag {
            id: "FLAG-HLA-003".to_string(),
            category: "HLA Matching".to_string(),
            message: "Haploidentical match — high GvHD risk; specialist conditioning required.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Demographics ───────────────────────────────────────────
    let age = calculate_age(&data.demographics.date_of_birth);
    if let Some(a) = age {
        if a < 18 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-001".to_string(),
                category: "Demographics".to_string(),
                message: format!(
                    "Donor age {a} years — minor; specialist paediatric donor pathway required."
                ),
                priority: "high".to_string(),
            });
        } else if a > 60 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-002".to_string(),
                category: "Demographics".to_string(),
                message: format!("Donor age {a} years — increased peri-procedural risk."),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(bmi) = data.demographics.bmi {
        if bmi >= 35.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-DM-003".to_string(),
                category: "Demographics".to_string(),
                message: format!(
                    "BMI {bmi} — obesity increases anaesthetic and harvest risk."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Medical history ────────────────────────────────────────
    let mh = &data.medical_history;
    if mh.has_malignancy == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Medical History".to_string(),
            message: "History of malignancy — typically contraindicates donation.".to_string(),
            priority: "high".to_string(),
        });
    }
    if mh.has_bleeding_disorder == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-002".to_string(),
            category: "Medical History".to_string(),
            message: "Bleeding disorder — contraindicates marrow harvest under anaesthetic.".to_string(),
            priority: "high".to_string(),
        });
    }
    if mh.has_autoimmune_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-003".to_string(),
            category: "Medical History".to_string(),
            message: "Autoimmune disease — risk of transfer; review with transplant team.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if mh.has_cardiovascular_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-004".to_string(),
            category: "Medical History".to_string(),
            message: "Cardiovascular disease — anaesthetic / fluid-shift risk.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if mh.has_renal_disease == "yes" || mh.has_hepatic_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-005".to_string(),
            category: "Medical History".to_string(),
            message: "Renal or hepatic disease present — review fitness for G-CSF and anaesthetic.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Physical examination ───────────────────────────────────
    let pe = &data.physical_examination;
    if pe.general_appearance == "acutely-unwell" {
        flags.push(AdditionalFlag {
            id: "FLAG-PE-001".to_string(),
            category: "Physical Examination".to_string(),
            message: "Donor acutely unwell — defer donation pending recovery.".to_string(),
            priority: "high".to_string(),
        });
    }
    if let Some(o2) = pe.oxygen_saturation {
        if o2 < 95 {
            flags.push(AdditionalFlag {
                id: "FLAG-PE-002".to_string(),
                category: "Physical Examination".to_string(),
                message: format!("SpO2 {o2}% — investigate before anaesthetic."),
                priority: "high".to_string(),
            });
        }
    }
    if pe.cardiovascular_examination == "abnormal" {
        flags.push(AdditionalFlag {
            id: "FLAG-PE-003".to_string(),
            category: "Physical Examination".to_string(),
            message: "Abnormal cardiovascular examination — review before anaesthetic.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if pe.respiratory_examination == "abnormal" {
        flags.push(AdditionalFlag {
            id: "FLAG-PE-004".to_string(),
            category: "Physical Examination".to_string(),
            message: "Abnormal respiratory examination — review before anaesthetic.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if pe.posterior_iliac_crest_assessment == "unsuitable" {
        flags.push(AdditionalFlag {
            id: "FLAG-PE-005".to_string(),
            category: "Physical Examination".to_string(),
            message: "Posterior iliac crest unsuitable — consider PBSC route instead of harvest.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if pe.venous_access_assessment == "poor" {
        flags.push(AdditionalFlag {
            id: "FLAG-PE-006".to_string(),
            category: "Physical Examination".to_string(),
            message: "Poor peripheral venous access — central line likely required for apheresis.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Haematological ─────────────────────────────────────────
    let hm = &data.haematological_assessment;
    if let Some(hb) = hm.haemoglobin {
        if hb < 10.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HM-001".to_string(),
                category: "Haematology".to_string(),
                message: format!(
                    "Severely low haemoglobin ({hb} g/dL) — defer donation."
                ),
                priority: "high".to_string(),
            });
        } else if hb < 12.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HM-002".to_string(),
                category: "Haematology".to_string(),
                message: format!(
                    "Low haemoglobin ({hb} g/dL) — investigate and optimise iron stores."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(plt) = hm.platelet_count {
        if plt < 150.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HM-003".to_string(),
                category: "Haematology".to_string(),
                message: format!(
                    "Low platelets ({plt} x10^9/L) — bleeding risk for harvest."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if hm.coagulation_screen == "abnormal" {
        flags.push(AdditionalFlag {
            id: "FLAG-HM-004".to_string(),
            category: "Haematology".to_string(),
            message: "Abnormal coagulation screen — bleeding risk for marrow harvest.".to_string(),
            priority: "high".to_string(),
        });
    }
    if hm.liver_function == "abnormal" {
        flags.push(AdditionalFlag {
            id: "FLAG-HM-005".to_string(),
            category: "Haematology".to_string(),
            message: "Abnormal liver function — review fitness for G-CSF and anaesthetic.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if let Some(cr) = hm.creatinine {
        if cr > 120.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HM-006".to_string(),
                category: "Haematology".to_string(),
                message: format!(
                    "Elevated creatinine ({cr} umol/L) — review renal function."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Infectious disease ─────────────────────────────────────
    let id = &data.infectious_disease_screening;
    let positives: [(&str, &str, &str); 7] = [
        ("hivStatus", id.hiv_status.as_str(), "HIV"),
        (
            "hepatitisBSurfaceAntigen",
            id.hepatitis_b_surface_antigen.as_str(),
            "Hepatitis B (HBsAg)",
        ),
        (
            "hepatitisBCoreAntibody",
            id.hepatitis_b_core_antibody.as_str(),
            "Hepatitis B (anti-HBc)",
        ),
        (
            "hepatitisCAbntibody",
            id.hepatitis_c_abntibody.as_str(),
            "Hepatitis C antibody",
        ),
        ("htlvStatus", id.htlv_status.as_str(), "HTLV"),
        ("syphilisScreen", id.syphilis_screen.as_str(), "Syphilis"),
        (
            "tuberculosisScreen",
            id.tuberculosis_screen.as_str(),
            "Tuberculosis",
        ),
    ];
    for (key, value, label) in positives {
        if value == "positive" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-ID-{key}"),
                category: "Infectious Disease".to_string(),
                message: format!(
                    "{label} screen positive — typically contraindicates donation."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if id.recent_infection == "yes" {
        let detail = if id.infection_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            id.infection_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ID-007".to_string(),
            category: "Infectious Disease".to_string(),
            message: format!("Recent infection: {detail} — defer until resolved."),
            priority: "medium".to_string(),
        });
    }
    if id.recent_travel == "yes" {
        let detail = if id.travel_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            id.travel_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ID-008".to_string(),
            category: "Infectious Disease".to_string(),
            message: format!(
                "Recent travel reported: {detail} — review for exposure-related deferral."
            ),
            priority: "low".to_string(),
        });
    }
    if id.vaccination_up_to_date == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ID-009".to_string(),
            category: "Infectious Disease".to_string(),
            message: "Vaccinations not up to date — review pre-donation immunisation schedule.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Anaesthetic ────────────────────────────────────────────
    let an = &data.anaesthetic_assessment;
    if an.asa_grade == "III" || an.asa_grade == "IV" {
        flags.push(AdditionalFlag {
            id: "FLAG-AN-001".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!(
                "ASA Grade {} — high anaesthetic risk for marrow harvest.",
                an.asa_grade
            ),
            priority: "high".to_string(),
        });
    }
    if an.anaesthetic_complications == "yes" {
        let detail = if an.complication_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            an.complication_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-AN-002".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!("Previous anaesthetic complications: {detail}."),
            priority: "high".to_string(),
        });
    }
    if an.mallampati_score == "III" || an.mallampati_score == "IV" {
        flags.push(AdditionalFlag {
            id: "FLAG-AN-003".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!(
                "Mallampati {} — anticipate difficult airway.",
                an.mallampati_score
            ),
            priority: "medium".to_string(),
        });
    }
    if an.airway_concerns == "yes" {
        let detail = if an.airway_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            an.airway_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-AN-004".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!("Airway concerns: {detail}."),
            priority: "medium".to_string(),
        });
    }
    if an.family_anaesthetic_problems == "yes" {
        let detail = if an.family_problem_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            an.family_problem_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-AN-005".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!(
                "Family history of anaesthetic problems: {detail} — consider malignant hyperthermia screening."
            ),
            priority: "medium".to_string(),
        });
    }
    if an.smoking_status == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-AN-006".to_string(),
            category: "Anaesthetic".to_string(),
            message: "Current smoker — increased anaesthetic / respiratory risk.".to_string(),
            priority: "low".to_string(),
        });
    }
    if an.alcohol_use == "heavy" {
        flags.push(AdditionalFlag {
            id: "FLAG-AN-007".to_string(),
            category: "Anaesthetic".to_string(),
            message: "Heavy alcohol use — review hepatic function and withdrawal risk.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Collection method ──────────────────────────────────────
    let cm = &data.collection_method_assessment;
    if cm.gcsf_eligible == "no" {
        let detail = if cm.gcsf_contraindications.trim().is_empty() {
            "contraindications not specified".to_string()
        } else {
            cm.gcsf_contraindications.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-CM-001".to_string(),
            category: "Collection Method".to_string(),
            message: format!("G-CSF ineligible: {detail} — PBSC not feasible."),
            priority: "high".to_string(),
        });
    }
    if cm.venous_access_suitable_for_apheresis == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CM-002".to_string(),
            category: "Collection Method".to_string(),
            message: "Venous access unsuitable for apheresis — central line required if PBSC chosen.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if cm.central_line_required == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CM-003".to_string(),
            category: "Collection Method".to_string(),
            message: "Central line required — additional procedural risk.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Psychological readiness ────────────────────────────────
    let ps = &data.psychological_readiness;
    if ps.coercion_concerns == "yes" {
        let detail = if ps.coercion_details.trim().is_empty() {
            "details not provided".to_string()
        } else {
            ps.coercion_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-PS-001".to_string(),
            category: "Psychological".to_string(),
            message: format!(
                "Coercion concerns identified: {detail} — escalate to donor advocate."
            ),
            priority: "high".to_string(),
        });
    }
    if ps.understands_procedure == "no" || ps.understands_risks == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-002".to_string(),
            category: "Psychological".to_string(),
            message: "Donor does not fully understand procedure or risks — additional counselling required before consent.".to_string(),
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
    } else if ps.willing_to_proceed == "undecided" {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-004".to_string(),
            category: "Psychological".to_string(),
            message: "Donor undecided — allow time and offer further counselling.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if ps.anxiety_about_procedure == "severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-005".to_string(),
            category: "Psychological".to_string(),
            message: "Severe anxiety about procedure — psychological support recommended.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if ps.support_network == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-006".to_string(),
            category: "Psychological".to_string(),
            message: "No support network identified — arrange additional aftercare.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if ps.donor_advocate_consulted == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-007".to_string(),
            category: "Psychological".to_string(),
            message: "Donor advocate not yet consulted — required prior to consent for unrelated donation.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Consent & eligibility ──────────────────────────────────
    let ce = &data.consent_eligibility;
    if ce.informed_consent_given == "no" || ce.consent_form_signed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CE-001".to_string(),
            category: "Consent".to_string(),
            message: "Informed consent incomplete — donation cannot proceed without signed consent.".to_string(),
            priority: "high".to_string(),
        });
    }
    if ce.questions_answered == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CE-002".to_string(),
            category: "Consent".to_string(),
            message: "Donor questions not yet answered — complete counselling before consent.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if ce.eligibility_decision == "unsuitable" {
        let reason = if ce.deferral_reason.trim().is_empty() {
            "reason not provided".to_string()
        } else {
            ce.deferral_reason.trim().to_string()
        };
        let duration = if ce.deferral_duration.trim().is_empty() {
            "duration not specified".to_string()
        } else {
            ce.deferral_duration.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-CE-003".to_string(),
            category: "Eligibility".to_string(),
            message: format!(
                "Assessor recorded UNSUITABLE: {reason} ({duration})."
            ),
            priority: "high".to_string(),
        });
    } else if ce.eligibility_decision == "conditionally-suitable" {
        let conditions = if ce.eligibility_conditions.trim().is_empty() {
            "conditions not specified".to_string()
        } else {
            ce.eligibility_conditions.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-CE-004".to_string(),
            category: "Eligibility".to_string(),
            message: format!(
                "Assessor recorded CONDITIONALLY SUITABLE: {conditions}."
            ),
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
