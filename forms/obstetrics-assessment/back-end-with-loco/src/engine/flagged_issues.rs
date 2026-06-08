//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect clinician-facing flags that are independent of the NG201 risk
/// stratification: safeguarding, mental-health, screening abnormalities,
/// fetal concerns, prophylaxis indications, and care-pathway escalations.
///
/// Priority order: urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Urgent safeguarding / mental-health ──────────────────
    if data.mental_health_assessment.self_harm_ideation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Mental Health".to_string(),
            message: "Self-harm or suicidal ideation disclosed - urgent perinatal mental health referral.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.lifestyle_social_factors.domestic_abuse == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SAFEGUARD-001".to_string(),
            category: "Safeguarding".to_string(),
            message: "Domestic abuse disclosed - follow local safeguarding pathway.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.lifestyle_social_factors.safeguarding_concerns == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SAFEGUARD-002".to_string(),
            category: "Safeguarding".to_string(),
            message: "Safeguarding concerns identified - refer to safeguarding midwife.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── High-priority fetal / obstetric ──────────────────────
    if data.fetal_assessment.reduced_fetal_movements == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-FETAL-001".to_string(),
            category: "Fetal Assessment".to_string(),
            message: "Reduced fetal movements - requires same-day assessment.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.fetal_assessment.growth_concern == "yes" {
        let detail = if data.fetal_assessment.growth_concern_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.fetal_assessment.growth_concern_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-FETAL-002".to_string(),
            category: "Fetal Assessment".to_string(),
            message: format!("Fetal growth concern: {detail}."),
            priority: "high".to_string(),
        });
    }

    if data.obstetric_history.previous_pre_eclampsia == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-OBS-001".to_string(),
            category: "Obstetric History".to_string(),
            message: "Previous pre-eclampsia - low-dose aspirin prophylaxis from 12 weeks indicated.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.obstetric_history.previous_preterm_birth == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-OBS-002".to_string(),
            category: "Obstetric History".to_string(),
            message: "Previous preterm birth - consider cervical surveillance and progesterone.".to_string(),
            priority: "high".to_string(),
        });
    }

    let sb = data.obstetric_history.previous_stillbirths.unwrap_or(0);
    let nd = data.obstetric_history.previous_neonatal_deaths.unwrap_or(0);
    if sb > 0 || nd > 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-OBS-003".to_string(),
            category: "Obstetric History".to_string(),
            message: "Previous stillbirth / neonatal death - bereavement support and consultant-led care.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Medical / VTE / pre-existing ─────────────────────────
    if data.medical_history.previous_vte == "yes" || data.medical_history.thrombophilia == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-VTE-001".to_string(),
            category: "Medical History".to_string(),
            message: "VTE history / thrombophilia - VTE risk assessment and LMWH prophylaxis review.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.medical_history.cardiac_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-001".to_string(),
            category: "Medical History".to_string(),
            message: "Cardiac disease - joint cardiology / obstetric care required.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.medical_history.pre_existing_diabetes == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-002".to_string(),
            category: "Medical History".to_string(),
            message: "Pre-existing diabetes - joint diabetes / obstetric clinic and high-dose folic acid.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.medical_history.chronic_hypertension == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-003".to_string(),
            category: "Medical History".to_string(),
            message: "Chronic hypertension - review antihypertensives, aspirin prophylaxis indicated.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.medical_history.renal_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-004".to_string(),
            category: "Medical History".to_string(),
            message: "Renal disease - joint nephrology / obstetric care.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.medical_history.hiv_positive == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-005".to_string(),
            category: "Medical History".to_string(),
            message: "HIV positive - liaison with HIV team for ART and delivery planning.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Screening abnormalities ──────────────────────────────
    if data.screening_results.combined_test_result == "higher-chance" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-001".to_string(),
            category: "Screening".to_string(),
            message: "Combined test higher chance - offer NIPT or diagnostic testing.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.screening_results.gtt_result == "gdm-confirmed" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-002".to_string(),
            category: "Screening".to_string(),
            message: "Gestational diabetes confirmed - refer to joint diabetes / antenatal clinic.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.screening_results.anomaly_scan_findings == "abnormal" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-003".to_string(),
            category: "Screening".to_string(),
            message: "Anomaly scan abnormal - fetal medicine referral.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.screening_results.antibody_screen_positive == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-004".to_string(),
            category: "Screening".to_string(),
            message: "Red-cell antibody screen positive - serial titres and fetal medicine input.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.screening_results.infection_screen_abnormal == "yes" {
        let detail = if data.screening_results.infection_screen_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.screening_results.infection_screen_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-SCREEN-005".to_string(),
            category: "Screening".to_string(),
            message: format!("Infection screen abnormal: {detail}."),
            priority: "medium".to_string(),
        });
    }

    // ─── Demographics / BMI / age ─────────────────────────────
    if let Some(bmi) = data.maternal_demographics.bmi {
        if bmi >= 35.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-001".to_string(),
                category: "Body Mass Index".to_string(),
                message: format!("BMI {bmi} - obstetric anaesthetic review and VTE / GDM screening."),
                priority: "high".to_string(),
            });
        } else if bmi >= 30.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-002".to_string(),
                category: "Body Mass Index".to_string(),
                message: format!("BMI {bmi} - schedule GDM screening and discuss healthy weight."),
                priority: "medium".to_string(),
            });
        } else if bmi < 18.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-003".to_string(),
                category: "Body Mass Index".to_string(),
                message: format!("BMI {bmi} - dietitian referral and growth surveillance."),
                priority: "medium".to_string(),
            });
        }
    }

    if let Some(age) = data.maternal_demographics.age_at_booking {
        if age >= 40 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-001".to_string(),
                category: "Maternal Age".to_string(),
                message: "Maternal age >=40 - increased risk of pre-eclampsia, GDM, and stillbirth.".to_string(),
                priority: "high".to_string(),
            });
        }
        if age < 18 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-002".to_string(),
                category: "Maternal Age".to_string(),
                message: "Teenage pregnancy - consider Family Nurse Partnership / young-parent pathway.".to_string(),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Lifestyle ────────────────────────────────────────────
    if data.lifestyle_social_factors.smoking_status == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-SMOKE-001".to_string(),
            category: "Lifestyle".to_string(),
            message: "Current smoker - refer to smoking-cessation in pregnancy service.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.lifestyle_social_factors.substance_use == "occasional"
        || data.lifestyle_social_factors.substance_use == "regular"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SUBSTANCE-001".to_string(),
            category: "Lifestyle".to_string(),
            message: "Substance use in pregnancy - specialist substance-misuse midwifery referral.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.lifestyle_social_factors.alcohol_use == "regular" {
        flags.push(AdditionalFlag {
            id: "FLAG-ALCOHOL-001".to_string(),
            category: "Lifestyle".to_string(),
            message: "Regular alcohol use - counsel re: fetal alcohol spectrum disorder, refer if needed.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.lifestyle_social_factors.female_genital_mutilation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-FGM-001".to_string(),
            category: "Safeguarding".to_string(),
            message: "FGM disclosed - mandatory reporting and specialist FGM clinic referral.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Mental health (non-urgent) ───────────────────────────
    if data.mental_health_assessment.previous_severe_mental_illness == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-002".to_string(),
            category: "Mental Health".to_string(),
            message: "Previous severe mental illness - perinatal mental health team referral.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.mental_health_assessment.whooley1 == "yes" && data.mental_health_assessment.whooley2 == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-003".to_string(),
            category: "Mental Health".to_string(),
            message: "Both Whooley questions positive - consider perinatal mental health assessment.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.mental_health_assessment.previous_postnatal_depression == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-004".to_string(),
            category: "Mental Health".to_string(),
            message: "Previous postnatal depression - increased recurrence risk; document care plan.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Pregnancy / multiples / IVF ──────────────────────────
    if data.current_pregnancy.multiple_pregnancy == "yes" {
        let suffix = if data.current_pregnancy.chorionicity.trim().is_empty() {
            String::new()
        } else {
            format!(" ({})", data.current_pregnancy.chorionicity.trim())
        };
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-001".to_string(),
            category: "Current Pregnancy".to_string(),
            message: format!("Multiple pregnancy{suffix} - twin clinic and serial scans."),
            priority: "high".to_string(),
        });
    }

    if data.current_pregnancy.ivf_conception == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-002".to_string(),
            category: "Current Pregnancy".to_string(),
            message: "Conceived via assisted reproduction - increased obstetric surveillance.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Obstetric history (additional context) ───────────────
    if data.obstetric_history.previous_caesarean == "yes" {
        let suffix = match data.obstetric_history.previous_caesarean_count {
            Some(n) => format!(" ({n})"),
            None => String::new(),
        };
        flags.push(AdditionalFlag {
            id: "FLAG-OBS-004".to_string(),
            category: "Obstetric History".to_string(),
            message: format!("Previous caesarean{suffix} - discuss VBAC vs. ERCS at 36 weeks."),
            priority: "medium".to_string(),
        });
    }

    if data.obstetric_history.previous_gestational_diabetes == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-OBS-005".to_string(),
            category: "Obstetric History".to_string(),
            message: "Previous GDM - early OGTT (16-18 wks) and again at 24-28 wks.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.obstetric_history.previous_postpartum_haemorrhage == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-OBS-006".to_string(),
            category: "Obstetric History".to_string(),
            message: "Previous postpartum haemorrhage - active management of 3rd stage and group-and-save.".to_string(),
            priority: "medium".to_string(),
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
