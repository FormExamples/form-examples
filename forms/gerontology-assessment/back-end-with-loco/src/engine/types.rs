//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Frailty level.
pub type FrailtyLevel = String;

// ─── Patient Information (Step 1) ──────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Age.
    pub age: Option<u8>,
    /// Sex.
    pub sex: String,
    /// NHS number.
    pub nhs_number: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Assessor name.
    pub assessor_name: String,
    /// Referral source.
    pub referral_source: String,
    /// Living situation.
    pub living_situation: String,
}

// ─── Functional Assessment (Step 2) ────────────────────────

/// Functional assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalAssessment {
    // Barthel Index items (0-2 each, 10 items, max 20)
    /// Feeding.
    pub feeding: Option<u8>,
    /// Bathing.
    pub bathing: Option<u8>,
    /// Grooming.
    pub grooming: Option<u8>,
    /// Dressing.
    pub dressing: Option<u8>,
    /// Bowel control.
    pub bowel_control: Option<u8>,
    /// Bladder control.
    pub bladder_control: Option<u8>,
    /// Toilet use.
    pub toilet_use: Option<u8>,
    /// Transfers.
    pub transfers: Option<u8>,
    /// Mobility.
    pub mobility: Option<u8>,
    /// Stairs.
    pub stairs: Option<u8>,
    // Katz ADL independence (yes/no for each)
    /// Katz bathing.
    pub katz_bathing: String,
    /// Katz dressing.
    pub katz_dressing: String,
    /// Katz toileting.
    pub katz_toileting: String,
    /// Katz transferring.
    pub katz_transferring: String,
    /// Katz continence.
    pub katz_continence: String,
    /// Katz feeding.
    pub katz_feeding: String,
    // IADL items (independent/needs_help/unable)
    /// Iadl telephone.
    pub iadl_telephone: String,
    /// Iadl shopping.
    pub iadl_shopping: String,
    /// Iadl food preparation.
    pub iadl_food_preparation: String,
    /// Iadl housekeeping.
    pub iadl_housekeeping: String,
    /// Iadl laundry.
    pub iadl_laundry: String,
    /// Iadl transport.
    pub iadl_transport: String,
    /// Iadl medications.
    pub iadl_medications: String,
    /// Iadl finances.
    pub iadl_finances: String,
}

// ─── Cognitive Screening (Step 3) ──────────────────────────

/// Cognitive screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveScreening {
    // MMSE approximate (0-30)
    /// Mmse score.
    pub mmse_score: Option<u8>,
    // 4AT delirium screening (0-12)
    /// Four at alertness.
    pub four_at_alertness: Option<u8>,
    /// Four at amts4.
    pub four_at_amts4: Option<u8>,
    /// Four at attention.
    pub four_at_attention: Option<u8>,
    /// Four at acute change.
    pub four_at_acute_change: Option<u8>,
    // General cognitive concerns
    /// Memory concerns.
    pub memory_concerns: String,
    /// Orientation impaired.
    pub orientation_impaired: String,
    /// Decision making capacity.
    pub decision_making_capacity: String,
    /// Known dementia diagnosis.
    pub known_dementia_diagnosis: String,
}

// ─── Falls Risk (Step 4) ───────────────────────────────────

/// Falls risk.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FallsRisk {
    /// Falls last 12 months.
    pub falls_last_12_months: Option<u8>,
    /// Falls with injury.
    pub falls_with_injury: Option<u8>,
    /// Fear of falling.
    pub fear_of_falling: String,
    /// Uses walking aid.
    pub uses_walking_aid: String,
    /// Walking aid type.
    pub walking_aid_type: String,
    // Tinetti balance items (0-2 each)
    /// Tinetti sitting balance.
    pub tinetti_sitting_balance: Option<u8>,
    /// Tinetti arising.
    pub tinetti_arising: Option<u8>,
    /// Tinetti standing balance.
    pub tinetti_standing_balance: Option<u8>,
    /// Tinetti nudge test.
    pub tinetti_nudge_test: Option<u8>,
    /// Tinetti eyes closed.
    pub tinetti_eyes_closed: Option<u8>,
    /// Tinetti turning.
    pub tinetti_turning: Option<u8>,
    /// Postural hypotension.
    pub postural_hypotension: String,
    /// Footwear appropriate.
    pub footwear_appropriate: String,
    /// Home hazards identified.
    pub home_hazards_identified: String,
}

// ─── Medication Review (Step 5) ─────────────────────────────

/// Medication review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    /// Total medications.
    pub total_medications: Option<u8>,
    /// High risk medications.
    pub high_risk_medications: String,
    /// Anticholinergic burden.
    pub anticholinergic_burden: String,
    /// Medication adherence.
    pub medication_adherence: String,
    /// Recent medication changes.
    pub recent_medication_changes: String,
    /// Over the counter medications.
    pub over_the_counter_medications: String,
    /// Medication side effects.
    pub medication_side_effects: String,
    /// Medication review date.
    pub medication_review_date: String,
    /// Prescribing cascade risk.
    pub prescribing_cascade_risk: String,
}

// ─── Nutritional Assessment (Step 6) ────────────────────────

/// Nutritional assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct NutritionalAssessment {
    // MNA-SF items
    /// Appetite loss.
    pub appetite_loss: Option<u8>,
    /// Weight loss.
    pub weight_loss: Option<u8>,
    /// Mobility mna.
    pub mobility_mna: Option<u8>,
    /// Psychological stress.
    pub psychological_stress: Option<u8>,
    /// Neuropsychological problems.
    pub neuropsychological_problems: Option<u8>,
    /// BMI category.
    pub bmi_category: Option<u8>,
    // Additional nutrition items
    /// Swallowing difficulty.
    pub swallowing_difficulty: String,
    /// Dietary restrictions.
    pub dietary_restrictions: String,
    /// Fluid intake adequate.
    pub fluid_intake_adequate: String,
    /// Oral health concerns.
    pub oral_health_concerns: String,
}

// ─── Mood Assessment (Step 7) ───────────────────────────────

/// Mood assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MoodAssessment {
    // GDS-15 items (yes/no)
    /// Gds satisfied with life.
    pub gds_satisfied_with_life: String,
    /// Gds dropped activities.
    pub gds_dropped_activities: String,
    /// Gds life feels empty.
    pub gds_life_feels_empty: String,
    /// Gds often bored.
    pub gds_often_bored: String,
    /// Gds good spirits.
    pub gds_good_spirits: String,
    /// Gds afraid something bad.
    pub gds_afraid_something_bad: String,
    /// Gds feels happy.
    pub gds_feels_happy: String,
    /// Gds feels helpless.
    pub gds_feels_helpless: String,
    /// Gds prefers staying home.
    pub gds_prefers_staying_home: String,
    /// Gds memory problems.
    pub gds_memory_problems: String,
    /// Gds wonderful to be alive.
    pub gds_wonderful_to_be_alive: String,
    /// Gds feels worthless.
    pub gds_feels_worthless: String,
    /// Gds feels full of energy.
    pub gds_feels_full_of_energy: String,
    /// Gds feels hopeless.
    pub gds_feels_hopeless: String,
    /// Gds others better off.
    pub gds_others_better_off: String,
    // Additional mood items
    /// Sleep disturbance.
    pub sleep_disturbance: String,
    /// Anxiety symptoms.
    pub anxiety_symptoms: String,
    /// Social isolation.
    pub social_isolation: String,
}

// ─── Social Circumstances (Step 8) ─────────────────────────

/// Social circumstances.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SocialCircumstances {
    /// Housing type.
    pub housing_type: String,
    /// Housing adaptations.
    pub housing_adaptations: String,
    /// Lives alone.
    pub lives_alone: String,
    /// Primary carer.
    pub primary_carer: String,
    /// Carer relationship.
    pub carer_relationship: String,
    /// Carer stress.
    pub carer_stress: String,
    /// Formal care package.
    pub formal_care_package: String,
    /// Care hours per week.
    pub care_hours_per_week: String,
    /// Social activities.
    pub social_activities: String,
    /// Financial concerns.
    pub financial_concerns: String,
    /// Safeguarding concerns.
    pub safeguarding_concerns: String,
    /// Advance care plan.
    pub advance_care_plan: String,
    /// Lasting power of attorney.
    pub lasting_power_of_attorney: String,
    /// Driving status.
    pub driving_status: String,
}

// ─── Continence Assessment (Step 9) ─────────────────────────

/// Continence assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ContinenceAssessment {
    /// Urinary incontinence.
    pub urinary_incontinence: String,
    /// Urinary frequency.
    pub urinary_frequency: String,
    /// Urinary urgency.
    pub urinary_urgency: String,
    /// Nocturia.
    pub nocturia: String,
    /// Catheter in situ.
    pub catheter_in_situ: String,
    /// Faecal incontinence.
    pub faecal_incontinence: String,
    /// Constipation.
    pub constipation: String,
    /// Laxative use.
    pub laxative_use: String,
    /// Continence aids.
    pub continence_aids: String,
    /// Continence impact on quality.
    pub continence_impact_on_quality: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinical frailty scale.
    pub clinical_frailty_scale: Option<u8>,
    /// Comorbidity count.
    pub comorbidity_count: Option<u8>,
    /// Sensory impairment vision.
    pub sensory_impairment_vision: String,
    /// Sensory impairment hearing.
    pub sensory_impairment_hearing: String,
    /// Pain assessment.
    pub pain_assessment: String,
    /// Pain severity.
    pub pain_severity: Option<u8>,
    /// Skin integrity.
    pub skin_integrity: String,
    /// Pressure ulcer risk.
    pub pressure_ulcer_risk: String,
    /// Immunisation status.
    pub immunisation_status: String,
    /// Palliative care needs.
    pub palliative_care_needs: String,
    /// Clinical summary.
    pub clinical_summary: String,
    /// Recommendations.
    pub recommendations: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Functional assessment.
    pub functional_assessment: FunctionalAssessment,
    /// Cognitive screening.
    pub cognitive_screening: CognitiveScreening,
    /// Falls risk.
    pub falls_risk: FallsRisk,
    /// Medication review.
    pub medication_review: MedicationReview,
    /// Nutritional assessment.
    pub nutritional_assessment: NutritionalAssessment,
    /// Mood assessment.
    pub mood_assessment: MoodAssessment,
    /// Social circumstances.
    pub social_circumstances: SocialCircumstances,
    /// Continence assessment.
    pub continence_assessment: ContinenceAssessment,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
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
    /// Frailty level.
    pub frailty_level: FrailtyLevel,
    /// Barthel score.
    pub barthel_score: u8,
    /// Cognitive score.
    pub cognitive_score: Option<u8>,
    /// Falls count.
    pub falls_count: Option<u8>,
    /// Polypharmacy count.
    pub polypharmacy_count: Option<u8>,
    /// Mna score.
    pub mna_score: Option<u8>,
    /// Gds score.
    pub gds_score: u8,
    /// Cfs score.
    pub cfs_score: Option<u8>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
