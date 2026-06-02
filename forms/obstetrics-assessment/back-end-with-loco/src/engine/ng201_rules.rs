use super::types::AssessmentData;

/// A declarative NG201 rule. Each rule returns `Some(risk)` when it fires,
/// or `None` otherwise.
pub struct Ng201Rule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> Option<&'static str>,
}

/// All NICE NG201 Antenatal Risk Assessment rules.
pub fn all_rules() -> Vec<Ng201Rule> {
    vec![
        // ─── Maternal age ─────────────────────────────────────────
        Ng201Rule {
            id: "NG201-AGE-001",
            category: "Maternal Age",
            description: "Maternal age 40 or over at booking — high risk.",
            evaluate: |d| match d.maternal_demographics.age_at_booking {
                Some(a) if a >= 40 => Some("high"),
                _ => None,
            },
        },
        Ng201Rule {
            id: "NG201-AGE-002",
            category: "Maternal Age",
            description: "Maternal age 35-39 at booking — moderate risk.",
            evaluate: |d| match d.maternal_demographics.age_at_booking {
                Some(a) if a >= 35 && a < 40 => Some("moderate"),
                _ => None,
            },
        },
        Ng201Rule {
            id: "NG201-AGE-003",
            category: "Maternal Age",
            description: "Maternal age under 18 at booking — moderate risk.",
            evaluate: |d| match d.maternal_demographics.age_at_booking {
                Some(a) if a < 18 => Some("moderate"),
                _ => None,
            },
        },
        // ─── BMI ──────────────────────────────────────────────────
        Ng201Rule {
            id: "NG201-BMI-001",
            category: "Body Mass Index",
            description: "BMI 35 or higher — high risk.",
            evaluate: |d| match d.maternal_demographics.bmi {
                Some(b) if b >= 35.0 => Some("high"),
                _ => None,
            },
        },
        Ng201Rule {
            id: "NG201-BMI-002",
            category: "Body Mass Index",
            description: "BMI 30-34.9 — moderate risk.",
            evaluate: |d| match d.maternal_demographics.bmi {
                Some(b) if b >= 30.0 && b < 35.0 => Some("moderate"),
                _ => None,
            },
        },
        Ng201Rule {
            id: "NG201-BMI-003",
            category: "Body Mass Index",
            description: "BMI under 18.5 — moderate risk.",
            evaluate: |d| match d.maternal_demographics.bmi {
                Some(b) if b < 18.5 => Some("moderate"),
                _ => None,
            },
        },
        // ─── Obstetric history ───────────────────────────────────
        Ng201Rule {
            id: "NG201-OBS-001",
            category: "Obstetric History",
            description: "Previous stillbirth or neonatal death — high risk.",
            evaluate: |d| {
                let sb = d.obstetric_history.previous_stillbirths.unwrap_or(0);
                let nd = d.obstetric_history.previous_neonatal_deaths.unwrap_or(0);
                if sb > 0 || nd > 0 { Some("high") } else { None }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-002",
            category: "Obstetric History",
            description: "Previous pre-eclampsia — high risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_pre_eclampsia == "yes" {
                    Some("high")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-003",
            category: "Obstetric History",
            description: "Previous preterm birth — high risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_preterm_birth == "yes" {
                    Some("high")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-004",
            category: "Obstetric History",
            description: "Previous gestational diabetes — moderate risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_gestational_diabetes == "yes" {
                    Some("moderate")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-005",
            category: "Obstetric History",
            description: "Previous caesarean section — moderate risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_caesarean == "yes" {
                    Some("moderate")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-006",
            category: "Obstetric History",
            description: "Previous postpartum haemorrhage — moderate risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_postpartum_haemorrhage == "yes" {
                    Some("moderate")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-007",
            category: "Obstetric History",
            description: "Previous shoulder dystocia — moderate risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_shoulder_dystocia == "yes" {
                    Some("moderate")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-008",
            category: "Obstetric History",
            description: "Three or more previous miscarriages — moderate risk.",
            evaluate: |d| match d.obstetric_history.previous_miscarriages {
                Some(m) if m >= 3 => Some("moderate"),
                _ => None,
            },
        },
        Ng201Rule {
            id: "NG201-OBS-009",
            category: "Obstetric History",
            description: "Previous congenital anomaly — moderate risk.",
            evaluate: |d| {
                if d.obstetric_history.previous_congenital_anomaly == "yes" {
                    Some("moderate")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-OBS-010",
            category: "Obstetric History",
            description: "Grand multiparity (parity 4 or higher) — moderate risk.",
            evaluate: |d| match d.obstetric_history.parity {
                Some(p) if p >= 4 => Some("moderate"),
                _ => None,
            },
        },
        // ─── Medical history ─────────────────────────────────────
        Ng201Rule {
            id: "NG201-MED-001",
            category: "Medical History",
            description: "Cardiac disease — high risk.",
            evaluate: |d| if d.medical_history.cardiac_disease == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-002",
            category: "Medical History",
            description: "Pre-existing diabetes (Type 1 or Type 2) — high risk.",
            evaluate: |d| if d.medical_history.pre_existing_diabetes == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-003",
            category: "Medical History",
            description: "Chronic hypertension — high risk.",
            evaluate: |d| if d.medical_history.chronic_hypertension == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-004",
            category: "Medical History",
            description: "Renal disease — high risk.",
            evaluate: |d| if d.medical_history.renal_disease == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-005",
            category: "Medical History",
            description: "Previous venous thromboembolism — high risk.",
            evaluate: |d| if d.medical_history.previous_vte == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-006",
            category: "Medical History",
            description: "Thrombophilia — high risk.",
            evaluate: |d| if d.medical_history.thrombophilia == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-007",
            category: "Medical History",
            description: "HIV positive — high risk.",
            evaluate: |d| if d.medical_history.hiv_positive == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-008",
            category: "Medical History",
            description: "Autoimmune disease — moderate risk.",
            evaluate: |d| if d.medical_history.autoimmune_disease == "yes" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-009",
            category: "Medical History",
            description: "Epilepsy — moderate risk.",
            evaluate: |d| if d.medical_history.epilepsy == "yes" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-010",
            category: "Medical History",
            description: "Thyroid disease — moderate risk.",
            evaluate: |d| if d.medical_history.thyroid_disease == "yes" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-011",
            category: "Medical History",
            description: "Hepatitis B or C — moderate risk.",
            evaluate: |d| if d.medical_history.hepatitis == "yes" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-MED-012",
            category: "Medical History",
            description: "Bariatric surgery history — moderate risk.",
            evaluate: |d| if d.medical_history.bariatric_surgery == "yes" { Some("moderate") } else { None },
        },
        // ─── Current pregnancy ────────────────────────────────────
        Ng201Rule {
            id: "NG201-PREG-001",
            category: "Current Pregnancy",
            description: "Multiple pregnancy — high risk.",
            evaluate: |d| if d.current_pregnancy.multiple_pregnancy == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-PREG-002",
            category: "Current Pregnancy",
            description: "IVF / assisted conception — moderate risk.",
            evaluate: |d| if d.current_pregnancy.ivf_conception == "yes" { Some("moderate") } else { None },
        },
        // ─── Lifestyle / social ───────────────────────────────────
        Ng201Rule {
            id: "NG201-SOCIAL-001",
            category: "Lifestyle & Social",
            description: "Current smoker in pregnancy — moderate risk.",
            evaluate: |d| if d.lifestyle_social_factors.smoking_status == "current" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-002",
            category: "Lifestyle & Social",
            description: "Alcohol use in pregnancy — moderate risk.",
            evaluate: |d| {
                let a = &d.lifestyle_social_factors.alcohol_use;
                if a == "occasional" || a == "regular" { Some("moderate") } else { None }
            },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-003",
            category: "Lifestyle & Social",
            description: "Substance use in pregnancy — high risk.",
            evaluate: |d| {
                let s = &d.lifestyle_social_factors.substance_use;
                if s == "occasional" || s == "regular" { Some("high") } else { None }
            },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-004",
            category: "Lifestyle & Social",
            description: "Domestic abuse disclosed — high risk.",
            evaluate: |d| if d.lifestyle_social_factors.domestic_abuse == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-005",
            category: "Lifestyle & Social",
            description: "Safeguarding concerns — high risk.",
            evaluate: |d| if d.lifestyle_social_factors.safeguarding_concerns == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-006",
            category: "Lifestyle & Social",
            description: "Female genital mutilation — high risk.",
            evaluate: |d| if d.lifestyle_social_factors.female_genital_mutilation == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-007",
            category: "Lifestyle & Social",
            description: "Asylum seeker / refugee — moderate risk.",
            evaluate: |d| if d.lifestyle_social_factors.asylum_or_refugee == "yes" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-SOCIAL-008",
            category: "Lifestyle & Social",
            description: "Housing insecurity — moderate risk.",
            evaluate: |d| if d.lifestyle_social_factors.housing_insecurity == "yes" { Some("moderate") } else { None },
        },
        // ─── Screening results ────────────────────────────────────
        Ng201Rule {
            id: "NG201-SCREEN-001",
            category: "Screening",
            description: "Combined test high-risk result — high risk.",
            evaluate: |d| if d.screening_results.combined_test_result == "higher-chance" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SCREEN-002",
            category: "Screening",
            description: "Glucose tolerance test diagnostic of GDM — high risk.",
            evaluate: |d| if d.screening_results.gtt_result == "gdm-confirmed" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SCREEN-003",
            category: "Screening",
            description: "Anomaly scan abnormal — high risk.",
            evaluate: |d| if d.screening_results.anomaly_scan_findings == "abnormal" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SCREEN-004",
            category: "Screening",
            description: "Red-cell antibody screen positive — high risk.",
            evaluate: |d| if d.screening_results.antibody_screen_positive == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-SCREEN-005",
            category: "Screening",
            description: "Infection screen abnormal — moderate risk.",
            evaluate: |d| if d.screening_results.infection_screen_abnormal == "yes" { Some("moderate") } else { None },
        },
        // ─── Mental health ────────────────────────────────────────
        Ng201Rule {
            id: "NG201-MH-001",
            category: "Mental Health",
            description: "Self-harm or suicidal ideation disclosed — high risk.",
            evaluate: |d| if d.mental_health_assessment.self_harm_ideation == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MH-002",
            category: "Mental Health",
            description: "Previous severe mental illness — high risk.",
            evaluate: |d| if d.mental_health_assessment.previous_severe_mental_illness == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-MH-003",
            category: "Mental Health",
            description: "Both Whooley questions positive — moderate risk.",
            evaluate: |d| {
                if d.mental_health_assessment.whooley1 == "yes"
                    && d.mental_health_assessment.whooley2 == "yes"
                {
                    Some("moderate")
                } else {
                    None
                }
            },
        },
        Ng201Rule {
            id: "NG201-MH-004",
            category: "Mental Health",
            description: "Previous postnatal depression — moderate risk.",
            evaluate: |d| if d.mental_health_assessment.previous_postnatal_depression == "yes" { Some("moderate") } else { None },
        },
        Ng201Rule {
            id: "NG201-MH-005",
            category: "Mental Health",
            description: "GAD-2 score positive (>= 3) — moderate risk.",
            evaluate: |d| {
                let map = |s: &str| -> i32 {
                    match s {
                        "not-at-all" => 0,
                        "several-days" => 1,
                        "more-than-half" => 2,
                        "nearly-every-day" => 3,
                        _ => 0,
                    }
                };
                let q1 = map(&d.mental_health_assessment.gad2_q1);
                let q2 = map(&d.mental_health_assessment.gad2_q2);
                if q1 + q2 >= 3 { Some("moderate") } else { None }
            },
        },
        // ─── Fetal assessment ─────────────────────────────────────
        Ng201Rule {
            id: "NG201-FETAL-001",
            category: "Fetal Assessment",
            description: "Reduced fetal movements reported — high risk.",
            evaluate: |d| if d.fetal_assessment.reduced_fetal_movements == "yes" { Some("high") } else { None },
        },
        Ng201Rule {
            id: "NG201-FETAL-002",
            category: "Fetal Assessment",
            description: "Growth concern (SGA / LGA / IUGR) — high risk.",
            evaluate: |d| if d.fetal_assessment.growth_concern == "yes" { Some("high") } else { None },
        },
    ]
}
