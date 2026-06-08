//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Conventions:
//   empty string `''` for unanswered text / enum fields
//   `Option::None` for unanswered numeric fields (including ESAS items)
//   empty `Vec` for unanswered list fields

/// Yes no.
pub type YesNo = String;
/// Yes no unknown.
pub type YesNoUnknown = String;
/// Severity band.
pub type SeverityBand = String;

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
    /// NHS or mrn number.
    pub nhs_or_mrn_number: String,
    /// Preferred language.
    pub preferred_language: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Reporter role.
    pub reporter_role: String,
    /// Reporter name.
    pub reporter_name: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Assessment setting.
    pub assessment_setting: String,
}

/// Step 2 — Primary Diagnosis & Prognosis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimaryDiagnosisPrognosis {
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Secondary diagnoses.
    pub secondary_diagnoses: String,
    /// Date of diagnosis.
    pub date_of_diagnosis: String,
    /// Stage or severity.
    pub stage_or_severity: String,
    /// Disease progressing.
    pub disease_progressing: YesNo,
    /// Prognosis horizon.
    pub prognosis_horizon: String,
    /// Surprise question.
    pub surprise_question: YesNo,
    /// Prognostic indicators.
    pub prognostic_indicators: String,
    /// Relevant treatment history.
    pub relevant_treatment_history: String,
}

/// Step 3 — ESAS-r Symptom Scoring (10 items, 0-10 each; None = unanswered).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EsasrSymptoms {
    /// Pain.
    pub pain: Option<i32>,
    /// Tiredness.
    pub tiredness: Option<i32>,
    /// Drowsiness.
    pub drowsiness: Option<i32>,
    /// Nausea.
    pub nausea: Option<i32>,
    /// Lack of appetite.
    pub lack_of_appetite: Option<i32>,
    /// Shortness of breath.
    pub shortness_of_breath: Option<i32>,
    /// Depression.
    pub depression: Option<i32>,
    /// Anxiety.
    pub anxiety: Option<i32>,
    /// Wellbeing.
    pub wellbeing: Option<i32>,
    /// Other.
    pub other: Option<i32>,
    /// Other label.
    pub other_label: String,
    /// Symptom notes.
    pub symptom_notes: String,
}

/// Step 4 — Performance Status (PPS / AKPS / ECOG).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PerformanceStatus {
    /// Pps score.
    pub pps_score: Option<i32>,
    /// Akps score.
    pub akps_score: Option<i32>,
    /// Ecog score.
    pub ecog_score: Option<i32>,
    /// Mobility notes.
    pub mobility_notes: String,
    /// Activity level.
    pub activity_level: String,
    /// Bed bound.
    pub bed_bound: YesNo,
    /// Requires assistance with adls.
    pub requires_assistance_with_adls: YesNo,
    /// Adl notes.
    pub adl_notes: String,
}

/// Step 5 — Goals of Care & ACP documents.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalsOfCareAcp {
    /// Patient priorities and wishes.
    pub patient_priorities_and_wishes: String,
    /// Preferred place of care.
    pub preferred_place_of_care: String,
    /// Preferred place of death.
    pub preferred_place_of_death: String,
    /// Respect form completed.
    pub respect_form_completed: YesNoUnknown,
    /// Respect form date.
    pub respect_form_date: String,
    /// Adrt completed.
    pub adrt_completed: YesNoUnknown,
    /// Adrt date.
    pub adrt_date: String,
    /// LPA health and welfare.
    pub lpa_health_and_welfare: YesNoUnknown,
    /// LPA name.
    pub lpa_name: String,
    /// DNACPR documented.
    pub dnacpr_documented: YesNoUnknown,
    /// DNACPR date.
    pub dnacpr_date: String,
    /// Ceiling of treatment discussed.
    pub ceiling_of_treatment_discussed: YesNo,
    /// Ceiling of treatment notes.
    pub ceiling_of_treatment_notes: String,
}

/// A single medication entry (regular or as-needed).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Route.
    pub route: String,
    /// Frequency.
    pub frequency: String,
    /// Indication.
    pub indication: String,
}

/// Step 6 — Medications & Symptom Control.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsSymptomControl {
    /// Regular medications.
    pub regular_medications: Vec<Medication>,
    /// As needed medications.
    pub as_needed_medications: Vec<Medication>,
    /// Syringe driver in use.
    pub syringe_driver_in_use: YesNo,
    /// Syringe driver details.
    pub syringe_driver_details: String,
    /// Anticipatory meds prescribed.
    pub anticipatory_meds_prescribed: YesNo,
    /// Anticipatory meds notes.
    pub anticipatory_meds_notes: String,
    /// Symptom control overall.
    pub symptom_control_overall: String,
    /// Barriers to control.
    pub barriers_to_control: String,
    /// Plan notes.
    pub plan_notes: String,
}

/// Step 7 — Psychosocial & Spiritual Concerns.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychosocialSpiritualConcerns {
    /// Mood concerns.
    pub mood_concerns: YesNo,
    /// Mood notes.
    pub mood_notes: String,
    /// Anxiety concerns.
    pub anxiety_concerns: YesNo,
    /// Anxiety notes.
    pub anxiety_notes: String,
    /// Existential distress.
    pub existential_distress: YesNo,
    /// Existential notes.
    pub existential_notes: String,
    /// Spiritual support requested.
    pub spiritual_support_requested: YesNo,
    /// Faith or belief.
    pub faith_or_belief: String,
    /// Chaplaincy notes.
    pub chaplaincy_notes: String,
    /// Unresolved concerns.
    pub unresolved_concerns: YesNo,
    /// Unresolved notes.
    pub unresolved_notes: String,
}

/// Step 8 — Carer & Family Support.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarerFamilySupport {
    /// Primary carer name.
    pub primary_carer_name: String,
    /// Primary carer relationship.
    pub primary_carer_relationship: String,
    /// Carer lives with patient.
    pub carer_lives_with_patient: YesNo,
    /// Carer strain reported.
    pub carer_strain_reported: YesNo,
    /// Carer strain level.
    pub carer_strain_level: String,
    /// Carer strain notes.
    pub carer_strain_notes: String,
    /// Respite required.
    pub respite_required: YesNo,
    /// Respite notes.
    pub respite_notes: String,
    /// Children in household.
    pub children_in_household: YesNo,
    /// Children support notes.
    pub children_support_notes: String,
    /// Bereavement risk identified.
    pub bereavement_risk_identified: YesNo,
    /// Bereavement notes.
    pub bereavement_notes: String,
}

/// Step 9 — Multidisciplinary Plan & Referrals.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MultidisciplinaryPlan {
    /// Specialist palliative care involved.
    pub specialist_palliative_care_involved: YesNo,
    /// Community nursing involved.
    pub community_nursing_involved: YesNo,
    /// Hospice referral made.
    pub hospice_referral_made: YesNo,
    /// Social work referral made.
    pub social_work_referral_made: YesNo,
    /// Occupational therapy referral made.
    pub occupational_therapy_referral_made: YesNo,
    /// Physiotherapy referral made.
    pub physiotherapy_referral_made: YesNo,
    /// Dietician referral made.
    pub dietician_referral_made: YesNo,
    /// Chaplaincy referral made.
    pub chaplaincy_referral_made: YesNo,
    /// Psychology referral made.
    pub psychology_referral_made: YesNo,
    /// Other referrals.
    pub other_referrals: String,
    /// Review interval.
    pub review_interval: String,
    /// Key worker name.
    pub key_worker_name: String,
    /// Plan summary.
    pub plan_summary: String,
}

/// Full palliative assessment record (camelCase JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Primary diagnosis prognosis.
    pub primary_diagnosis_prognosis: PrimaryDiagnosisPrognosis,
    /// Esasr symptoms.
    pub esasr_symptoms: EsasrSymptoms,
    /// Performance status.
    pub performance_status: PerformanceStatus,
    /// Goals of care acp.
    pub goals_of_care_acp: GoalsOfCareAcp,
    /// Medications symptom control.
    pub medications_symptom_control: MedicationsSymptomControl,
    /// Psychosocial spiritual concerns.
    pub psychosocial_spiritual_concerns: PsychosocialSpiritualConcerns,
    /// Carer family support.
    pub carer_family_support: CarerFamilySupport,
    /// Multidisciplinary plan.
    pub multidisciplinary_plan: MultidisciplinaryPlan,
}

/// A rule that fired during grading. ESAS rules carry the patient's 0-10
/// intensity for that symptom; ancillary rules carry a flag score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
}

/// Single ESAS-r symptom flagged at intensity >= 7.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndividualFlag {
    /// Symptom key.
    pub symptom_key: String,
    /// Symptom label.
    pub symptom_label: String,
    /// Score.
    pub score: i32,
}

/// Clinician-facing safety flag computed independently of the ESAS total.
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

/// Final grading result for the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Esas total.
    pub esas_total: i32,
    /// Severity band.
    pub severity_band: SeverityBand,
    /// Answered count.
    pub answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Individual flags.
    pub individual_flags: Vec<IndividualFlag>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}

/// Static metadata about a single ESAS-r symptom item.
pub struct EsasItem {
    /// Key.
    pub key: &'static str,
    /// Label.
    pub label: &'static str,
    /// Low pole.
    pub low_pole: &'static str,
    /// High pole.
    pub high_pole: &'static str,
}

/// The ten ESAS-r items in canonical order.
pub const ESAS_ITEMS: &[EsasItem] = &[
    EsasItem { key: "pain", label: "Pain", low_pole: "No pain", high_pole: "Worst possible pain" },
    EsasItem { key: "tiredness", label: "Tiredness (lack of energy)", low_pole: "No tiredness", high_pole: "Worst possible tiredness" },
    EsasItem { key: "drowsiness", label: "Drowsiness (feeling sleepy)", low_pole: "No drowsiness", high_pole: "Worst possible drowsiness" },
    EsasItem { key: "nausea", label: "Nausea", low_pole: "No nausea", high_pole: "Worst possible nausea" },
    EsasItem { key: "lackOfAppetite", label: "Lack of appetite", low_pole: "No lack of appetite", high_pole: "Worst possible lack of appetite" },
    EsasItem { key: "shortnessOfBreath", label: "Shortness of breath", low_pole: "No shortness of breath", high_pole: "Worst possible shortness of breath" },
    EsasItem { key: "depression", label: "Depression (feeling sad)", low_pole: "No depression", high_pole: "Worst possible depression" },
    EsasItem { key: "anxiety", label: "Anxiety (feeling nervous)", low_pole: "No anxiety", high_pole: "Worst possible anxiety" },
    EsasItem { key: "wellbeing", label: "Wellbeing (how you feel overall)", low_pole: "Best wellbeing", high_pole: "Worst wellbeing" },
    EsasItem { key: "other", label: "Other symptom", low_pole: "No symptom", high_pole: "Worst possible" },
];

/// Look up the human-readable label for an ESAS-r symptom key.
pub fn label_for(key: &str) -> &'static str {
    for item in ESAS_ITEMS {
        if item.key == key {
            return item.label;
        }
    }
    ""
}
