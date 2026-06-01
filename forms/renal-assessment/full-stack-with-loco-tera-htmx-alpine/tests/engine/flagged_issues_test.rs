use renal_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use renal_assessment_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            sex: "male".to_string(),
            age: Some(60),
            ..Demographics::default()
        },
        blood_tests: BloodTests {
            egfr: Some(85.0),
            potassium: Some(4.5),
            bicarbonate: Some(24.0),
            hemoglobin: Some(140.0),
            phosphate: Some(1.0),
            calcium: Some(2.4),
            ..BloodTests::default()
        },
        physical_examination: PhysicalExamination {
            systolic_bp: Some(120),
            diastolic_bp: Some(80),
            ..PhysicalExamination::default()
        },
        urine_tests: UrineTests {
            acr: Some(1.0),
            ..UrineTests::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn severe_hyperkalemia_is_urgent() {
    let mut data = baseline_case();
    data.blood_tests.potassium = Some(7.0);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-K-001").expect("hyperkalemia flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn moderate_hyperkalemia_is_high() {
    let mut data = baseline_case();
    data.blood_tests.potassium = Some(6.2);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-K-002").expect("hyperkalemia flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn severe_acidosis_is_high() {
    let mut data = baseline_case();
    data.blood_tests.bicarbonate = Some(15.0);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-ACID-001").expect("acidosis flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn kidney_failure_egfr_is_urgent() {
    let mut data = baseline_case();
    data.blood_tests.egfr = Some(10.0);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-EGFR-001").expect("egfr flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn severe_albuminuria_is_high() {
    let mut data = baseline_case();
    data.urine_tests.acr = Some(40.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ACR-001" && f.priority == "high"));
}

#[test]
fn severe_anemia_is_high() {
    let mut data = baseline_case();
    data.blood_tests.hemoglobin = Some(85.0);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-HB-001").expect("anemia flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn aki_on_ckd_is_urgent() {
    let mut data = baseline_case();
    data.clinical_impression.aksuperimposed_on_ckd = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-AKI-001" && f.priority == "urgent"));
}

#[test]
fn severe_hypertension_is_urgent() {
    let mut data = baseline_case();
    data.physical_examination.systolic_bp = Some(190);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-BP-001").expect("BP flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn nephrotoxic_drug_exposure_is_high() {
    let mut data = baseline_case();
    data.ckd_risk_factors.nephrotoxic_drugs = "yes".to_string();
    data.ckd_risk_factors.nephrotoxic_drug_details = "Gentamicin".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-NEPH-001").expect("neph flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Gentamicin"));
}

#[test]
fn hydronephrosis_emits_high_flag() {
    let mut data = baseline_case();
    data.imaging_biopsy.hydronephrosis = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-IMG-001" && f.priority == "high"));
}

#[test]
fn flags_are_sorted_urgent_first() {
    let mut data = baseline_case();
    data.clinical_impression.aksuperimposed_on_ckd = "yes".to_string(); // urgent
    data.urine_tests.acr = Some(40.0); // high (A3)
    data.ckd_risk_factors.hypertension = "yes".to_string(); // low
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
    assert_eq!(priorities[0], "urgent");
}
