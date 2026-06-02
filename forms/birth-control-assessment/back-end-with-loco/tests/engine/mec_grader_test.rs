use birth_control_assessment_loco_crate::engine::mec_grader::{calculate_mec_grade, run_rules};
use birth_control_assessment_loco_crate::engine::mec_rules::all_rules;
use birth_control_assessment_loco_crate::engine::types::*;

/// Build a healthy 30-year-old patient (everyone "no" / safe defaults).
fn healthy_patient() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Smith".to_string(),
            date_of_birth: "1995-03-15".to_string(),
            sex: "female".to_string(),
            weight: Some(65.0),
            height: Some(165.0),
            bmi: Some(23.9),
        },
        menstrual_history: MenstrualHistory {
            menarche_age: Some(12),
            cycle_regularity: "regular".to_string(),
            cycle_length_days: Some(28),
            period_duration_days: Some(5),
            flow_heaviness: "moderate".to_string(),
            intermenstrual_bleeding: "no".to_string(),
            postcoital_bleeding: "no".to_string(),
            dysmenorrhoea: "mild".to_string(),
            last_menstrual_period: "2026-04-01".to_string(),
            amenorrhoea: "no".to_string(),
            amenorrhoea_duration_months: None,
        },
        contraceptive_history: ContraceptiveHistory {
            previous_contraception: "yes".to_string(),
            previous_coc: "yes".to_string(),
            coc_details: "Microgynon 30".to_string(),
            previous_pop: "no".to_string(),
            previous_implant: "no".to_string(),
            previous_injection: "no".to_string(),
            previous_iud: "no".to_string(),
            previous_ius: "no".to_string(),
            previous_patch_ring: "no".to_string(),
            previous_barrier: "yes".to_string(),
            ..Default::default()
        },
        medical_history: MedicalHistory {
            migraine: "no".to_string(),
            migraine_with_aura: String::new(),
            migraine_frequency: String::new(),
            breast_cancer: "no".to_string(),
            cervical_cancer: "no".to_string(),
            liver_disease: "no".to_string(),
            gallbladder_disease: "no".to_string(),
            inflammatory_bowel_disease: "no".to_string(),
            sle: "no".to_string(),
            sle_antiphospholipid: String::new(),
            epilepsy: "no".to_string(),
            diabetes: "no".to_string(),
            diabetes_complications: String::new(),
            sti: "no".to_string(),
            sti_details: String::new(),
            pid: "no".to_string(),
        },
        cardiovascular_risk: CardiovascularRisk {
            hypertension: "no".to_string(),
            systolic_bp: Some(120),
            diastolic_bp: Some(75),
            bp_controlled: String::new(),
            ischaemic_heart_disease: "no".to_string(),
            stroke_history: "no".to_string(),
            valvular_heart_disease: "no".to_string(),
            valvular_complications: String::new(),
            hyperlipidaemia: "no".to_string(),
            family_history_vte: "no".to_string(),
            family_history_cvd: "no".to_string(),
            family_cvd_details: String::new(),
        },
        thromboembolism_risk: ThromboembolismRisk {
            previous_dvt: "no".to_string(),
            previous_pe: "no".to_string(),
            known_thrombophilia: "no".to_string(),
            thrombophilia_type: String::new(),
            immobility_risk: "no".to_string(),
            recent_major_surgery: "no".to_string(),
            long_haul_travel: "no".to_string(),
            ..Default::default()
        },
        current_medications: CurrentMedications {
            enzyme_inducing_drugs: "no".to_string(),
            anticoagulants: "no".to_string(),
            antiepileptics: "no".to_string(),
            antiretrovirals: "no".to_string(),
            antibiotics: "no".to_string(),
            ssri_snri: "no".to_string(),
            herbal_remedies: "no".to_string(),
            drug_allergies: "no".to_string(),
            ..Default::default()
        },
        lifestyle_assessment: LifestyleAssessment {
            smoking: "never".to_string(),
            cigarettes_per_day: None,
            age_over_35_smoker: "no".to_string(),
            alcohol: "none".to_string(),
            alcohol_units_per_week: None,
            recreational_drug_use: "no".to_string(),
            recreational_drug_details: String::new(),
            exercise_frequency: "regular".to_string(),
            sexual_activity: "yes".to_string(),
            number_of_partners: "one".to_string(),
        },
        contraceptive_preferences: ContraceptivePreferences {
            preferred_method: "unsure".to_string(),
            hormonal_acceptable: "yes".to_string(),
            long_acting_acceptable: "yes".to_string(),
            daily_pill_acceptable: "yes".to_string(),
            intrauterine_acceptable: "yes".to_string(),
            fertility_plans: "1-5-years".to_string(),
            breastfeeding: "no".to_string(),
            postpartum_weeks: None,
            concerns: String::new(),
        },
        clinical_recommendation: ClinicalRecommendation {
            clinical_notes: String::new(),
        },
    }
}

#[test]
fn healthy_patient_is_low_risk() {
    let data = healthy_patient();
    let result = calculate_mec_grade(&data);
    assert_eq!(result.overall_risk, "low");
    assert_eq!(result.method_mec.coc, 1);
    assert_eq!(result.method_mec.pop, 1);
    assert_eq!(result.method_mec.implant, 1);
    assert_eq!(result.method_mec.injection, 1);
    assert_eq!(result.method_mec.iud, 1);
    assert_eq!(result.method_mec.ius, 1);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn previous_dvt_yields_critical_for_coc() {
    let mut data = healthy_patient();
    data.thromboembolism_risk.previous_dvt = "yes".to_string();
    data.thromboembolism_risk.dvt_details = "DVT right leg 2023".to_string();

    let result = calculate_mec_grade(&data);
    assert_eq!(result.method_mec.coc, 4);
    assert_eq!(result.method_mec.pop, 2);
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn migraine_with_aura_yields_critical_for_coc() {
    let mut data = healthy_patient();
    data.medical_history.migraine = "yes".to_string();
    data.medical_history.migraine_with_aura = "yes".to_string();

    let result = calculate_mec_grade(&data);
    assert_eq!(result.method_mec.coc, 4);
    assert_eq!(result.method_mec.pop, 2);
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn severe_hypertension_yields_critical_for_coc() {
    let mut data = healthy_patient();
    data.cardiovascular_risk.hypertension = "yes".to_string();
    data.cardiovascular_risk.systolic_bp = Some(170);
    data.cardiovascular_risk.diastolic_bp = Some(105);

    let result = calculate_mec_grade(&data);
    assert_eq!(result.method_mec.coc, 4);
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn current_breast_cancer_yields_mec_4_for_all_hormonal_methods() {
    let mut data = healthy_patient();
    data.medical_history.breast_cancer = "current".to_string();

    let result = calculate_mec_grade(&data);
    assert_eq!(result.method_mec.coc, 4);
    assert_eq!(result.method_mec.pop, 4);
    assert_eq!(result.method_mec.implant, 4);
    assert_eq!(result.method_mec.injection, 4);
    assert_eq!(result.method_mec.ius, 4);
    // Cu-IUD is non-hormonal
    assert_eq!(result.method_mec.iud, 1);
}

#[test]
fn bmi_over_35_yields_high_risk_for_coc() {
    let mut data = healthy_patient();
    data.demographics.bmi = Some(37.0);

    let result = calculate_mec_grade(&data);
    assert_eq!(result.method_mec.coc, 3);
    assert_eq!(result.overall_risk, "high");
}

#[test]
fn over_35_heavy_smoker_yields_critical_for_coc() {
    let mut data = healthy_patient();
    data.demographics.date_of_birth = "1985-01-01".to_string();
    data.lifestyle_assessment.smoking = "current".to_string();
    data.lifestyle_assessment.cigarettes_per_day = Some(20);

    let result = calculate_mec_grade(&data);
    assert_eq!(result.method_mec.coc, 4);
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn run_rules_emits_fired_rule_records() {
    let mut data = healthy_patient();
    data.thromboembolism_risk.previous_dvt = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "VTE-001"));
    assert!(fired.iter().any(|r| r.id == "VTE-002"));
}
