use outpatient_outcome_tera_crate::engine::oocg_grader::grade_oocg;
use outpatient_outcome_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        patient_details: PatientDetails {
            given_name: "Jane".to_string(),
            family_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            nhs_number: "943 476 5919".to_string(),
            sex: "female".to_string(),
        },
        encounter_details: EncounterDetails {
            clinic_date: "2026-06-01".to_string(),
            specialty: "Cardiology".to_string(),
            clinician_name: "Dr Singh".to_string(),
            modality: "in_person".to_string(),
            appointment_type: "follow_up".to_string(),
        },
        operational_efficiency: OperationalEfficiency {
            referral_date: "2026-05-01".to_string(),
            appointment_date: "2026-06-01".to_string(),
            wait_time_days: Some(31),
            service_target_days: Some(42),
            nhs_attendance_outcome: "attended_discharged".to_string(),
        },
        clinical_outcome: ClinicalOutcome {
            presenting_complaint: "Chest pain".to_string(),
            diagnosis: "Stable angina".to_string(),
            treatment_delivered: "Medication review".to_string(),
            outcome_classification: "improved".to_string(),
        },
        prom_eq5d5l: PromEq5d5l::default(),
        prom_grc: PromGrc {
            global_rating_of_change: Some(2),
            self_rated_health: "good".to_string(),
        },
        prom_promis: PromPromis::default(),
        prem_fft: PremFft {
            fft_response: "likely".to_string(),
            fft_comment: String::new(),
        },
        followup_plan: FollowupPlan {
            disposition: "discharge".to_string(),
            ..FollowupPlan::default()
        },
        sign_off: SignOff {
            reporting_clinician_name: "Dr Singh".to_string(),
            reporting_clinician_role: "Consultant".to_string(),
            signed_off_at: "2026-06-01T10:00".to_string(),
        },
    }
}

#[test]
fn empty_assessment_has_empty_overall_grade() {
    let data = AssessmentData::default();
    let r = grade_oocg(&data);
    assert_eq!(r.overall_grade, "");
    assert_eq!(r.clinical_grade, "");
    assert_eq!(r.prom_grade, "");
    assert_eq!(r.prem_grade, "");
    assert_eq!(r.operational_grade, "");
}

#[test]
fn clinical_resolved_yields_grade_a() {
    let mut data = baseline_case();
    data.clinical_outcome.outcome_classification = "resolved".to_string();
    let r = grade_oocg(&data);
    assert_eq!(r.clinical_grade, "A");
    assert!(r.fired_rules.iter().any(|x| x.id == "CLIN-001"));
}

#[test]
fn clinical_died_yields_grade_e_and_high_priority_flag() {
    let mut data = baseline_case();
    data.clinical_outcome.outcome_classification = "died".to_string();
    let r = grade_oocg(&data);
    assert_eq!(r.clinical_grade, "E");
    assert_eq!(r.overall_grade, "E");
    assert!(r.fired_rules.iter().any(|x| x.id == "CLIN-005"));
    assert!(
        r.flagged_issues
            .iter()
            .any(|f| f.id == "FLAG-CLIN-002" && f.priority == "high")
    );
}

#[test]
fn prem_extremely_unlikely_yields_grade_e_and_medium_flag() {
    let mut data = baseline_case();
    data.prem_fft.fft_response = "extremely_unlikely".to_string();
    let r = grade_oocg(&data);
    assert_eq!(r.prem_grade, "E");
    assert!(r.fired_rules.iter().any(|x| x.id == "PREM-005"));
    assert!(
        r.flagged_issues
            .iter()
            .any(|f| f.id == "FLAG-PREM-002" && f.priority == "medium")
    );
}

#[test]
fn operational_dna_yields_grade_e_and_critical_flag() {
    let mut data = baseline_case();
    data.operational_efficiency.nhs_attendance_outcome = "patient_dna".to_string();
    let r = grade_oocg(&data);
    assert_eq!(r.operational_grade, "E");
    assert!(r.fired_rules.iter().any(|x| x.id == "OPS-004"));
    assert!(
        r.flagged_issues
            .iter()
            .any(|f| f.id == "FLAG-OPS-001" && f.priority == "critical")
    );
}

#[test]
fn operational_provider_cancelled_yields_grade_e_and_critical_flag() {
    let mut data = baseline_case();
    data.operational_efficiency.nhs_attendance_outcome = "provider_cancelled".to_string();
    let r = grade_oocg(&data);
    assert_eq!(r.operational_grade, "E");
    assert!(
        r.flagged_issues
            .iter()
            .any(|f| f.id == "FLAG-OPS-002" && f.priority == "critical")
    );
}

#[test]
fn operational_within_target_yields_grade_a() {
    let mut data = baseline_case();
    data.operational_efficiency.wait_time_days = Some(20);
    data.operational_efficiency.service_target_days = Some(42);
    let r = grade_oocg(&data);
    assert_eq!(r.operational_grade, "A");
    assert!(r.fired_rules.iter().any(|x| x.id == "OPS-001"));
}

#[test]
fn operational_within_1_5x_target_yields_grade_b() {
    let mut data = baseline_case();
    data.operational_efficiency.wait_time_days = Some(50);
    data.operational_efficiency.service_target_days = Some(42);
    let r = grade_oocg(&data);
    assert_eq!(r.operational_grade, "B");
    assert!(r.fired_rules.iter().any(|x| x.id == "OPS-002A"));
}

#[test]
fn operational_beyond_1_5x_target_yields_grade_c() {
    let mut data = baseline_case();
    data.operational_efficiency.wait_time_days = Some(100);
    data.operational_efficiency.service_target_days = Some(42);
    let r = grade_oocg(&data);
    assert_eq!(r.operational_grade, "C");
    assert!(r.fired_rules.iter().any(|x| x.id == "OPS-002B"));
}

#[test]
fn overall_is_worst_of_four_domains() {
    let mut data = baseline_case();
    data.clinical_outcome.outcome_classification = "improved".to_string(); // B
    data.prem_fft.fft_response = "extremely_unlikely".to_string(); // E
    data.operational_efficiency.nhs_attendance_outcome = "attended_discharged".to_string(); // A
    let r = grade_oocg(&data);
    assert_eq!(r.overall_grade, "E");
}

#[test]
fn prom_all_three_improved_yields_grade_a() {
    let mut data = baseline_case();
    // EQ-5D-5L: every after-value is one lower than before (i.e. improvement),
    // and VAS rises.
    data.prom_eq5d5l = PromEq5d5l {
        before_mobility: Some(3),
        before_self_care: Some(3),
        before_usual_activities: Some(3),
        before_pain_discomfort: Some(3),
        before_anxiety_depression: Some(3),
        before_vas: Some(40),
        after_mobility: Some(2),
        after_self_care: Some(2),
        after_usual_activities: Some(2),
        after_pain_discomfort: Some(2),
        after_anxiety_depression: Some(2),
        after_vas: Some(80),
    };
    data.prom_grc.global_rating_of_change = Some(3); // improved
    // PROMIS: max possible scores
    data.prom_promis = PromPromis {
        item1_general_health: Some(5),
        item2_quality_of_life: Some(5),
        item3_physical_health: Some(5),
        item4_mental_health: Some(5),
        item5_satisfaction: Some(5),
        item6_fatigue_frequency: Some(1),
        item7_emotional_problems: Some(1),
        item8_social_activities: Some(5),
        item9_pain: Some(0),
        item10_everyday_activities: Some(5),
        global_physical_health_t_score: None,
        global_mental_health_t_score: None,
    };
    let r = grade_oocg(&data);
    assert_eq!(r.prom_grade, "A");
    assert!(r.fired_rules.iter().any(|x| x.id == "PROM-001"));
}

#[test]
fn fft_dont_know_emits_data_quality_flag() {
    let mut data = baseline_case();
    data.prem_fft.fft_response = "dont_know".to_string();
    let r = grade_oocg(&data);
    assert!(r.flagged_issues.iter().any(|f| f.id == "FLAG-DQ-003"));
}
