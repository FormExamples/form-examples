//! End-to-end assertions on the fit-note grading engine.
//!
//! Mirrors the headline assertions in
//! `front-end-form-with-html/js/grader.js` so the Rust and JavaScript
//! implementations stay aligned.

use united_kingdom_statement_of_fitness_for_work_loco_crate::engine::grade_fit_note;
use united_kingdom_statement_of_fitness_for_work_loco_crate::engine::types::AssessmentData;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

fn populated_issuer(fit_note: &mut AssessmentData) {
    fit_note.clinician.name = "Dr Jane Smith".into();
    fit_note.clinician.profession = "doctor".into();
    fit_note.medical_practice.postal_address_as_full_text =
        "1 Main Street, London".into();
}

#[test]
fn empty_form_fails_all_three_validity_rules_and_recommends_review() {
    let data = empty();
    let g = grade_fit_note(&data);
    assert_eq!(g.is_valid, "no");
    assert_eq!(g.recommendation, "review_for_validity");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-VALID-NAME-001"));
    assert!(
        g.fired_rules
            .iter()
            .any(|r| r.rule_id == "R-VALID-PROFESSION-001")
    );
    assert!(
        g.fired_rules
            .iter()
            .any(|r| r.rule_id == "R-VALID-PRACTICE-001")
    );
}

#[test]
fn comprehensive_adaptations_recommend_occupational_health() {
    let mut data = empty();
    populated_issuer(&mut data);
    data.fitness_for_work = "may_be_fit".into();
    data.adaptation_phased_return = "yes".into();
    data.adaptation_altered_hours = "yes".into();
    data.adaptation_amended_duties = "yes".into();
    data.adaptation_workplace_adaptations = "yes".into();
    data.comments = "Patient to work shorter days for two weeks.".into();
    data.period_type = "duration".into();
    data.period_duration_value = Some(2);
    data.period_duration_unit = "weeks".into();

    let g = grade_fit_note(&data);
    assert_eq!(g.is_valid, "yes");
    assert_eq!(g.adaptation_intensity, "comprehensive");
    assert_eq!(g.adaptation_count, 4);
    assert_eq!(g.recommendation, "refer_occupational_health");
}

#[test]
fn very_long_period_recommends_access_to_work() {
    let mut data = empty();
    populated_issuer(&mut data);
    data.fitness_for_work = "not_fit".into();
    data.period_type = "duration".into();
    data.period_duration_value = Some(200);
    data.period_duration_unit = "days".into();

    let g = grade_fit_note(&data);
    assert_eq!(g.period_compliance, "very_long_term");
    assert_eq!(g.recommendation, "refer_access_to_work");
}

#[test]
fn period_under_seven_days_flags_self_certification() {
    let mut data = empty();
    populated_issuer(&mut data);
    data.fitness_for_work = "not_fit".into();
    data.period_type = "duration".into();
    data.period_duration_value = Some(3);
    data.period_duration_unit = "days".into();

    let g = grade_fit_note(&data);
    assert_eq!(g.period_compliance, "self_cert_range");
    assert!(g.safety_flags.iter().any(|f| f.flag_id == "F-SELF-CERT"));
}

#[test]
fn diagnosis_keyword_triggers_automatic_disability_flag() {
    let mut data = empty();
    populated_issuer(&mut data);
    data.diagnosis_text = "Stage II breast cancer under treatment.".into();

    let g = grade_fit_note(&data);
    assert!(
        g.safety_flags
            .iter()
            .any(|f| f.category == "automatic_disability")
    );
    assert_eq!(g.recommendation, "refer_access_to_work");
}

#[test]
fn safeguarding_concern_fires_high_severity_rule() {
    let mut data = empty();
    populated_issuer(&mut data);
    data.safeguarding_concern = "yes".into();

    let g = grade_fit_note(&data);
    assert!(
        g.fired_rules
            .iter()
            .any(|r| r.rule_id == "R-SAFE-SAFEGUARDING-001" && r.severity == "high")
    );
}

#[test]
fn safety_flag_ids_are_preserved_verbatim() {
    let mut data = empty();
    data.is_non_medical = "yes".into();
    let g = grade_fit_note(&data);
    assert!(g.safety_flags.iter().any(|f| f.flag_id == "F-NON-MEDICAL"));
    assert!(g.safety_flags.iter().any(|f| f.flag_id == "F-VALID-NAME"));
}
