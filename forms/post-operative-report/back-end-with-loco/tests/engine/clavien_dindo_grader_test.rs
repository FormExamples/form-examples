use post_operative_report_loco_crate::engine::clavien_dindo_grader::{calculate_clavien_dindo, grade};
use post_operative_report_loco_crate::engine::clavien_dindo_rules::all_rules;
use post_operative_report_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        patient_details: PatientDetails {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            mrn: "MRN-001".to_string(),
            sex: "female".to_string(),
            weight: Some(72.0),
            height: Some(168.0),
            asa_grade: "II".to_string(),
            allergies: String::new(),
        },
        procedure_details: ProcedureDetails {
            procedure_name: "Laparoscopic cholecystectomy".to_string(),
            procedure_code: String::new(),
            indication: "Symptomatic cholelithiasis".to_string(),
            priority: "elective".to_string(),
            surgical_approach: "laparoscopic".to_string(),
            laterality: "na".to_string(),
            date_of_surgery: "2026-06-01".to_string(),
            start_time: "09:00".to_string(),
            end_time: "10:30".to_string(),
            duration_minutes: Some(90),
            operating_room: "OR 4".to_string(),
        },
        surgical_team: SurgicalTeam {
            primary_surgeon: "Mr Alex Smith".to_string(),
            primary_surgeon_grade: "consultant".to_string(),
            primary_anaesthetist: "Dr Priya Patel".to_string(),
            primary_anaesthetist_grade: "consultant".to_string(),
            additional_members: vec![],
            scrub_nurse: "Nurse A".to_string(),
            circulator: "Nurse B".to_string(),
        },
        intraoperative_findings: IntraoperativeFindings {
            findings: "Routine.".to_string(),
            procedure_performed: "Laparoscopic cholecystectomy.".to_string(),
            unexpected_findings: String::new(),
            conversion_to_open: "no".to_string(),
            conversion_reason: String::new(),
        },
        anaesthesia_summary: AnaesthesiaSummary {
            anaesthesia_type: "general".to_string(),
            airway_management: "ETT".to_string(),
            difficult_intubation: "no".to_string(),
            airway_notes: String::new(),
            medications_administered: "propofol, fentanyl, rocuronium".to_string(),
            reversal_agents: "sugammadex".to_string(),
            anaesthesia_notes: String::new(),
        },
        blood_loss_fluid_balance: BloodLossFluidBalance {
            estimated_blood_loss_ml: Some(50),
            crystalloids_ml: Some(1000),
            colloids_ml: Some(0),
            blood_products_ml: Some(0),
            blood_product_details: String::new(),
            urine_output_ml: Some(150),
            other_drains_ml: Some(0),
            fluid_notes: String::new(),
        },
        specimens_implants: SpecimensImplants {
            specimens: vec![],
            implants: vec![],
            prosthesis_used: "no".to_string(),
            drains_placed: String::new(),
            catheters_placed: String::new(),
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
            pain_notes: String::new(),
            disposition: "recovery".to_string(),
        },
        complications_assessment: ComplicationsAssessment {
            complications_occurred: "no".to_string(),
            complications: vec![],
            narrative: String::new(),
        },
        postop_plan_instructions: PostopPlanInstructions {
            medications_prescribed: "Paracetamol PRN".to_string(),
            antibiotic_plan: "Co-amoxiclav x 1 dose".to_string(),
            thromboprophylaxis: "LMWH while inpatient".to_string(),
            analgesia_plan: "Paracetamol + ibuprofen PRN".to_string(),
            diet_plan: "Free fluids".to_string(),
            mobilisation_plan: "Mobilise tonight".to_string(),
            wound_care_instructions: "Leave dressings 5 days".to_string(),
            follow_up_plan: "Outpatient 6 weeks".to_string(),
            discharge_criteria: "Tolerating diet, mobilising".to_string(),
            alerts_and_escalation: String::new(),
        },
    }
}

#[test]
fn empty_case_is_grade_0() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.overall_grade, "grade-0");
    assert_eq!(result.complication_count, 0);
}

#[test]
fn baseline_no_complications_is_grade_0() {
    let data = baseline_case();
    let result = grade(&data);
    assert_eq!(result.overall_grade, "grade-0");
    assert_eq!(result.complication_count, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn worst_grade_wins() {
    let mut data = baseline_case();
    data.complications_assessment.complications_occurred = "yes".to_string();
    data.complications_assessment.complications = vec![
        Complication {
            description: "Atelectasis".to_string(),
            grade: "grade-i".to_string(),
            intervention_required: "physio".to_string(),
            timing: "POD 1".to_string(),
        },
        Complication {
            description: "PE requiring anticoagulation".to_string(),
            grade: "grade-ii".to_string(),
            intervention_required: "therapeutic LMWH".to_string(),
            timing: "POD 3".to_string(),
        },
        Complication {
            description: "Bile leak requiring ERCP".to_string(),
            grade: "grade-iiia".to_string(),
            intervention_required: "ERCP + stent".to_string(),
            timing: "POD 5".to_string(),
        },
    ];
    let result = grade(&data);
    assert_eq!(result.overall_grade, "grade-iiia");
    assert_eq!(result.complication_count, 3);
    assert_eq!(result.fired_rules.len(), 3);
    assert_eq!(result.fired_rules[0].id, "CD-1");
}

#[test]
fn unanswered_grades_are_skipped() {
    let mut data = baseline_case();
    data.complications_assessment.complications_occurred = "yes".to_string();
    data.complications_assessment.complications = vec![
        Complication {
            description: "Vague concern".to_string(),
            grade: String::new(),
            intervention_required: String::new(),
            timing: String::new(),
        },
        Complication {
            description: "Wound dehiscence".to_string(),
            grade: "grade-iiib".to_string(),
            intervention_required: "return to theatre".to_string(),
            timing: "POD 7".to_string(),
        },
    ];
    let (worst, count, fired) = calculate_clavien_dindo(&data);
    assert_eq!(worst, "grade-iiib");
    assert_eq!(count, 1);
    assert_eq!(fired.len(), 1);
}

#[test]
fn grade_v_overrides() {
    let mut data = baseline_case();
    data.complications_assessment.complications_occurred = "yes".to_string();
    data.complications_assessment.complications = vec![
        Complication {
            description: "Cardiac arrest".to_string(),
            grade: "grade-v".to_string(),
            intervention_required: String::new(),
            timing: String::new(),
        },
        Complication {
            description: "Wound infection".to_string(),
            grade: "grade-i".to_string(),
            intervention_required: String::new(),
            timing: String::new(),
        },
    ];
    let result = grade(&data);
    assert_eq!(result.overall_grade, "grade-v");
}

#[test]
fn all_eight_grade_keys_present() {
    let rules = all_rules();
    let keys: Vec<&str> = rules.iter().map(|r| r.grade).collect();
    assert_eq!(keys.len(), 8);
    assert!(keys.contains(&"grade-0"));
    assert!(keys.contains(&"grade-v"));
}
