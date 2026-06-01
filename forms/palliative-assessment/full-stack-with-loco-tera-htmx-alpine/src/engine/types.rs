use serde::{Deserialize, Serialize};

// Conventions:
//   empty string `''` for unanswered text / enum fields
//   `Option::None` for unanswered numeric fields (including ESAS items)
//   empty `Vec` for unanswered list fields

pub type YesNo = String;
pub type YesNoUnknown = String;
pub type SeverityBand = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub nhs_or_mrn_number: String,
    pub preferred_language: String,
    pub ethnicity: String,
    pub reporter_role: String,
    pub reporter_name: String,
    pub assessment_date: String,
    pub assessment_setting: String,
}

/// Step 2 — Primary Diagnosis & Prognosis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimaryDiagnosisPrognosis {
    pub primary_diagnosis: String,
    pub secondary_diagnoses: String,
    pub date_of_diagnosis: String,
    pub stage_or_severity: String,
    pub disease_progressing: YesNo,
    pub prognosis_horizon: String,
    pub surprise_question: YesNo,
    pub prognostic_indicators: String,
    pub relevant_treatment_history: String,
}

/// Step 3 — ESAS-r Symptom Scoring (10 items, 0-10 each; None = unanswered).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EsasrSymptoms {
    pub pain: Option<i32>,
    pub tiredness: Option<i32>,
    pub drowsiness: Option<i32>,
    pub nausea: Option<i32>,
    pub lack_of_appetite: Option<i32>,
    pub shortness_of_breath: Option<i32>,
    pub depression: Option<i32>,
    pub anxiety: Option<i32>,
    pub wellbeing: Option<i32>,
    pub other: Option<i32>,
    pub other_label: String,
    pub symptom_notes: String,
}

/// Step 4 — Performance Status (PPS / AKPS / ECOG).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PerformanceStatus {
    pub pps_score: Option<i32>,
    pub akps_score: Option<i32>,
    pub ecog_score: Option<i32>,
    pub mobility_notes: String,
    pub activity_level: String,
    pub bed_bound: YesNo,
    pub requires_assistance_with_adls: YesNo,
    pub adl_notes: String,
}

/// Step 5 — Goals of Care & ACP documents.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalsOfCareAcp {
    pub patient_priorities_and_wishes: String,
    pub preferred_place_of_care: String,
    pub preferred_place_of_death: String,
    pub respect_form_completed: YesNoUnknown,
    pub respect_form_date: String,
    pub adrt_completed: YesNoUnknown,
    pub adrt_date: String,
    pub lpa_health_and_welfare: YesNoUnknown,
    pub lpa_name: String,
    pub dnacpr_documented: YesNoUnknown,
    pub dnacpr_date: String,
    pub ceiling_of_treatment_discussed: YesNo,
    pub ceiling_of_treatment_notes: String,
}

/// A single medication entry (regular or as-needed).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub dose: String,
    pub route: String,
    pub frequency: String,
    pub indication: String,
}

/// Step 6 — Medications & Symptom Control.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsSymptomControl {
    pub regular_medications: Vec<Medication>,
    pub as_needed_medications: Vec<Medication>,
    pub syringe_driver_in_use: YesNo,
    pub syringe_driver_details: String,
    pub anticipatory_meds_prescribed: YesNo,
    pub anticipatory_meds_notes: String,
    pub symptom_control_overall: String,
    pub barriers_to_control: String,
    pub plan_notes: String,
}

/// Step 7 — Psychosocial & Spiritual Concerns.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychosocialSpiritualConcerns {
    pub mood_concerns: YesNo,
    pub mood_notes: String,
    pub anxiety_concerns: YesNo,
    pub anxiety_notes: String,
    pub existential_distress: YesNo,
    pub existential_notes: String,
    pub spiritual_support_requested: YesNo,
    pub faith_or_belief: String,
    pub chaplaincy_notes: String,
    pub unresolved_concerns: YesNo,
    pub unresolved_notes: String,
}

/// Step 8 — Carer & Family Support.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarerFamilySupport {
    pub primary_carer_name: String,
    pub primary_carer_relationship: String,
    pub carer_lives_with_patient: YesNo,
    pub carer_strain_reported: YesNo,
    pub carer_strain_level: String,
    pub carer_strain_notes: String,
    pub respite_required: YesNo,
    pub respite_notes: String,
    pub children_in_household: YesNo,
    pub children_support_notes: String,
    pub bereavement_risk_identified: YesNo,
    pub bereavement_notes: String,
}

/// Step 9 — Multidisciplinary Plan & Referrals.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MultidisciplinaryPlan {
    pub specialist_palliative_care_involved: YesNo,
    pub community_nursing_involved: YesNo,
    pub hospice_referral_made: YesNo,
    pub social_work_referral_made: YesNo,
    pub occupational_therapy_referral_made: YesNo,
    pub physiotherapy_referral_made: YesNo,
    pub dietician_referral_made: YesNo,
    pub chaplaincy_referral_made: YesNo,
    pub psychology_referral_made: YesNo,
    pub other_referrals: String,
    pub review_interval: String,
    pub key_worker_name: String,
    pub plan_summary: String,
}

/// Full palliative assessment record (camelCase JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub primary_diagnosis_prognosis: PrimaryDiagnosisPrognosis,
    pub esasr_symptoms: EsasrSymptoms,
    pub performance_status: PerformanceStatus,
    pub goals_of_care_acp: GoalsOfCareAcp,
    pub medications_symptom_control: MedicationsSymptomControl,
    pub psychosocial_spiritual_concerns: PsychosocialSpiritualConcerns,
    pub carer_family_support: CarerFamilySupport,
    pub multidisciplinary_plan: MultidisciplinaryPlan,
}

/// A rule that fired during grading. ESAS rules carry the patient's 0-10
/// intensity for that symptom; ancillary rules carry a flag score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// Single ESAS-r symptom flagged at intensity >= 7.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndividualFlag {
    pub symptom_key: String,
    pub symptom_label: String,
    pub score: i32,
}

/// Clinician-facing safety flag computed independently of the ESAS total.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Final grading result for the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub esas_total: i32,
    pub severity_band: SeverityBand,
    pub answered_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub individual_flags: Vec<IndividualFlag>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}

/// Static metadata about a single ESAS-r symptom item.
pub struct EsasItem {
    pub key: &'static str,
    pub label: &'static str,
    pub low_pole: &'static str,
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
