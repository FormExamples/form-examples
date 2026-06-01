use super::types::{AdditionalFlag, AssessmentData};
use super::utils::calculate_age_years;

/// Detect clinician-facing flags independent of overall eligibility status.
///
/// Priority: `urgent` > `high` > `medium` > `low`.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Donor demographics ───────────────────────────────────
    let age = calculate_age_years(&data.donor_demographics.date_of_birth);
    if let Some(a) = age {
        if a < 17 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-001".to_string(),
                category: "Donor Demographics".to_string(),
                message: format!("Donor under 17 ({a} y) — minimum donation age not met."),
                priority: "urgent".to_string(),
            });
        }
        if a >= 65 && data.donor_demographics.donor_type == "first-time" {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-002".to_string(),
                category: "Donor Demographics".to_string(),
                message: "First-time donor over 65 — clinician approval required.".to_string(),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(w) = data.donor_demographics.weight {
        if w < 50.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-WEIGHT-001".to_string(),
                category: "Donor Demographics".to_string(),
                message: format!("Weight {w} kg below 50 kg minimum."),
                priority: "high".to_string(),
            });
        }
    }

    // ─── General health ───────────────────────────────────────
    if data.general_health.feeling_faint_or_unwell == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-HEALTH-001".to_string(),
            category: "General Health".to_string(),
            message: "Donor reports feeling faint or unwell — do not draw.".to_string(),
            priority: "urgent".to_string(),
        });
    }
    if data.general_health.feeling_well_today == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-HEALTH-002".to_string(),
            category: "General Health".to_string(),
            message: "Donor reports not feeling well today.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── High-risk medical history ────────────────────────────
    if data.medical_history.hiv_positive == "yes"
        || data.medical_history.hepatitis_b_or_c == "yes"
        || data.medical_history.htlv == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-INF-001".to_string(),
            category: "Medical History".to_string(),
            message:
                "Self-reported transfusion-transmissible infection — permanent deferral and counselling required."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }
    if data.medical_history.cjd_family_history == "yes"
        || data.medical_history.received_pituitary_hormone == "yes"
        || data.medical_history.received_dura_mater_graft == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-CJD-001".to_string(),
            category: "Medical History".to_string(),
            message: "vCJD risk factor disclosed — permanent deferral.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.medical_history.bleeding_or_clotting_disorder == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-BLEED-001".to_string(),
            category: "Medical History".to_string(),
            message: "Bleeding/clotting disorder — donation contraindicated.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.medical_history.cancer == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-CA-001".to_string(),
            category: "Medical History".to_string(),
            message: "Cancer history — clinician review required.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.medical_history.heart_or_circulatory_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-CV-001".to_string(),
            category: "Medical History".to_string(),
            message: "Heart or circulatory disease — clinician review required.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.medical_history.diabetes_on_insulin == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-DM-001".to_string(),
            category: "Medical History".to_string(),
            message: "Insulin-treated diabetes — donation contraindicated.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if !data.medical_history.current_medications.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-RX-001".to_string(),
            category: "Medical History".to_string(),
            message: format!(
                "{} current medication(s) reported — review against JPAC medication index.",
                data.medical_history.current_medications.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Recent illness ───────────────────────────────────────
    if data.recent_illness.fever_past_two_weeks == "yes"
        || data.recent_illness.infection_past_two_weeks == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-ILL-001".to_string(),
            category: "Recent Illness".to_string(),
            message: "Recent febrile / infectious illness — defer.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.recent_illness.covid_positive_past_twenty_eight_days == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ILL-COVID-001".to_string(),
            category: "Recent Illness".to_string(),
            message: "COVID-19 positive within 28 days.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.recent_illness.surgery_past_six_months == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ILL-SURG-001".to_string(),
            category: "Recent Illness".to_string(),
            message: "Surgery within past 6 months — defer until fully recovered.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Travel ───────────────────────────────────────────────
    if data.travel_history.malaria_area_past_twelve_months == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAVEL-001".to_string(),
            category: "Travel History".to_string(),
            message: "Travel to malaria-risk area within 12 months — DSG deferral.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.travel_history.west_nile_virus_area_past_twenty_eight_days == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAVEL-002".to_string(),
            category: "Travel History".to_string(),
            message: "Travel to West Nile virus area within 28 days — DSG deferral.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.travel_history.uk_residence_1980_to_1996_over_12_months == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAVEL-VCJD-001".to_string(),
            category: "Travel History".to_string(),
            message: "UK residence \u{2265} 12 months between 1980-1996 — vCJD risk.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.travel_history.blood_transfusion_in_uk == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAVEL-TX-001".to_string(),
            category: "Travel History".to_string(),
            message: "Received UK blood transfusion since 1980 — permanent deferral.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Lifestyle risk ───────────────────────────────────────
    if data.lifestyle_risk.iv_drug_use_ever == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-IVDU-001".to_string(),
            category: "Lifestyle Risk".to_string(),
            message: "IV drug use ever — permanent deferral.".to_string(),
            priority: "urgent".to_string(),
        });
    }
    let sexual_risk_count: u32 = [
        &data.lifestyle_risk.sex_with_iv_drug_user,
        &data.lifestyle_risk.sex_in_exchange_past_twelve_months,
        &data.lifestyle_risk.sex_with_new_partner_past_three_months,
        &data.lifestyle_risk.multiple_sexual_partners_past_three_months,
    ]
    .iter()
    .filter(|v| **v == "yes")
    .count() as u32;
    if sexual_risk_count > 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-SEX-001".to_string(),
            category: "Lifestyle Risk".to_string(),
            message: format!(
                "{sexual_risk_count} recent sexual-risk exposure(s) — review individual donor risk assessment (IDRA)."
            ),
            priority: "high".to_string(),
        });
    }
    if data.lifestyle_risk.tattoo_or_piercing_past_four_months == "yes"
        || data.lifestyle_risk.body_or_ear_piercing_past_four_months == "yes"
        || data.lifestyle_risk.acupuncture_past_four_months == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-SKIN-001".to_string(),
            category: "Lifestyle Risk".to_string(),
            message: "Recent skin-piercing procedure — 4-month deferral.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.lifestyle_risk.incarcerated_past_twelve_months == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-INC-001".to_string(),
            category: "Lifestyle Risk".to_string(),
            message: "Incarceration within past 12 months — 12-month deferral.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Pregnancy / transfusion ──────────────────────────────
    if data.pregnancy_transfusion.currently_pregnant == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-001".to_string(),
            category: "Pregnancy & Transfusion".to_string(),
            message: "Currently pregnant — donation contraindicated.".to_string(),
            priority: "urgent".to_string(),
        });
    }
    if data.pregnancy_transfusion.pregnancy_past_six_months == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-002".to_string(),
            category: "Pregnancy & Transfusion".to_string(),
            message: "Pregnancy in past 6 months — defer until 6 months post-partum.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.pregnancy_transfusion.breastfeeding == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-003".to_string(),
            category: "Pregnancy & Transfusion".to_string(),
            message: "Currently breastfeeding — JPAC deferral.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.pregnancy_transfusion.received_transfusion_ever == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-TX-001".to_string(),
            category: "Pregnancy & Transfusion".to_string(),
            message: "Prior blood transfusion (UK) — permanent deferral.".to_string(),
            priority: "urgent".to_string(),
        });
    }
    if data.pregnancy_transfusion.received_transplant_ever == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-TR-001".to_string(),
            category: "Pregnancy & Transfusion".to_string(),
            message: "Prior organ/tissue transplant — permanent deferral.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Vital signs ──────────────────────────────────────────
    let sex = data.donor_demographics.sex.as_str();
    if let Some(hb) = data.vital_signs.hemoglobin {
        let min = if sex == "female" { 12.5 } else { 13.5 };
        if hb < min {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-HB-001".to_string(),
                category: "Vital Signs".to_string(),
                message: format!("Haemoglobin {hb} g/dL below {min} g/dL minimum."),
                priority: "high".to_string(),
            });
        } else if hb < min + 0.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-HB-002".to_string(),
                category: "Vital Signs".to_string(),
                message: format!("Haemoglobin {hb} g/dL is borderline."),
                priority: "low".to_string(),
            });
        }
    }
    if let Some(sbp) = data.vital_signs.systolic_bp {
        if !(100..=180).contains(&sbp) {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-BP-001".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Systolic BP {sbp} mmHg outside 100\u{2013}180 mmHg."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(dbp) = data.vital_signs.diastolic_bp {
        if !(60..=100).contains(&dbp) {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-BP-002".to_string(),
                category: "Vital Signs".to_string(),
                message: format!(
                    "Diastolic BP {dbp} mmHg outside 60\u{2013}100 mmHg."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(p) = data.vital_signs.pulse_bpm {
        if !(50..=100).contains(&p) {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-P-001".to_string(),
                category: "Vital Signs".to_string(),
                message: format!("Pulse {p} bpm outside 50\u{2013}100 bpm."),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(t) = data.vital_signs.temperature_celsius {
        if t > 37.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-VITAL-T-001".to_string(),
                category: "Vital Signs".to_string(),
                message: format!("Temperature {t} °C above 37.5 °C — defer."),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Informed consent ─────────────────────────────────────
    if data.informed_consent.consent_to_testing == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONS-001".to_string(),
            category: "Informed Consent".to_string(),
            message: "Donor refuses mandatory infection testing — cannot donate.".to_string(),
            priority: "urgent".to_string(),
        });
    }
    if data.informed_consent.understood_information == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONS-002".to_string(),
            category: "Informed Consent".to_string(),
            message: "Donor has not confirmed understanding — counselling required.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.informed_consent.consent_to_donate == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONS-003".to_string(),
            category: "Informed Consent".to_string(),
            message: "Donor has not consented to donate.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
