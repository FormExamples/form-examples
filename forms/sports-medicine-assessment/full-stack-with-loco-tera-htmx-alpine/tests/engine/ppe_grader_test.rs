use sports_medicine_assessment_tera_crate::engine::ppe_grader::{
    aggregate_clearance, grade, run_rules,
};
use sports_medicine_assessment_tera_crate::engine::ppe_rules::all_rules;
use sports_medicine_assessment_tera_crate::engine::types::*;

/// Build a "healthy male athlete, no concerns" baseline that should result in
/// a Cleared clearance with no rules fired.
fn cleared_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Alex".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "2002-05-12".to_string(),
            sex: "male".to_string(),
            weight: Some(75.0),
            height: Some(180.0),
            bmi: Some(23.1),
            emergency_contact_name: "Pat Doe".to_string(),
            emergency_contact_phone: "555-1234".to_string(),
        },
        sport_position_details: SportPositionDetails {
            primary_sport: "Soccer".to_string(),
            primary_position: "Midfielder".to_string(),
            contact_level: "moderate".to_string(),
            secondary_sports: String::new(),
            competitive_level: "club".to_string(),
            hours_per_week: Some(10.0),
            previous_clearance_issue: "no".to_string(),
            previous_clearance_details: String::new(),
        },
        medical_history: MedicalHistory {
            chronic_illness: "no".to_string(),
            current_medications: "no".to_string(),
            allergies_known: "no".to_string(),
            prior_surgery: "no".to_string(),
            hospitalised_last_year: "no".to_string(),
            asthma_or_exercise_induced_bronchospasm: "no".to_string(),
            diabetes: "no".to_string(),
            sickle_cell_trait_or_disease: "no".to_string(),
            heat_illness_history: "no".to_string(),
            eating_disorder_history: "no".to_string(),
            ..MedicalHistory::default()
        },
        family_history: FamilyHistory {
            sudden_cardiac_death_under_50: "no".to_string(),
            hypertrophic_cardiomyopathy: "no".to_string(),
            marfan_syndrome: "no".to_string(),
            long_qt_syndrome: "no".to_string(),
            arrhythmia_or_pacemaker: "no".to_string(),
            unexplained_seizure_or_fainting: "no".to_string(),
            ..FamilyHistory::default()
        },
        cardiovascular_screening: CardiovascularScreening {
            chest_pain_with_exertion: "no".to_string(),
            unexplained_syncope: "no".to_string(),
            excessive_breathlessness: "no".to_string(),
            palpitations_or_irregular_beat: "no".to_string(),
            high_blood_pressure_diagnosis: "no".to_string(),
            heart_murmur_detected: "no".to_string(),
            restricted_activity_for_heart: "no".to_string(),
            resting_systolic: Some(118),
            resting_diastolic: Some(76),
            resting_heart_rate: Some(62),
        },
        musculoskeletal_screening: MusculoskeletalScreening {
            uncorrected_major_injury: "no".to_string(),
            joint_instability: "no".to_string(),
            ongoing_pain_or_swelling: "no".to_string(),
            chronic_joint_disease: "no".to_string(),
            use_brace_or_assistive_device: "no".to_string(),
            full_range_of_motion: "yes".to_string(),
            normal_strength_bilateral: "yes".to_string(),
            ..MusculoskeletalScreening::default()
        },
        neurological_concussion_baseline: NeurologicalConcussionBaseline {
            total_concussions: Some(0),
            concussion_last_six_months: "no".to_string(),
            ongoing_post_concussive_symptoms: "no".to_string(),
            history_of_seizures: "no".to_string(),
            stinger: "no".to_string(),
            history_of_head_or_neck_surgery: "no".to_string(),
            baseline_headaches_or_migraine: "no".to_string(),
            ..NeurologicalConcussionBaseline::default()
        },
        vision_skin: VisionSkin {
            corrective_lenses_worn: "no".to_string(),
            monocular_athlete: "no".to_string(),
            protective_eyewear_available: "yes".to_string(),
            active_skin_infection: "no".to_string(),
            herpes_gladiatorum: "no".to_string(),
            impetigo_or_mrsa: "no".to_string(),
            open_wounds_or_lesions: "no".to_string(),
            ..VisionSkin::default()
        },
        clearance_decision: ClearanceDecision {
            preferred_clearance: "cleared".to_string(),
            clinician_name: "Dr Casey".to_string(),
            clinician_signature_date: "2026-06-01".to_string(),
            ..ClearanceDecision::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_yields_cleared_when_no_rules_fire() {
    // With all enums empty, no rule fires; aggregate yields "cleared".
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.clearance, "cleared");
    assert!(result.fired_rules.is_empty());
}

#[test]
fn baseline_healthy_athlete_is_cleared() {
    let data = cleared_case();
    let result = grade(&data);
    assert_eq!(result.clearance, "cleared");
    assert!(result.fired_rules.is_empty(), "{:?}", result.fired_rules);
}

#[test]
fn chest_pain_with_exertion_is_not_cleared() {
    let mut data = cleared_case();
    data.cardiovascular_screening.chest_pain_with_exertion = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.clearance, "not-cleared");
    assert!(result.fired_rules.iter().any(|r| r.id == "PPE-030"));
}

#[test]
fn family_scd_under_50_is_not_cleared() {
    let mut data = cleared_case();
    data.family_history.sudden_cardiac_death_under_50 = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.clearance, "not-cleared");
    assert!(result.fired_rules.iter().any(|r| r.id == "PPE-010"));
}

#[test]
fn ongoing_post_concussive_symptoms_is_not_cleared() {
    let mut data = cleared_case();
    data.neurological_concussion_baseline.ongoing_post_concussive_symptoms = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.clearance, "not-cleared");
    assert!(result.fired_rules.iter().any(|r| r.id == "PPE-052"));
}

#[test]
fn chronic_illness_alone_is_conditional() {
    let mut data = cleared_case();
    data.medical_history.chronic_illness = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.clearance, "conditional");
    assert!(result.fired_rules.iter().any(|r| r.id == "PPE-001"));
}

#[test]
fn marfan_alone_is_pending() {
    let mut data = cleared_case();
    data.family_history.marfan_syndrome = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.clearance, "pending");
    assert!(result.fired_rules.iter().any(|r| r.id == "PPE-012"));
}

#[test]
fn reds_triad_in_female_athlete_is_not_cleared() {
    let mut data = cleared_case();
    data.demographics.sex = "female".to_string();
    data.menstrual_history_reds = MenstrualHistoryReds {
        applicable: true,
        amenorrhoea_six_months: "yes".to_string(),
        restrictive_eating_pattern: "yes".to_string(),
        stress_fracture_history: "yes".to_string(),
        ..MenstrualHistoryReds::default()
    };
    let result = grade(&data);
    assert_eq!(result.clearance, "not-cleared");
    assert!(result.fired_rules.iter().any(|r| r.id == "PPE-023"));
}

#[test]
fn high_resting_bp_fires_ppe_036() {
    let mut data = cleared_case();
    data.cardiovascular_screening.resting_systolic = Some(150);
    data.cardiovascular_screening.resting_diastolic = Some(95);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "PPE-036"));
}

#[test]
fn three_lifetime_concussions_fires_ppe_051() {
    let mut data = cleared_case();
    data.neurological_concussion_baseline.total_concussions = Some(3);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "PPE-051"));
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
fn aggregate_clearance_picks_highest_grade() {
    let rules = vec![
        FiredRule {
            id: "A".to_string(),
            category: "x".to_string(),
            description: "".to_string(),
            grade: 2,
        },
        FiredRule {
            id: "B".to_string(),
            category: "x".to_string(),
            description: "".to_string(),
            grade: 3,
        },
    ];
    assert_eq!(aggregate_clearance(&rules), "pending");
}
