use bone_marrow_donation_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use bone_marrow_donation_assessment_tera_crate::engine::types::*;

#[test]
fn empty_assessment_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty(), "no flags expected for empty assessment");
}

#[test]
fn positive_crossmatch_raises_high_flag() {
    let mut data = AssessmentData::default();
    data.donor_registration_hla_typing.crossmatch_result = "positive".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-HLA-001" && f.priority == "high")
    );
}

#[test]
fn hiv_positive_raises_high_flag() {
    let mut data = AssessmentData::default();
    data.infectious_disease_screening.hiv_status = "positive".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ID-hivStatus" && f.priority == "high")
    );
}

#[test]
fn coercion_concerns_high_flag() {
    let mut data = AssessmentData::default();
    data.psychological_readiness.coercion_concerns = "yes".to_string();
    data.psychological_readiness.coercion_details = "Family pressure".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PS-001" && f.priority == "high")
    );
}

#[test]
fn flags_are_sorted_high_first() {
    let mut data = AssessmentData::default();
    data.anaesthetic_assessment.smoking_status = "current".to_string(); // low
    data.psychological_readiness.coercion_concerns = "yes".to_string(); // high
    data.physical_examination.cardiovascular_examination = "abnormal".to_string(); // medium
    let flags = detect_additional_flags(&data);
    assert_eq!(flags[0].priority, "high");
    assert!(flags.iter().any(|f| f.priority == "medium"));
    assert!(flags.iter().any(|f| f.priority == "low"));
}
