use bone_marrow_donation_assessment_loco_crate::engine::donor_grader::{evaluate_rules, grade};
use bone_marrow_donation_assessment_loco_crate::engine::donor_rules::all_rules;
use bone_marrow_donation_assessment_loco_crate::engine::types::*;

/// Build a clean donor with ideal HLA match, ASA I, normal labs.
fn ideal_donor() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Alex".to_string(),
            last_name: "Donor".to_string(),
            date_of_birth: "1990-04-11".to_string(),
            sex: "female".to_string(),
            weight: Some(72.0),
            height: Some(170.0),
            bmi: Some(24.9),
        },
        donor_registration_hla_typing: DonorRegistrationHlaTyping {
            donor_registry: "NHS Blood and Transplant".to_string(),
            donor_registry_id: "REG-001".to_string(),
            registration_date: "2024-01-01".to_string(),
            donation_type: "unrelated".to_string(),
            recipient_relationship: String::new(),
            hla_a: "A*01:01".to_string(),
            hla_b: "B*08:01".to_string(),
            hla_c: "C*07:01".to_string(),
            hla_drb1: "DRB1*03:01".to_string(),
            hla_dqb1: "DQB1*02:01".to_string(),
            hla_dpb1: "DPB1*04:01".to_string(),
            hla_match_level: "10-of-10".to_string(),
            crossmatch_result: "negative".to_string(),
            previous_donation: "no".to_string(),
            previous_donation_details: String::new(),
        },
        medical_history: MedicalHistory::default(),
        physical_examination: PhysicalExamination {
            oxygen_saturation: Some(99),
            general_appearance: "well".to_string(),
            cardiovascular_examination: "normal".to_string(),
            respiratory_examination: "normal".to_string(),
            abdominal_examination: "normal".to_string(),
            venous_access_assessment: "good".to_string(),
            posterior_iliac_crest_assessment: "suitable".to_string(),
            ..Default::default()
        },
        haematological_assessment: HaematologicalAssessment {
            haemoglobin: Some(14.0),
            platelet_count: Some(250.0),
            creatinine: Some(80.0),
            coagulation_screen: "normal".to_string(),
            liver_function: "normal".to_string(),
            ..Default::default()
        },
        infectious_disease_screening: InfectiousDiseaseScreening {
            hiv_status: "negative".to_string(),
            hepatitis_b_surface_antigen: "negative".to_string(),
            hepatitis_b_core_antibody: "negative".to_string(),
            hepatitis_c_abntibody: "negative".to_string(),
            htlv_status: "negative".to_string(),
            syphilis_screen: "negative".to_string(),
            tuberculosis_screen: "negative".to_string(),
            vaccination_up_to_date: "yes".to_string(),
            ..Default::default()
        },
        anaesthetic_assessment: AnaestheticAssessment {
            asa_grade: "I".to_string(),
            mallampati_score: "I".to_string(),
            smoking_status: "never".to_string(),
            alcohol_use: "none".to_string(),
            ..Default::default()
        },
        collection_method_assessment: CollectionMethodAssessment {
            preferred_method: "pbsc".to_string(),
            final_collection_method: "pbsc".to_string(),
            gcsf_eligible: "yes".to_string(),
            venous_access_suitable_for_apheresis: "yes".to_string(),
            central_line_required: "no".to_string(),
            ..Default::default()
        },
        psychological_readiness: PsychologicalReadiness {
            understands_procedure: "yes".to_string(),
            understands_risks: "yes".to_string(),
            voluntary_decision: "yes".to_string(),
            coercion_concerns: "no".to_string(),
            anxiety_about_procedure: "none".to_string(),
            support_network: "yes".to_string(),
            donor_advocate_consulted: "yes".to_string(),
            willing_to_proceed: "yes".to_string(),
            ..Default::default()
        },
        consent_eligibility: ConsentEligibility {
            informed_consent_given: "yes".to_string(),
            consent_form_signed: "yes".to_string(),
            information_leaflet_provided: "yes".to_string(),
            questions_answered: "yes".to_string(),
            ..Default::default()
        },
    }
}

#[test]
fn ideal_donor_is_suitable_low_risk() {
    let data = ideal_donor();
    let result = grade(&data);
    assert_eq!(result.eligibility, "suitable");
    assert_eq!(result.overall_risk, "low");
    // HLA-001 (ideal-donor marker) is allowed to fire but should not penalise.
    assert!(result.fired_rules.iter().any(|r| r.id == "HLA-001"));
    assert!(result.fired_rules.iter().any(|r| r.id == "AN-001"));
}

#[test]
fn hiv_positive_is_unsuitable_critical() {
    let mut data = ideal_donor();
    data.infectious_disease_screening.hiv_status = "positive".to_string();
    let result = grade(&data);
    assert_eq!(result.eligibility, "unsuitable");
    assert_eq!(result.overall_risk, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "ID-001"));
}

#[test]
fn seven_of_ten_match_fires_hla_004() {
    let mut data = ideal_donor();
    data.donor_registration_hla_typing.hla_match_level = "7-of-10".to_string();
    let fired = evaluate_rules(&data);
    assert!(fired.iter().any(|r| r.id == "HLA-004" && r.grade == 4));
}

#[test]
fn single_grade2_finding_is_conditionally_suitable_moderate() {
    let mut data = ideal_donor();
    data.haematological_assessment.haemoglobin = Some(11.5);
    let result = grade(&data);
    assert_eq!(result.eligibility, "conditionally-suitable");
    assert_eq!(result.overall_risk, "moderate");
}

#[test]
fn assessor_override_wins() {
    let mut data = ideal_donor();
    // engine would say suitable; assessor records unsuitable.
    data.consent_eligibility.eligibility_decision = "unsuitable".to_string();
    let result = grade(&data);
    assert_eq!(result.eligibility, "unsuitable");
    // suggested still reflects engine output (suitable).
    assert_eq!(result.suggested_eligibility, "suitable");
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
