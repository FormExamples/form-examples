//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases mirror the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric.
/// Yes no.
pub type YesNo = String;
/// Competency level.
pub type CompetencyLevel = String;
/// Fitness decision.
pub type FitnessDecision = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
}

/// Step 2 — Role & Qualifications.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleQualifications {
    /// Role type.
    pub role_type: String,
    /// Role type other.
    pub role_type_other: String,
    /// Employer organisation.
    pub employer_organisation: String,
    /// Station base.
    pub station_base: String,
    /// Years of service.
    pub years_of_service: Option<i32>,
    /// Registration number.
    pub registration_number: String,
    /// Registration body.
    pub registration_body: String,
    /// Registration expiry date.
    pub registration_expiry_date: String,
    /// Highest qualification.
    pub highest_qualification: String,
    /// Qualification details.
    pub qualification_details: String,
    /// Driving licence category.
    pub driving_licence_category: String,
    /// Blue light trained.
    pub blue_light_trained: YesNo,
}

/// Step 3 — Physical Fitness Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalFitness {
    /// Cardiovascular fitness.
    pub cardiovascular_fitness: CompetencyLevel,
    /// Shuttle run level.
    pub shuttle_run_level: Option<f64>,
    /// Vo2 max.
    pub vo2_max: Option<f64>,
    /// Muscular strength.
    pub muscular_strength: CompetencyLevel,
    /// Grip strength kg.
    pub grip_strength_kg: Option<f64>,
    /// Manual handling competency.
    pub manual_handling_competency: CompetencyLevel,
    /// Patient carry ability.
    pub patient_carry_ability: YesNo,
    /// Flexibility mobility.
    pub flexibility_mobility: CompetencyLevel,
    /// Balance coordination.
    pub balance_coordination: CompetencyLevel,
    /// Resting heart rate bpm.
    pub resting_heart_rate_bpm: Option<i32>,
    /// Blood pressure systolic.
    pub blood_pressure_systolic: Option<i32>,
    /// Blood pressure diastolic.
    pub blood_pressure_diastolic: Option<i32>,
    /// Physical fitness notes.
    pub physical_fitness_notes: String,
}

/// Step 4 — Clinical Skills Competency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalSkills {
    /// Basic life support.
    pub basic_life_support: CompetencyLevel,
    /// Advanced life support.
    pub advanced_life_support: CompetencyLevel,
    /// Airway management.
    pub airway_management: CompetencyLevel,
    /// IV cannulation.
    pub iv_cannulation: CompetencyLevel,
    /// Drug administration.
    pub drug_administration: CompetencyLevel,
    /// Trauma assessment.
    pub trauma_assessment: CompetencyLevel,
    /// Immobilisation splinting.
    pub immobilisation_splinting: CompetencyLevel,
    /// ECG interpretation.
    pub ecg_interpretation: CompetencyLevel,
    /// Patient assessment.
    pub patient_assessment: CompetencyLevel,
    /// Triage competency.
    pub triage_competency: CompetencyLevel,
    /// Paediatric competency.
    pub paediatric_competency: CompetencyLevel,
    /// Obstetric competency.
    pub obstetric_competency: CompetencyLevel,
    /// Clinical skills notes.
    pub clinical_skills_notes: String,
}

/// Step 5 — Equipment & Vehicle Competency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EquipmentVehicle {
    /// Defibrillator competency.
    pub defibrillator_competency: CompetencyLevel,
    /// Monitor competency.
    pub monitor_competency: CompetencyLevel,
    /// Ventilator competency.
    pub ventilator_competency: CompetencyLevel,
    /// Suction competency.
    pub suction_competency: CompetencyLevel,
    /// Stretcher competency.
    pub stretcher_competency: CompetencyLevel,
    /// Scoop competency.
    pub scoop_competency: CompetencyLevel,
    /// Ambulance driving.
    pub ambulance_driving: CompetencyLevel,
    /// Emergency driving.
    pub emergency_driving: CompetencyLevel,
    /// Vehicle daily inspection.
    pub vehicle_daily_inspection: YesNo,
    /// Equipment check competency.
    pub equipment_check_competency: CompetencyLevel,
    /// Radio communications.
    pub radio_communications: CompetencyLevel,
    /// Equipment vehicle notes.
    pub equipment_vehicle_notes: String,
}

/// Step 6 — Communication Skills.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationSkills {
    /// Patient communication.
    pub patient_communication: CompetencyLevel,
    /// Relative communication.
    pub relative_communication: CompetencyLevel,
    /// Handover competency.
    pub handover_competency: CompetencyLevel,
    /// Documentation competency.
    pub documentation_competency: CompetencyLevel,
    /// Multidisciplinary teamwork.
    pub multidisciplinary_teamwork: CompetencyLevel,
    /// Conflict resolution.
    pub conflict_resolution: CompetencyLevel,
    /// Safeguarding awareness.
    pub safeguarding_awareness: CompetencyLevel,
    /// Breaking bad news.
    pub breaking_bad_news: CompetencyLevel,
    /// Communication notes.
    pub communication_notes: String,
}

/// Step 7 — Psychological Readiness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalReadiness {
    /// Stress management.
    pub stress_management: CompetencyLevel,
    /// Resilience level.
    pub resilience_level: String,
    /// Ptsd screening.
    pub ptsd_screening: YesNo,
    /// Ptsd screening result.
    pub ptsd_screening_result: String,
    /// Critical incident exposure.
    pub critical_incident_exposure: YesNo,
    /// Critical incident details.
    pub critical_incident_details: String,
    /// Critical incident debriefed.
    pub critical_incident_debriefed: YesNo,
    /// Sleep quality.
    pub sleep_quality: String,
    /// Burnout risk.
    pub burnout_risk: String,
    /// Decision making under pressure.
    pub decision_making_under_pressure: CompetencyLevel,
    /// Emotional regulation.
    pub emotional_regulation: CompetencyLevel,
    /// Psychological notes.
    pub psychological_notes: String,
}

/// Step 8 — Occupational Health.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalHealth {
    /// Vision test.
    pub vision_test: String,
    /// Vision corrected.
    pub vision_corrected: YesNo,
    /// Hearing test.
    pub hearing_test: String,
    /// Hearing aid required.
    pub hearing_aid_required: YesNo,
    /// Immunisation status.
    pub immunisation_status: String,
    /// Hepatitis b immune.
    pub hepatitis_b_immune: YesNo,
    /// Current medications.
    pub current_medications: String,
    /// Substance misuse screen.
    pub substance_misuse_screen: String,
    /// Musculoskeletal issues.
    pub musculoskeletal_issues: YesNo,
    /// Musculoskeletal details.
    pub musculoskeletal_details: String,
    /// Respiratory issues.
    pub respiratory_issues: YesNo,
    /// Respiratory details.
    pub respiratory_details: String,
    /// Skin conditions.
    pub skin_conditions: YesNo,
    /// Skin condition details.
    pub skin_condition_details: String,
    /// Sickness absence days.
    pub sickness_absence_days: Option<i32>,
    /// Occupational health notes.
    pub occupational_health_notes: String,
}

/// Step 9 — CPD & Training Record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CpdTraining {
    /// Cpd hours last year.
    pub cpd_hours_last_year: Option<f64>,
    /// Cpd hours required.
    pub cpd_hours_required: Option<f64>,
    /// Mandatory training complete.
    pub mandatory_training_complete: YesNo,
    /// Bls recertification date.
    pub bls_recertification_date: String,
    /// Als recertification date.
    pub als_recertification_date: String,
    /// Manual handling recertification date.
    pub manual_handling_recertification_date: String,
    /// Safeguarding training date.
    pub safeguarding_training_date: String,
    /// Infection control training date.
    pub infection_control_training_date: String,
    /// Major incident training.
    pub major_incident_training: YesNo,
    /// Major incident training date.
    pub major_incident_training_date: String,
    /// Mentoring capability.
    pub mentoring_capability: CompetencyLevel,
    /// Clinical supervision attendance.
    pub clinical_supervision_attendance: YesNo,
    /// Reflective practice.
    pub reflective_practice: CompetencyLevel,
    /// Cpd training notes.
    pub cpd_training_notes: String,
}

/// Step 10 — Overall Fitness Decision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FitnessDecisionData {
    /// Overall fitness.
    pub overall_fitness: FitnessDecision,
    /// Restrictions details.
    pub restrictions_details: String,
    /// Reassessment required.
    pub reassessment_required: YesNo,
    /// Reassessment date.
    pub reassessment_date: String,
    /// Remedial actions.
    pub remedial_actions: String,
    /// Referrals required.
    pub referrals_required: String,
    /// Assessor name.
    pub assessor_name: String,
    /// Assessor role.
    pub assessor_role: String,
    /// Assessor registration.
    pub assessor_registration: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Countersignature name.
    pub countersignature_name: String,
    /// Countersignature date.
    pub countersignature_date: String,
    /// Fitness decision notes.
    pub fitness_decision_notes: String,
}

/// Full First Responder Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Role qualifications.
    pub role_qualifications: RoleQualifications,
    /// Physical fitness.
    pub physical_fitness: PhysicalFitness,
    /// Clinical skills.
    pub clinical_skills: ClinicalSkills,
    /// Equipment vehicle.
    pub equipment_vehicle: EquipmentVehicle,
    /// Communication skills.
    pub communication_skills: CommunicationSkills,
    /// Psychological readiness.
    pub psychological_readiness: PsychologicalReadiness,
    /// Occupational health.
    pub occupational_health: OccupationalHealth,
    /// Cpd training.
    pub cpd_training: CpdTraining,
    /// Fitness decision.
    pub fitness_decision: FitnessDecisionData,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Domain.
    pub domain: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: u32,
}

/// A safety flag computed independently of competency grading (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Per-domain competency aggregation summary.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainLevels {
    /// Physical fitness.
    pub physical_fitness: CompetencyLevel,
    /// Clinical skills.
    pub clinical_skills: CompetencyLevel,
    /// Equipment vehicle.
    pub equipment_vehicle: CompetencyLevel,
    /// Communication.
    pub communication: CompetencyLevel,
    /// Psychological.
    pub psychological: CompetencyLevel,
}

/// Grading output for a first responder assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Overall competency.
    pub overall_competency: CompetencyLevel,
    /// Overall fitness.
    pub overall_fitness: FitnessDecision,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Domain levels.
    pub domain_levels: DomainLevels,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
