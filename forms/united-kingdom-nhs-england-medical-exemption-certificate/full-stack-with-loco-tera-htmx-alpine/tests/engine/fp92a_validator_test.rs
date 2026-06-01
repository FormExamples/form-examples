use united_kingdom_nhs_england_medical_exemption_certificate_tera_crate::engine::fp92a_rules::fp92a_rules;
use united_kingdom_nhs_england_medical_exemption_certificate_tera_crate::engine::fp92a_validator::validate_fp92a;
use united_kingdom_nhs_england_medical_exemption_certificate_tera_crate::engine::types::*;

fn fully_populated_eligible() -> ApplicationData {
    let mut d = ApplicationData::default();
    d.patient.surname = "Smith".into();
    d.patient.forenames = "Jane".into();
    d.patient.birth_date = "1980-04-01".into();
    d.patient.united_kingdom_nhs_number = "9434765919".into();
    d.patient.postal_address_as_full_text = "1 High St, Newcastle".into();
    d.patient.pregnancy_status = "not-pregnant".into();
    d.practitioner.name = "Dr Alex Doctor".into();
    d.practitioner.registration_body = "GMC".into();
    d.practitioner.registration_number = "1234567".into();
    d.practitioner.practice_name = "High St Surgery".into();
    d.practitioner.completed_date = "2026-05-18".into();
    d.declaration.signature_present = "yes".into();
    d.declaration.access_to_medical_records = "yes".into();
    d.conditions.push(QualifyingCondition {
        code: "epilepsy-on-anticonvulsant".into(),
        selected: "yes".into(),
        continuous_anticonvulsant_therapy: "yes".into(),
        anticonvulsant: "Levetiracetam 500mg BD".into(),
        ..Default::default()
    });
    d
}

#[test]
fn empty_application_is_ineligible() {
    let r = validate_fp92a(&ApplicationData::default());
    assert_eq!(r.outcome, "ineligible");
    assert!(r
        .fired_rules
        .iter()
        .any(|x| x.id == "FP92A-CP-NO-CONDITION-SELECTED"));
}

#[test]
fn pregnancy_redirects_to_fw8() {
    let mut d = fully_populated_eligible();
    d.patient.pregnancy_status = "pregnant".into();
    let r = validate_fp92a(&d);
    assert_eq!(r.redirect_to, "FW8");
    assert_eq!(r.outcome, "ineligible");
}

#[test]
fn diet_only_diabetes_is_disqualifying() {
    let mut d = fully_populated_eligible();
    d.conditions.clear();
    d.conditions.push(QualifyingCondition {
        code: "diabetes-mellitus-not-diet-only".into(),
        selected: "yes".into(),
        diabetes_treatment_mode: "diet-only".into(),
        ..Default::default()
    });
    let r = validate_fp92a(&d);
    assert!(r
        .fired_rules
        .iter()
        .any(|x| x.id == "FP92A-DQ-DIET-ONLY-DIABETES"));
    assert_ne!(r.outcome, "eligible");
}

#[test]
fn eligible_when_epilepsy_attested_and_all_fields_complete() {
    let d = fully_populated_eligible();
    let r = validate_fp92a(&d);
    assert_eq!(r.outcome, "eligible", "fired: {:?}", r.fired_rules);
    assert!(r
        .eligible_condition_codes
        .contains(&"epilepsy-on-anticonvulsant".to_string()));
}

#[test]
fn cancer_pending_histology_requires_clarification() {
    let mut d = fully_populated_eligible();
    d.conditions.clear();
    d.conditions.push(QualifyingCondition {
        code: "cancer-or-effects".into(),
        selected: "yes".into(),
        cancer_site: "Breast".into(),
        cancer_treatment_phase: "active-treatment".into(),
        histology_confirmed: "pending".into(),
        ..Default::default()
    });
    let r = validate_fp92a(&d);
    assert_eq!(r.outcome, "requires-clarification");
}

#[test]
fn rule_ids_are_unique() {
    let rules = fp92a_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn validity_window_is_five_years() {
    let d = fully_populated_eligible();
    let r = validate_fp92a(&d);
    assert_eq!(r.validity_years, 5);
    assert!(!r.valid_from.is_empty());
    assert!(!r.valid_until.is_empty());
}
