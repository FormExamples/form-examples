use super::types::{AssessmentData, FiredRule};
use super::utils::{calculate_age_years, days_since};

/// A declarative JPAC Donor Selection Guidelines (DSG) rule. The
/// `evaluate` closure returns `Some(FiredRule)` when the criterion fires
/// against the supplied data, and `None` otherwise.
pub struct DsgRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> Option<FiredRule>,
}

/// Build a `permanently-deferred` fired rule.
fn perm(id: &str, category: &str, description: String) -> FiredRule {
    FiredRule {
        id: id.to_string(),
        category: category.to_string(),
        description,
        status: "permanently-deferred".to_string(),
        deferral_window: String::new(),
    }
}

/// Build a `temporarily-deferred` fired rule.
fn temp(id: &str, category: &str, description: String, window: &str) -> FiredRule {
    FiredRule {
        id: id.to_string(),
        category: category.to_string(),
        description,
        status: "temporarily-deferred".to_string(),
        deferral_window: window.to_string(),
    }
}

/// All JPAC DSG rules in evaluation order.
pub fn all_rules() -> Vec<DsgRule> {
    vec![
        // ─── Donor demographics ───────────────────────────────────────
        DsgRule {
            id: "DSG-AGE-001",
            category: "Donor Demographics",
            description:
                "Donor must be aged 17 to 65 (first-time) or up to 70 (regular).",
            evaluate: |d| {
                let age = calculate_age_years(&d.donor_demographics.date_of_birth)?;
                if age < 17 {
                    return Some(temp(
                        "DSG-AGE-001",
                        "Donor Demographics",
                        format!("Donor is {age} y — minimum donation age is 17."),
                        "Until 17th birthday",
                    ));
                }
                if d.donor_demographics.donor_type == "first-time" && age > 65 {
                    return Some(temp(
                        "DSG-AGE-002",
                        "Donor Demographics",
                        format!(
                            "First-time donor over 65 ({age} y) — clinician approval required."
                        ),
                        "Pending clinician review",
                    ));
                }
                if age > 70 {
                    return Some(temp(
                        "DSG-AGE-003",
                        "Donor Demographics",
                        format!("Donor over 70 ({age} y) — annual GP confirmation required."),
                        "Pending GP confirmation",
                    ));
                }
                None
            },
        },
        DsgRule {
            id: "DSG-WEIGHT-001",
            category: "Donor Demographics",
            description: "Donor must weigh at least 50 kg.",
            evaluate: |d| {
                let w = d.donor_demographics.weight?;
                if w < 50.0 {
                    Some(temp(
                        "DSG-WEIGHT-001",
                        "Donor Demographics",
                        format!("Weight {w} kg is below the 50 kg minimum."),
                        "Until weight \u{2265} 50 kg",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-INTERVAL-001",
            category: "Donor Demographics",
            description:
                "Whole-blood donations must be at least 12 weeks apart (men) / 16 weeks (women).",
            evaluate: |d| {
                let days = days_since(&d.donor_demographics.last_donation_date)?;
                let min_days: i64 = if d.donor_demographics.sex == "female" {
                    112
                } else {
                    84
                };
                if days < min_days {
                    let remaining = min_days - days;
                    let suffix = if remaining == 1 { "" } else { "s" };
                    Some(temp(
                        "DSG-INTERVAL-001",
                        "Donor Demographics",
                        format!(
                            "Only {days} days since last donation — minimum interval is {min_days} days."
                        ),
                        &format!("{remaining} more day{suffix}"),
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Same-day general health ─────────────────────────────────
        DsgRule {
            id: "DSG-HEALTH-001",
            category: "General Health",
            description: "Donor must feel well on the day of donation.",
            evaluate: |d| {
                if d.general_health.feeling_well_today == "no" {
                    Some(temp(
                        "DSG-HEALTH-001",
                        "General Health",
                        "Donor reports not feeling well today.".to_string(),
                        "Until donor feels well",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-HEALTH-002",
            category: "General Health",
            description: "Donor must report adequate sleep.",
            evaluate: |d| {
                if d.general_health.adequate_sleep == "no" {
                    Some(temp(
                        "DSG-HEALTH-002",
                        "General Health",
                        "Inadequate sleep before donation.".to_string(),
                        "Until well rested",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-HEALTH-003",
            category: "General Health",
            description: "Donor must have eaten and drunk before donation.",
            evaluate: |d| {
                if d.general_health.adequate_meal_and_fluids == "no" {
                    Some(temp(
                        "DSG-HEALTH-003",
                        "General Health",
                        "Donor has not eaten or drunk adequately before donation.".to_string(),
                        "After meal and fluids",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-HEALTH-004",
            category: "General Health",
            description: "Donor must not feel faint or unwell.",
            evaluate: |d| {
                if d.general_health.feeling_faint_or_unwell == "yes" {
                    Some(temp(
                        "DSG-HEALTH-004",
                        "General Health",
                        "Donor feels faint or unwell at the session.".to_string(),
                        "Until well",
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Medical history (permanent deferrals) ───────────────────
        DsgRule {
            id: "DSG-MED-001",
            category: "Medical History",
            description: "HIV positive — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.hiv_positive == "yes" {
                    Some(perm(
                        "DSG-MED-001",
                        "Medical History",
                        "HIV positive — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-002",
            category: "Medical History",
            description: "Hepatitis B or C — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.hepatitis_b_or_c == "yes" {
                    Some(perm(
                        "DSG-MED-002",
                        "Medical History",
                        "Hepatitis B or C history — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-003",
            category: "Medical History",
            description: "HTLV positive — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.htlv == "yes" {
                    Some(perm(
                        "DSG-MED-003",
                        "Medical History",
                        "HTLV positive — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-004",
            category: "Medical History",
            description: "Family history of CJD — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.cjd_family_history == "yes" {
                    Some(perm(
                        "DSG-MED-004",
                        "Medical History",
                        "Family history of CJD — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-005",
            category: "Medical History",
            description: "Recipient of human pituitary hormone — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.received_pituitary_hormone == "yes" {
                    Some(perm(
                        "DSG-MED-005",
                        "Medical History",
                        "Received human pituitary hormone — vCJD risk, permanent deferral."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-006",
            category: "Medical History",
            description: "Dura mater graft recipient — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.received_dura_mater_graft == "yes" {
                    Some(perm(
                        "DSG-MED-006",
                        "Medical History",
                        "Dura mater graft recipient — vCJD risk, permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-007",
            category: "Medical History",
            description: "Bleeding or clotting disorder — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.bleeding_or_clotting_disorder == "yes" {
                    Some(perm(
                        "DSG-MED-007",
                        "Medical History",
                        "Bleeding or clotting disorder — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-008",
            category: "Medical History",
            description: "Insulin-treated diabetes — permanent deferral for whole blood.",
            evaluate: |d| {
                if d.medical_history.diabetes_on_insulin == "yes" {
                    Some(perm(
                        "DSG-MED-008",
                        "Medical History",
                        "Insulin-treated diabetes — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-009",
            category: "Medical History",
            description: "Heart or circulatory disease — clinician review.",
            evaluate: |d| {
                if d.medical_history.heart_or_circulatory_disease == "yes" {
                    Some(perm(
                        "DSG-MED-009",
                        "Medical History",
                        "Heart or circulatory disease — permanent deferral pending clinician review."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-010",
            category: "Medical History",
            description: "Active or recent malignancy — permanent deferral.",
            evaluate: |d| {
                if d.medical_history.cancer == "yes" {
                    Some(perm(
                        "DSG-MED-010",
                        "Medical History",
                        "Cancer history — permanent deferral pending clinician review."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-MED-011",
            category: "Medical History",
            description: "History of seizures or epilepsy — clinician review.",
            evaluate: |d| {
                if d.medical_history.epilepsy_or_seizures == "yes" {
                    Some(temp(
                        "DSG-MED-011",
                        "Medical History",
                        "History of seizures/epilepsy — deferred until 3 years seizure-free off treatment."
                            .to_string(),
                        "Pending clinician review",
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Recent illness & infections ─────────────────────────────
        DsgRule {
            id: "DSG-ILL-001",
            category: "Recent Illness",
            description: "Fever in the past 2 weeks.",
            evaluate: |d| {
                if d.recent_illness.fever_past_two_weeks == "yes" {
                    Some(temp(
                        "DSG-ILL-001",
                        "Recent Illness",
                        "Fever in the past 2 weeks.".to_string(),
                        "14 days from resolution",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-ILL-002",
            category: "Recent Illness",
            description: "Active infection in the past 2 weeks.",
            evaluate: |d| {
                if d.recent_illness.infection_past_two_weeks == "yes" {
                    Some(temp(
                        "DSG-ILL-002",
                        "Recent Illness",
                        "Active infection in the past 2 weeks.".to_string(),
                        "14 days from resolution",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-ILL-003",
            category: "Recent Illness",
            description: "Antibiotics taken in the past 7 days.",
            evaluate: |d| {
                if d.recent_illness.antibiotics_past_seven_days == "yes" {
                    Some(temp(
                        "DSG-ILL-003",
                        "Recent Illness",
                        "Antibiotic course finished within the past 7 days.".to_string(),
                        "7 days post-course",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-ILL-004",
            category: "Recent Illness",
            description: "Dental work in the past week.",
            evaluate: |d| {
                if d.recent_illness.dental_work_past_week == "yes" {
                    Some(temp(
                        "DSG-ILL-004",
                        "Recent Illness",
                        "Dental work in the past 7 days.".to_string(),
                        "24 h to 7 d depending on procedure",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-ILL-005",
            category: "Recent Illness",
            description: "Surgery in the past 6 months.",
            evaluate: |d| {
                if d.recent_illness.surgery_past_six_months == "yes" {
                    Some(temp(
                        "DSG-ILL-005",
                        "Recent Illness",
                        "Major surgery within the past 6 months.".to_string(),
                        "Until 6 months post-op and fully recovered",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-ILL-006",
            category: "Recent Illness",
            description: "COVID-19 positive in the past 28 days.",
            evaluate: |d| {
                if d.recent_illness.covid_positive_past_twenty_eight_days == "yes" {
                    Some(temp(
                        "DSG-ILL-006",
                        "Recent Illness",
                        "COVID-19 positive within the past 28 days.".to_string(),
                        "28 days from positive test",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-ILL-007",
            category: "Recent Illness",
            description:
                "Vaccination in the past 4 weeks (live vaccine = 4 weeks; inactivated = none if well).",
            evaluate: |d| {
                if d.recent_illness.vaccination_past_four_weeks == "yes" {
                    let extra = if d.recent_illness.vaccination_details.trim().is_empty() {
                        String::new()
                    } else {
                        format!(" ({})", d.recent_illness.vaccination_details.trim())
                    };
                    Some(temp(
                        "DSG-ILL-007",
                        "Recent Illness",
                        format!("Vaccination within the past 4 weeks{extra}."),
                        "Up to 28 days for live vaccines",
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Travel history ──────────────────────────────────────────
        DsgRule {
            id: "DSG-TRAVEL-001",
            category: "Travel History",
            description: "Travel to malaria-risk area in past 12 months.",
            evaluate: |d| {
                if d.travel_history.malaria_area_past_twelve_months == "yes" {
                    Some(temp(
                        "DSG-TRAVEL-001",
                        "Travel History",
                        "Travel to malaria-risk area in the past 12 months.".to_string(),
                        "6 to 12 months from return",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-TRAVEL-002",
            category: "Travel History",
            description: "Travel to West Nile virus area in past 28 days.",
            evaluate: |d| {
                if d.travel_history.west_nile_virus_area_past_twenty_eight_days == "yes" {
                    Some(temp(
                        "DSG-TRAVEL-002",
                        "Travel History",
                        "Travel to West Nile virus area in the past 28 days.".to_string(),
                        "28 days from return",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-TRAVEL-003",
            category: "Travel History",
            description:
                "Cumulative \u{2265} 12 months UK residence 1980-1996 — vCJD risk.",
            evaluate: |d| {
                if d.travel_history.uk_residence_1980_to_1996_over_12_months == "yes" {
                    Some(perm(
                        "DSG-TRAVEL-003",
                        "Travel History",
                        "Cumulative \u{2265} 12 months UK residence between 1980 and 1996 — vCJD risk, permanent deferral in some jurisdictions."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-TRAVEL-004",
            category: "Travel History",
            description: "Received a blood transfusion in the UK since 1980.",
            evaluate: |d| {
                if d.travel_history.blood_transfusion_in_uk == "yes" {
                    Some(perm(
                        "DSG-TRAVEL-004",
                        "Travel History",
                        "Received a blood transfusion in the UK since 1980 — permanent deferral."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Lifestyle & risk behaviours ─────────────────────────────
        DsgRule {
            id: "DSG-LIFE-001",
            category: "Lifestyle Risk",
            description: "IV drug use ever — permanent deferral.",
            evaluate: |d| {
                if d.lifestyle_risk.iv_drug_use_ever == "yes" {
                    Some(perm(
                        "DSG-LIFE-001",
                        "Lifestyle Risk",
                        "IV drug use ever — permanent deferral.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-002",
            category: "Lifestyle Risk",
            description: "Sex with an IV drug user — 3 month deferral.",
            evaluate: |d| {
                if d.lifestyle_risk.sex_with_iv_drug_user == "yes" {
                    Some(temp(
                        "DSG-LIFE-002",
                        "Lifestyle Risk",
                        "Sex with an IV drug user.".to_string(),
                        "3 months from last contact",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-003",
            category: "Lifestyle Risk",
            description: "Sex in exchange for money or drugs in past 12 months.",
            evaluate: |d| {
                if d.lifestyle_risk.sex_in_exchange_past_twelve_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-003",
                        "Lifestyle Risk",
                        "Sex in exchange for money or drugs in past 12 months.".to_string(),
                        "12 months from last contact",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-004",
            category: "Lifestyle Risk",
            description: "Sex with new partner in the past 3 months.",
            evaluate: |d| {
                if d.lifestyle_risk.sex_with_new_partner_past_three_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-004",
                        "Lifestyle Risk",
                        "Sex with new partner in the past 3 months.".to_string(),
                        "3 months from last contact",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-005",
            category: "Lifestyle Risk",
            description: "Multiple sexual partners in the past 3 months.",
            evaluate: |d| {
                if d.lifestyle_risk.multiple_sexual_partners_past_three_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-005",
                        "Lifestyle Risk",
                        "Multiple sexual partners in the past 3 months.".to_string(),
                        "3 months from last contact",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-006",
            category: "Lifestyle Risk",
            description: "Tattoo or semi-permanent make-up in past 4 months.",
            evaluate: |d| {
                if d.lifestyle_risk.tattoo_or_piercing_past_four_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-006",
                        "Lifestyle Risk",
                        "Tattoo or semi-permanent make-up in past 4 months.".to_string(),
                        "4 months from procedure",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-007",
            category: "Lifestyle Risk",
            description: "Acupuncture in past 4 months (non-NHS).",
            evaluate: |d| {
                if d.lifestyle_risk.acupuncture_past_four_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-007",
                        "Lifestyle Risk",
                        "Non-NHS acupuncture in past 4 months.".to_string(),
                        "4 months from procedure",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-008",
            category: "Lifestyle Risk",
            description: "Body or ear piercing in past 4 months.",
            evaluate: |d| {
                if d.lifestyle_risk.body_or_ear_piercing_past_four_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-008",
                        "Lifestyle Risk",
                        "Body or ear piercing in past 4 months.".to_string(),
                        "4 months from procedure",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-LIFE-009",
            category: "Lifestyle Risk",
            description: "Incarcerated in past 12 months.",
            evaluate: |d| {
                if d.lifestyle_risk.incarcerated_past_twelve_months == "yes" {
                    Some(temp(
                        "DSG-LIFE-009",
                        "Lifestyle Risk",
                        "Incarcerated in the past 12 months.".to_string(),
                        "12 months from release",
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Pregnancy & transfusion ─────────────────────────────────
        DsgRule {
            id: "DSG-PREG-001",
            category: "Pregnancy & Transfusion",
            description: "Currently pregnant — defer until 6 months post-partum.",
            evaluate: |d| {
                if d.pregnancy_transfusion.currently_pregnant == "yes" {
                    Some(temp(
                        "DSG-PREG-001",
                        "Pregnancy & Transfusion",
                        "Currently pregnant.".to_string(),
                        "Until 6 months post-partum",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-PREG-002",
            category: "Pregnancy & Transfusion",
            description: "Pregnancy in past 6 months.",
            evaluate: |d| {
                if d.pregnancy_transfusion.pregnancy_past_six_months == "yes" {
                    Some(temp(
                        "DSG-PREG-002",
                        "Pregnancy & Transfusion",
                        "Pregnancy ended in past 6 months.".to_string(),
                        "6 months post-partum",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-PREG-003",
            category: "Pregnancy & Transfusion",
            description: "Currently breastfeeding.",
            evaluate: |d| {
                if d.pregnancy_transfusion.breastfeeding == "yes" {
                    Some(temp(
                        "DSG-PREG-003",
                        "Pregnancy & Transfusion",
                        "Currently breastfeeding — defer per JPAC guidance.".to_string(),
                        "Until breastfeeding has ceased",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-PREG-004",
            category: "Pregnancy & Transfusion",
            description: "Received a blood transfusion ever (in UK since 1980).",
            evaluate: |d| {
                if d.pregnancy_transfusion.received_transfusion_ever == "yes" {
                    Some(perm(
                        "DSG-PREG-004",
                        "Pregnancy & Transfusion",
                        "Received a blood transfusion since 1980 — permanent deferral in UK."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-PREG-005",
            category: "Pregnancy & Transfusion",
            description: "Received an organ transplant ever.",
            evaluate: |d| {
                if d.pregnancy_transfusion.received_transplant_ever == "yes" {
                    Some(perm(
                        "DSG-PREG-005",
                        "Pregnancy & Transfusion",
                        "Received an organ or tissue transplant — permanent deferral."
                            .to_string(),
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Vital signs ─────────────────────────────────────────────
        DsgRule {
            id: "DSG-VITAL-001",
            category: "Vital Signs",
            description:
                "Haemoglobin must be \u{2265} 13.5 g/dL (men) or \u{2265} 12.5 g/dL (women).",
            evaluate: |d| {
                let hb = d.vital_signs.hemoglobin?;
                let min = if d.donor_demographics.sex == "female" {
                    12.5
                } else {
                    13.5
                };
                if hb < min {
                    Some(temp(
                        "DSG-VITAL-001",
                        "Vital Signs",
                        format!(
                            "Haemoglobin {hb} g/dL is below the {min} g/dL minimum."
                        ),
                        "Until Hb meets minimum",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-VITAL-002",
            category: "Vital Signs",
            description: "Systolic BP must be 100\u{2013}180 mmHg.",
            evaluate: |d| {
                let sbp = d.vital_signs.systolic_bp?;
                if !(100..=180).contains(&sbp) {
                    Some(temp(
                        "DSG-VITAL-002",
                        "Vital Signs",
                        format!(
                            "Systolic BP {sbp} mmHg is outside 100\u{2013}180 mmHg."
                        ),
                        "Until BP within range",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-VITAL-003",
            category: "Vital Signs",
            description: "Diastolic BP must be 60\u{2013}100 mmHg.",
            evaluate: |d| {
                let dbp = d.vital_signs.diastolic_bp?;
                if !(60..=100).contains(&dbp) {
                    Some(temp(
                        "DSG-VITAL-003",
                        "Vital Signs",
                        format!(
                            "Diastolic BP {dbp} mmHg is outside 60\u{2013}100 mmHg."
                        ),
                        "Until BP within range",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-VITAL-004",
            category: "Vital Signs",
            description: "Pulse must be 50\u{2013}100 bpm and regular.",
            evaluate: |d| {
                let p = d.vital_signs.pulse_bpm?;
                if !(50..=100).contains(&p) {
                    Some(temp(
                        "DSG-VITAL-004",
                        "Vital Signs",
                        format!("Pulse {p} bpm is outside 50\u{2013}100 bpm."),
                        "Until pulse within range",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-VITAL-005",
            category: "Vital Signs",
            description: "Temperature must be \u{2264} 37.5 °C.",
            evaluate: |d| {
                let t = d.vital_signs.temperature_celsius?;
                if t > 37.5 {
                    Some(temp(
                        "DSG-VITAL-005",
                        "Vital Signs",
                        format!("Temperature {t} °C is above 37.5 °C — defer until afebrile."),
                        "Until afebrile + 14 days",
                    ))
                } else {
                    None
                }
            },
        },
        // ─── Informed consent ────────────────────────────────────────
        DsgRule {
            id: "DSG-CONS-001",
            category: "Informed Consent",
            description: "Donor must understand the donation information.",
            evaluate: |d| {
                if d.informed_consent.understood_information == "no" {
                    Some(temp(
                        "DSG-CONS-001",
                        "Informed Consent",
                        "Donor has not confirmed understanding of donation information.".to_string(),
                        "Until counselled",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-CONS-002",
            category: "Informed Consent",
            description: "Donor must consent to donation.",
            evaluate: |d| {
                if d.informed_consent.consent_to_donate == "no" {
                    Some(temp(
                        "DSG-CONS-002",
                        "Informed Consent",
                        "Donor has not consented to donate.".to_string(),
                        "Until consent given",
                    ))
                } else {
                    None
                }
            },
        },
        DsgRule {
            id: "DSG-CONS-003",
            category: "Informed Consent",
            description: "Donor must consent to mandatory infection testing.",
            evaluate: |d| {
                if d.informed_consent.consent_to_testing == "no" {
                    Some(perm(
                        "DSG-CONS-003",
                        "Informed Consent",
                        "Donor refuses mandatory infection testing — cannot donate.".to_string(),
                    ))
                } else {
                    None
                }
            },
        },
    ]
}
