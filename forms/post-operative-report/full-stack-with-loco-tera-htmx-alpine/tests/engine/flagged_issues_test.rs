use post_operative_report_tera_crate::engine::flagged_issues::detect_additional_flags;
use post_operative_report_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        patient_details: PatientDetails {
            asa_grade: "II".to_string(),
            ..PatientDetails::default()
        },
        procedure_details: ProcedureDetails {
            priority: "elective".to_string(),
            duration_minutes: Some(90),
            ..ProcedureDetails::default()
        },
        intraoperative_findings: IntraoperativeFindings {
            conversion_to_open: "no".to_string(),
            ..IntraoperativeFindings::default()
        },
        anaesthesia_summary: AnaesthesiaSummary {
            difficult_intubation: "no".to_string(),
            ..AnaesthesiaSummary::default()
        },
        blood_loss_fluid_balance: BloodLossFluidBalance {
            estimated_blood_loss_ml: Some(50),
            ..BloodLossFluidBalance::default()
        },
        immediate_postop_status: ImmediatePostopStatus {
            conscious_level: "awake".to_string(),
            systolic_bp: Some(120),
            diastolic_bp: Some(75),
            heart_rate: Some(80),
            respiratory_rate: Some(14),
            oxygen_saturation: Some(99),
            temperature: Some(36.7),
            pain_score: Some(3),
            disposition: "recovery".to_string(),
            ..ImmediatePostopStatus::default()
        },
        complications_assessment: ComplicationsAssessment {
            complications_occurred: "no".to_string(),
            ..ComplicationsAssessment::default()
        },
        postop_plan_instructions: PostopPlanInstructions {
            thromboprophylaxis: "LMWH".to_string(),
            analgesia_plan: "PCM + ibuprofen".to_string(),
            follow_up_plan: "Outpatient 6 weeks".to_string(),
            ..PostopPlanInstructions::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(
        flags.is_empty(),
        "baseline should produce no flags: {flags:?}"
    );
}

#[test]
fn grade_v_emits_urgent_flag() {
    let mut data = baseline_case();
    data.complications_assessment.complications_occurred = "yes".to_string();
    data.complications_assessment.complications = vec![Complication {
        description: "Cardiac arrest".to_string(),
        grade: "grade-v".to_string(),
        ..Complication::default()
    }];
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-CD-V")
        .expect("mortality flag");
    assert_eq!(f.priority, "urgent");
}

#[test]
fn life_threatening_emits_urgent_flag() {
    let mut data = baseline_case();
    data.complications_assessment.complications_occurred = "yes".to_string();
    data.complications_assessment.complications = vec![
        Complication {
            description: "AKI".to_string(),
            grade: "grade-iva".to_string(),
            ..Complication::default()
        },
        Complication {
            description: "MODS".to_string(),
            grade: "grade-ivb".to_string(),
            ..Complication::default()
        },
    ];
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-CD-IV")
        .expect("Grade IV flag");
    assert_eq!(f.priority, "urgent");
    assert!(f.message.contains("2"));
}

#[test]
fn asa_class_iv_emits_high_flag() {
    let mut data = baseline_case();
    data.patient_details.asa_grade = "IV".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ASA-HIGH" && f.priority == "high")
    );
}

#[test]
fn massive_blood_loss_emits_urgent_flag() {
    let mut data = baseline_case();
    data.blood_loss_fluid_balance.estimated_blood_loss_ml = Some(2000);
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-BLOOD-MASSIVE")
        .expect("massive blood loss flag");
    assert_eq!(f.priority, "urgent");
    assert!(f.message.contains("2000"));
}

#[test]
fn significant_blood_loss_emits_medium_flag() {
    let mut data = baseline_case();
    data.blood_loss_fluid_balance.estimated_blood_loss_ml = Some(700);
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-BLOOD-SIGNIFICANT")
        .expect("significant blood loss flag");
    assert_eq!(f.priority, "medium");
}

#[test]
fn hypotension_emits_urgent_flag() {
    let mut data = baseline_case();
    data.immediate_postop_status.systolic_bp = Some(80);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-VITAL-HYPOTENSION" && f.priority == "urgent")
    );
}

#[test]
fn icu_disposition_emits_high_flag() {
    let mut data = baseline_case();
    data.immediate_postop_status.disposition = "icu".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DISP-ICU" && f.priority == "high")
    );
}

#[test]
fn missing_vte_plan_emits_medium_flag() {
    let mut data = baseline_case();
    data.postop_plan_instructions.thromboprophylaxis = String::new();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PLAN-VTE" && f.priority == "medium")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // urgent: hypotension; high: ASA IV; medium: ASA III (suppressed by IV); low: missing follow-up.
    data.immediate_postop_status.systolic_bp = Some(80);
    data.patient_details.asa_grade = "IV".to_string();
    data.postop_plan_instructions.follow_up_plan = String::new();
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
}
