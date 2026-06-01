use serde::{Deserialize, Serialize};

// Type aliases mirror the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric.
pub type YesNo = String;
pub type CompetencyLevel = String;
pub type FitnessDecision = String;
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
}

/// Step 2 — Role & Qualifications.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleQualifications {
    pub role_type: String,
    pub role_type_other: String,
    pub employer_organisation: String,
    pub station_base: String,
    pub years_of_service: Option<i32>,
    pub registration_number: String,
    pub registration_body: String,
    pub registration_expiry_date: String,
    pub highest_qualification: String,
    pub qualification_details: String,
    pub driving_licence_category: String,
    pub blue_light_trained: YesNo,
}

/// Step 3 — Physical Fitness Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalFitness {
    pub cardiovascular_fitness: CompetencyLevel,
    pub shuttle_run_level: Option<f64>,
    pub vo2_max: Option<f64>,
    pub muscular_strength: CompetencyLevel,
    pub grip_strength_kg: Option<f64>,
    pub manual_handling_competency: CompetencyLevel,
    pub patient_carry_ability: YesNo,
    pub flexibility_mobility: CompetencyLevel,
    pub balance_coordination: CompetencyLevel,
    pub resting_heart_rate_bpm: Option<i32>,
    pub blood_pressure_systolic: Option<i32>,
    pub blood_pressure_diastolic: Option<i32>,
    pub physical_fitness_notes: String,
}

/// Step 4 — Clinical Skills Competency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalSkills {
    pub basic_life_support: CompetencyLevel,
    pub advanced_life_support: CompetencyLevel,
    pub airway_management: CompetencyLevel,
    pub iv_cannulation: CompetencyLevel,
    pub drug_administration: CompetencyLevel,
    pub trauma_assessment: CompetencyLevel,
    pub immobilisation_splinting: CompetencyLevel,
    pub ecg_interpretation: CompetencyLevel,
    pub patient_assessment: CompetencyLevel,
    pub triage_competency: CompetencyLevel,
    pub paediatric_competency: CompetencyLevel,
    pub obstetric_competency: CompetencyLevel,
    pub clinical_skills_notes: String,
}

/// Step 5 — Equipment & Vehicle Competency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EquipmentVehicle {
    pub defibrillator_competency: CompetencyLevel,
    pub monitor_competency: CompetencyLevel,
    pub ventilator_competency: CompetencyLevel,
    pub suction_competency: CompetencyLevel,
    pub stretcher_competency: CompetencyLevel,
    pub scoop_competency: CompetencyLevel,
    pub ambulance_driving: CompetencyLevel,
    pub emergency_driving: CompetencyLevel,
    pub vehicle_daily_inspection: YesNo,
    pub equipment_check_competency: CompetencyLevel,
    pub radio_communications: CompetencyLevel,
    pub equipment_vehicle_notes: String,
}

/// Step 6 — Communication Skills.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationSkills {
    pub patient_communication: CompetencyLevel,
    pub relative_communication: CompetencyLevel,
    pub handover_competency: CompetencyLevel,
    pub documentation_competency: CompetencyLevel,
    pub multidisciplinary_teamwork: CompetencyLevel,
    pub conflict_resolution: CompetencyLevel,
    pub safeguarding_awareness: CompetencyLevel,
    pub breaking_bad_news: CompetencyLevel,
    pub communication_notes: String,
}

/// Step 7 — Psychological Readiness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalReadiness {
    pub stress_management: CompetencyLevel,
    pub resilience_level: String,
    pub ptsd_screening: YesNo,
    pub ptsd_screening_result: String,
    pub critical_incident_exposure: YesNo,
    pub critical_incident_details: String,
    pub critical_incident_debriefed: YesNo,
    pub sleep_quality: String,
    pub burnout_risk: String,
    pub decision_making_under_pressure: CompetencyLevel,
    pub emotional_regulation: CompetencyLevel,
    pub psychological_notes: String,
}

/// Step 8 — Occupational Health.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalHealth {
    pub vision_test: String,
    pub vision_corrected: YesNo,
    pub hearing_test: String,
    pub hearing_aid_required: YesNo,
    pub immunisation_status: String,
    pub hepatitis_b_immune: YesNo,
    pub current_medications: String,
    pub substance_misuse_screen: String,
    pub musculoskeletal_issues: YesNo,
    pub musculoskeletal_details: String,
    pub respiratory_issues: YesNo,
    pub respiratory_details: String,
    pub skin_conditions: YesNo,
    pub skin_condition_details: String,
    pub sickness_absence_days: Option<i32>,
    pub occupational_health_notes: String,
}

/// Step 9 — CPD & Training Record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CpdTraining {
    pub cpd_hours_last_year: Option<f64>,
    pub cpd_hours_required: Option<f64>,
    pub mandatory_training_complete: YesNo,
    pub bls_recertification_date: String,
    pub als_recertification_date: String,
    pub manual_handling_recertification_date: String,
    pub safeguarding_training_date: String,
    pub infection_control_training_date: String,
    pub major_incident_training: YesNo,
    pub major_incident_training_date: String,
    pub mentoring_capability: CompetencyLevel,
    pub clinical_supervision_attendance: YesNo,
    pub reflective_practice: CompetencyLevel,
    pub cpd_training_notes: String,
}

/// Step 10 — Overall Fitness Decision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FitnessDecisionData {
    pub overall_fitness: FitnessDecision,
    pub restrictions_details: String,
    pub reassessment_required: YesNo,
    pub reassessment_date: String,
    pub remedial_actions: String,
    pub referrals_required: String,
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessor_registration: String,
    pub assessment_date: String,
    pub countersignature_name: String,
    pub countersignature_date: String,
    pub fitness_decision_notes: String,
}

/// Full First Responder Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub role_qualifications: RoleQualifications,
    pub physical_fitness: PhysicalFitness,
    pub clinical_skills: ClinicalSkills,
    pub equipment_vehicle: EquipmentVehicle,
    pub communication_skills: CommunicationSkills,
    pub psychological_readiness: PsychologicalReadiness,
    pub occupational_health: OccupationalHealth,
    pub cpd_training: CpdTraining,
    pub fitness_decision: FitnessDecisionData,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub domain: String,
    pub description: String,
    pub grade: u32,
}

/// A safety flag computed independently of competency grading (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Per-domain competency aggregation summary.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainLevels {
    pub physical_fitness: CompetencyLevel,
    pub clinical_skills: CompetencyLevel,
    pub equipment_vehicle: CompetencyLevel,
    pub communication: CompetencyLevel,
    pub psychological: CompetencyLevel,
}

/// Grading output for a first responder assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub overall_competency: CompetencyLevel,
    pub overall_fitness: FitnessDecision,
    pub overall_risk: RiskLevel,
    pub domain_levels: DomainLevels,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
