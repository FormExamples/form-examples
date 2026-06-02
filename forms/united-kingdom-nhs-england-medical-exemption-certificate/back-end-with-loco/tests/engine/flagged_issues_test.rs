use united_kingdom_nhs_england_medical_exemption_certificate_loco_crate::engine::flagged_issues::detect_additional_flags;
use united_kingdom_nhs_england_medical_exemption_certificate_loco_crate::engine::types::*;

fn baseline() -> ApplicationData {
    let mut d = ApplicationData::default();
    d.patient.united_kingdom_nhs_number = "9434765919".into();
    d.declaration.signature_present = "yes".into();
    d
}

#[test]
fn missing_nhs_number_emits_high_priority_flag() {
    let mut d = baseline();
    d.patient.united_kingdom_nhs_number = "".into();
    let flags = detect_additional_flags(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-NHS-NUMBER-HIGH-001" && matches!(f.priority, RulePriority::High)));
}

#[test]
fn missing_signature_emits_high_priority_flag() {
    let mut d = baseline();
    d.declaration.signature_present = "no".into();
    let flags = detect_additional_flags(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-SIGNATURE-HIGH-001" && matches!(f.priority, RulePriority::High)));
}

#[test]
fn active_certificate_emits_medium_flag() {
    let mut d = baseline();
    d.existing_exemption.has_existing_certificate = "yes".into();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-ACTIVE-CERT-MED-001"));
}

#[test]
fn pregnancy_emits_medium_flag() {
    let mut d = baseline();
    d.patient.pregnancy_status = "pregnant".into();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-PREGNANCY-MED-001"));
}

#[test]
fn cancer_histology_pending_emits_medium_flag() {
    let mut d = baseline();
    d.conditions.push(QualifyingCondition {
        code: "cancer-or-effects".into(),
        selected: "yes".into(),
        histology_confirmed: "pending".into(),
        ..Default::default()
    });
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-CANCER-HISTOLOGY-MED-001"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut d = baseline();
    d.patient.united_kingdom_nhs_number = "".into();
    d.existing_exemption.has_existing_certificate = "yes".into();
    let flags = detect_additional_flags(&d);
    let priorities: Vec<u8> = flags.iter().map(|f| f.priority.order()).collect();
    let mut sorted = priorities.clone();
    sorted.sort();
    assert_eq!(priorities, sorted);
}
