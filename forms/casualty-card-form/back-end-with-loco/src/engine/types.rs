//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Yes no.
pub type YesNo = String;

/// Demographics.
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
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Postcode.
    pub postcode: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Preferred language.
    pub preferred_language: String,
    /// Interpreter required.
    pub interpreter_required: YesNo,
}

/// Next of kin.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NextOfKin {
    /// Name.
    pub name: String,
    /// Relationship.
    pub relationship: String,
    /// Phone.
    pub phone: String,
    /// Notified.
    pub notified: YesNo,
}

/// GP.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GP {
    /// Name.
    pub name: String,
    /// Practice name.
    pub practice_name: String,
    /// Practice address.
    pub practice_address: String,
    /// Practice phone.
    pub practice_phone: String,
}

/// Arrival triage.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArrivalTriage {
    /// Attendance date.
    pub attendance_date: String,
    /// Arrival time.
    pub arrival_time: String,
    /// Attendance category.
    pub attendance_category: String,
    /// Arrival mode.
    pub arrival_mode: String,
    /// Referral source.
    pub referral_source: String,
    /// Ambulance incident number.
    pub ambulance_incident_number: String,
    /// Triage time.
    pub triage_time: String,
    /// Triage nurse.
    pub triage_nurse: String,
    /// Mts flowchart.
    #[serde(rename = "mtsFlowchart")]
    pub mts_flowchart: String,
    /// Mts category.
    #[serde(rename = "mtsCategory")]
    pub mts_category: String,
    /// Mts discriminator.
    #[serde(rename = "mtsDiscriminator")]
    pub mts_discriminator: String,
}

/// Presenting complaint.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingComplaint {
    /// Chief complaint.
    pub chief_complaint: String,
    /// History of presenting complaint.
    pub history_of_presenting_complaint: String,
    /// Onset.
    pub onset: String,
    /// Duration.
    pub duration: String,
    /// Character.
    pub character: String,
    /// Severity.
    pub severity: String,
    /// Location.
    pub location: String,
    /// Radiation.
    pub radiation: String,
    /// Aggravating factors.
    pub aggravating_factors: String,
    /// Relieving factors.
    pub relieving_factors: String,
    /// Associated symptoms.
    pub associated_symptoms: String,
    /// Previous episodes.
    pub previous_episodes: YesNo,
    /// Treatment prior to arrival.
    pub treatment_prior_to_arrival: String,
}

/// Pain assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PainAssessment {
    /// Pain present.
    pub pain_present: YesNo,
    /// Pain score.
    pub pain_score: Option<u8>,
    /// Pain location.
    pub pain_location: String,
    /// Pain character.
    pub pain_character: String,
    /// Pain onset.
    pub pain_onset: String,
    /// Pain severity category.
    pub pain_severity_category: String,
}

/// Medical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Past medical history.
    pub past_medical_history: String,
    /// Past surgical history.
    pub past_surgical_history: String,
    /// Tetanus status.
    pub tetanus_status: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Alcohol consumption.
    pub alcohol_consumption: String,
    /// Recreational drug use.
    pub recreational_drug_use: String,
    /// Last oral intake.
    pub last_oral_intake: String,
}

/// Medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
}

/// Allergy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    /// Allergen.
    pub allergen: String,
    /// Reaction.
    pub reaction: String,
    /// Severity.
    pub severity: String,
}

/// Vital signs.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    /// Heart rate.
    pub heart_rate: Option<f64>,
    /// Systolic BP.
    #[serde(rename = "systolicBP")]
    pub systolic_bp: Option<f64>,
    /// Diastolic BP.
    #[serde(rename = "diastolicBP")]
    pub diastolic_bp: Option<f64>,
    /// Respiratory rate.
    pub respiratory_rate: Option<f64>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<f64>,
    /// Supplemental oxygen.
    pub supplemental_oxygen: YesNo,
    /// Oxygen flow rate.
    pub oxygen_flow_rate: Option<f64>,
    /// Temperature.
    pub temperature: Option<f64>,
    /// Blood glucose.
    pub blood_glucose: Option<f64>,
    /// Consciousness level.
    pub consciousness_level: String,
    /// Pupil left size.
    pub pupil_left_size: Option<f64>,
    /// Pupil left reactive.
    pub pupil_left_reactive: YesNo,
    /// Pupil right size.
    pub pupil_right_size: Option<f64>,
    /// Pupil right reactive.
    pub pupil_right_reactive: YesNo,
    /// Capillary refill time.
    pub capillary_refill_time: Option<f64>,
    /// Weight.
    pub weight: Option<f64>,
}

/// Primary survey.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimarySurvey {
    // Airway
    /// Airway status.
    pub airway_status: String,
    /// Airway adjuncts.
    pub airway_adjuncts: String,
    /// C spine immobilised.
    pub c_spine_immobilised: YesNo,
    // Breathing
    /// Breathing effort.
    pub breathing_effort: String,
    /// Chest movement.
    pub chest_movement: String,
    /// Breath sounds.
    pub breath_sounds: String,
    /// Trachea position.
    pub trachea_position: String,
    // Circulation
    /// Pulse character.
    pub pulse_character: String,
    /// Skin colour.
    pub skin_colour: String,
    /// Skin temperature.
    pub skin_temperature: String,
    /// Capillary refill.
    pub capillary_refill: String,
    /// Haemorrhage.
    pub haemorrhage: YesNo,
    /// Haemorrhage details.
    pub haemorrhage_details: String,
    /// IV access.
    pub iv_access: YesNo,
    // Disability
    /// GCS eye.
    #[serde(rename = "gcsEye")]
    pub gcs_eye: Option<u8>,
    /// GCS verbal.
    #[serde(rename = "gcsVerbal")]
    pub gcs_verbal: Option<u8>,
    /// GCS motor.
    #[serde(rename = "gcsMotor")]
    pub gcs_motor: Option<u8>,
    /// GCS total.
    #[serde(rename = "gcsTotal")]
    pub gcs_total: Option<u8>,
    /// Pupils.
    pub pupils: String,
    /// Disability blood glucose.
    pub disability_blood_glucose: Option<f64>,
    /// Limb movements.
    pub limb_movements: String,
    // Exposure
    /// Skin examination.
    pub skin_examination: String,
    /// Injuries identified.
    pub injuries_identified: String,
    /// Log roll findings.
    pub log_roll_findings: String,
}

/// Clinical examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalExamination {
    /// General appearance.
    pub general_appearance: String,
    /// Head and face.
    pub head_and_face: String,
    /// Neck.
    pub neck: String,
    /// Chest cardiovascular.
    pub chest_cardiovascular: String,
    /// Chest respiratory.
    pub chest_respiratory: String,
    /// Abdomen.
    pub abdomen: String,
    /// Pelvis.
    pub pelvis: String,
    /// Musculoskeletal limbs.
    pub musculoskeletal_limbs: String,
    /// Neurological.
    pub neurological: String,
    /// Skin.
    pub skin: String,
    /// Mental state.
    pub mental_state: String,
    /// Body diagram notes.
    pub body_diagram_notes: String,
}

/// Investigations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// Urinalysis.
    pub urinalysis: String,
    /// Pregnancy test.
    pub pregnancy_test: String,
    /// ECG performed.
    pub ecg_performed: YesNo,
    /// ECG findings.
    pub ecg_findings: String,
    /// Other investigations.
    pub other_investigations: String,
}

/// Blood test.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BloodTest {
    /// Test name.
    pub test_name: String,
    /// Ordered.
    pub ordered: YesNo,
}

/// Imaging.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Imaging {
    /// Imaging type.
    #[serde(rename = "type")]
    pub imaging_type: String,
    /// Site.
    pub site: String,
    /// Findings.
    pub findings: String,
}

/// Treatment interventions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentInterventions {
    /// Oxygen therapy device.
    pub oxygen_therapy_device: String,
    /// Oxygen therapy flow rate.
    pub oxygen_therapy_flow_rate: String,
    /// Tetanus prophylaxis.
    pub tetanus_prophylaxis: String,
}

/// Medication administered.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationAdministered {
    /// Drug.
    pub drug: String,
    /// Dose.
    pub dose: String,
    /// Route.
    pub route: String,
    /// Time.
    pub time: String,
    /// Given by.
    pub given_by: String,
}

/// Fluid therapy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FluidTherapy {
    /// Fluid type.
    pub fluid_type: String,
    /// Volume.
    pub volume: String,
    /// Rate.
    pub rate: String,
    /// Time started.
    pub time_started: String,
}

/// Procedure.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Procedure {
    /// Description.
    pub description: String,
    /// Time.
    pub time: String,
}

/// Assessment plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentPlan {
    /// Working diagnosis.
    pub working_diagnosis: String,
    /// Differential diagnoses.
    pub differential_diagnoses: String,
    /// Clinical impression.
    pub clinical_impression: String,
    /// Risk stratification.
    pub risk_stratification: String,
}

/// Disposition.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disposition {
    /// Disposition.
    pub disposition: String,
    // Admitted
    /// Admitting specialty.
    pub admitting_specialty: String,
    /// Admitting consultant.
    pub admitting_consultant: String,
    /// Ward.
    pub ward: String,
    /// Level of care.
    pub level_of_care: String,
    // Discharged
    /// Discharge diagnosis.
    pub discharge_diagnosis: String,
    /// Discharge medications.
    pub discharge_medications: String,
    /// Discharge instructions.
    pub discharge_instructions: String,
    /// Follow up.
    pub follow_up: String,
    /// Return precautions.
    pub return_precautions: String,
    // Transferred
    /// Receiving hospital.
    pub receiving_hospital: String,
    /// Reason for transfer.
    pub reason_for_transfer: String,
    /// Mode of transfer.
    pub mode_of_transfer: String,
    // Common
    /// Discharge time.
    pub discharge_time: String,
    /// Total time in department.
    pub total_time_in_department: String,
}

/// Safeguarding.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Safeguarding {
    /// Safeguarding concern.
    pub safeguarding_concern: YesNo,
    /// Safeguarding type.
    pub safeguarding_type: String,
    /// Referral made.
    pub referral_made: YesNo,
    /// Mental capacity assessment.
    pub mental_capacity_assessment: String,
    /// Mental health act status.
    pub mental_health_act_status: String,
    /// Consent for treatment.
    pub consent_for_treatment: String,
    /// Completed by name.
    pub completed_by_name: String,
    /// Completed by role.
    pub completed_by_role: String,
    /// Completed by gmc number.
    #[serde(rename = "completedByGMCNumber")]
    pub completed_by_gmc_number: String,
    /// Senior reviewing clinician.
    pub senior_reviewing_clinician: String,
}

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Next of kin.
    pub next_of_kin: NextOfKin,
    /// GP.
    pub gp: GP,
    /// Arrival triage.
    pub arrival_triage: ArrivalTriage,
    /// Presenting complaint.
    pub presenting_complaint: PresentingComplaint,
    /// Pain assessment.
    pub pain_assessment: PainAssessment,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Vital signs.
    pub vital_signs: VitalSigns,
    /// Primary survey.
    pub primary_survey: PrimarySurvey,
    /// Clinical examination.
    pub clinical_examination: ClinicalExamination,
    /// Investigations.
    pub investigations: Investigations,
    /// Treatment interventions.
    pub treatment_interventions: TreatmentInterventions,
    /// Assessment plan.
    pub assessment_plan: AssessmentPlan,
    /// Disposition.
    pub disposition: Disposition,
    /// Safeguarding.
    pub safeguarding: Safeguarding,
    /// Medications.
    pub medications: Vec<Medication>,
    /// Allergies.
    pub allergies: Vec<Allergy>,
    /// Blood tests.
    pub blood_tests: Vec<BloodTest>,
    /// Imaging.
    pub imaging: Vec<Imaging>,
    /// Medications administered.
    pub medications_administered: Vec<MedicationAdministered>,
    /// Fluid therapy.
    pub fluid_therapy: Vec<FluidTherapy>,
    /// Procedures.
    pub procedures: Vec<Procedure>,
}

/// News2 score.
pub type News2Score = u8;

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Parameter.
    pub parameter: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: u8,
}

/// Additional flag.
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

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// News2 score.
    pub news2_score: News2Score,
    /// Clinical response.
    pub clinical_response: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
