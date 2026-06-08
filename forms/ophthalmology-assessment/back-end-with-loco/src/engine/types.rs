//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Impairment level.
pub type ImpairmentLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Exam date.
    pub exam_date: String,
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referring clinician.
    pub referring_clinician: String,
    /// Reason for visit.
    pub reason_for_visit: String,
    /// Ocular history.
    pub ocular_history: String,
    /// Systemic history.
    pub systemic_history: String,
    /// Current medications.
    pub current_medications: String,
    /// Allergies.
    pub allergies: String,
}

// ─── Visual Acuity (Step 2) ─────────────────────────────────

/// Visual acuity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VisualAcuity {
    /// Right uncorrected.
    pub right_uncorrected: String,
    /// Left uncorrected.
    pub left_uncorrected: String,
    /// Right best corrected.
    pub right_best_corrected: String,
    /// Left best corrected.
    pub left_best_corrected: String,
    /// Right pinhole.
    pub right_pinhole: String,
    /// Left pinhole.
    pub left_pinhole: String,
    /// Right near vision.
    pub right_near_vision: String,
    /// Left near vision.
    pub left_near_vision: String,
    /// Binocular vision.
    pub binocular_vision: String,
    /// Visual acuity method.
    pub visual_acuity_method: String,
}

// ─── Refraction (Step 3) ────────────────────────────────────

/// Refraction.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Refraction {
    /// Right sphere.
    pub right_sphere: String,
    /// Right cylinder.
    pub right_cylinder: String,
    /// Right axis.
    pub right_axis: String,
    /// Left sphere.
    pub left_sphere: String,
    /// Left cylinder.
    pub left_cylinder: String,
    /// Left axis.
    pub left_axis: String,
    /// Right add.
    pub right_add: String,
    /// Left add.
    pub left_add: String,
    /// Pupillary distance.
    pub pupillary_distance: String,
    /// Refraction method.
    pub refraction_method: String,
}

// ─── Anterior Segment (Step 4) ──────────────────────────────

/// Anterior segment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AnteriorSegment {
    /// Right lids.
    pub right_lids: Option<u8>,
    /// Left lids.
    pub left_lids: Option<u8>,
    /// Right conjunctiva.
    pub right_conjunctiva: Option<u8>,
    /// Left conjunctiva.
    pub left_conjunctiva: Option<u8>,
    /// Right cornea.
    pub right_cornea: Option<u8>,
    /// Left cornea.
    pub left_cornea: Option<u8>,
    /// Right anterior chamber.
    pub right_anterior_chamber: Option<u8>,
    /// Left anterior chamber.
    pub left_anterior_chamber: Option<u8>,
    /// Right iris.
    pub right_iris: Option<u8>,
    /// Left iris.
    pub left_iris: Option<u8>,
    /// Right lens.
    pub right_lens: Option<u8>,
    /// Left lens.
    pub left_lens: Option<u8>,
    /// Anterior segment notes.
    pub anterior_segment_notes: String,
}

// ─── Intraocular Pressure (Step 5) ──────────────────────────

/// Intraocular pressure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct IntraocularPressure {
    /// Right iop.
    pub right_iop: Option<u8>,
    /// Left iop.
    pub left_iop: Option<u8>,
    /// Measurement time.
    pub measurement_time: String,
    /// Tonometry method.
    pub tonometry_method: String,
    /// Central corneal thickness right.
    pub central_corneal_thickness_right: String,
    /// Central corneal thickness left.
    pub central_corneal_thickness_left: String,
    /// Gonioscopy right.
    pub gonioscopy_right: String,
    /// Gonioscopy left.
    pub gonioscopy_left: String,
}

// ─── Posterior Segment (Step 6) ──────────────────────────────

/// Posterior segment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PosteriorSegment {
    /// Right optic disc.
    pub right_optic_disc: Option<u8>,
    /// Left optic disc.
    pub left_optic_disc: Option<u8>,
    /// Right cup disc ratio.
    pub right_cup_disc_ratio: String,
    /// Left cup disc ratio.
    pub left_cup_disc_ratio: String,
    /// Right macula.
    pub right_macula: Option<u8>,
    /// Left macula.
    pub left_macula: Option<u8>,
    /// Right vessels.
    pub right_vessels: Option<u8>,
    /// Left vessels.
    pub left_vessels: Option<u8>,
    /// Right peripheral retina.
    pub right_peripheral_retina: Option<u8>,
    /// Left peripheral retina.
    pub left_peripheral_retina: Option<u8>,
    /// Right vitreous.
    pub right_vitreous: Option<u8>,
    /// Left vitreous.
    pub left_vitreous: Option<u8>,
    /// Posterior segment notes.
    pub posterior_segment_notes: String,
}

// ─── Visual Fields (Step 7) ─────────────────────────────────

/// Visual fields.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VisualFields {
    /// Right confrontation.
    pub right_confrontation: Option<u8>,
    /// Left confrontation.
    pub left_confrontation: Option<u8>,
    /// Right mean deviation.
    pub right_mean_deviation: String,
    /// Left mean deviation.
    pub left_mean_deviation: String,
    /// Right pattern standard deviation.
    pub right_pattern_standard_deviation: String,
    /// Left pattern standard deviation.
    pub left_pattern_standard_deviation: String,
    /// Visual field test type.
    pub visual_field_test_type: String,
    /// Visual field reliability.
    pub visual_field_reliability: Option<u8>,
    /// Visual field notes.
    pub visual_field_notes: String,
}

// ─── Ocular Motility (Step 8) ───────────────────────────────

/// Ocular motility.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OcularMotility {
    /// Extraocular movements.
    pub extraocular_movements: Option<u8>,
    /// Cover test distance.
    pub cover_test_distance: String,
    /// Cover test near.
    pub cover_test_near: String,
    /// Pupil right direct.
    pub pupil_right_direct: Option<u8>,
    /// Pupil left direct.
    pub pupil_left_direct: Option<u8>,
    /// Pupil right consensual.
    pub pupil_right_consensual: Option<u8>,
    /// Pupil left consensual.
    pub pupil_left_consensual: Option<u8>,
    /// Relative afferent pupil defect.
    pub relative_afferent_pupil_defect: String,
    /// Convergence.
    pub convergence: Option<u8>,
    /// Stereopsis.
    pub stereopsis: String,
}

// ─── Special Investigations (Step 9) ────────────────────────

/// Special investigations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SpecialInvestigations {
    /// Oct performed.
    pub oct_performed: String,
    /// Oct right findings.
    pub oct_right_findings: String,
    /// Oct left findings.
    pub oct_left_findings: String,
    /// Fundus photo performed.
    pub fundus_photo_performed: String,
    /// Ffa performed.
    pub ffa_performed: String,
    /// Ffa findings.
    pub ffa_findings: String,
    /// Corneal topography performed.
    pub corneal_topography_performed: String,
    /// Corneal topography findings.
    pub corneal_topography_findings: String,
    /// Biometry performed.
    pub biometry_performed: String,
    /// Biometry findings.
    pub biometry_findings: String,
    /// Other investigations.
    pub other_investigations: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Secondary diagnosis.
    pub secondary_diagnosis: String,
    /// Management plan.
    pub management_plan: String,
    /// Surgical intervention needed.
    pub surgical_intervention_needed: String,
    /// Referral required.
    pub referral_required: String,
    /// Referral destination.
    pub referral_destination: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Patient education provided.
    pub patient_education_provided: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Visual acuity.
    pub visual_acuity: VisualAcuity,
    /// Refraction.
    pub refraction: Refraction,
    /// Anterior segment.
    pub anterior_segment: AnteriorSegment,
    /// Intraocular pressure.
    pub intraocular_pressure: IntraocularPressure,
    /// Posterior segment.
    pub posterior_segment: PosteriorSegment,
    /// Visual fields.
    pub visual_fields: VisualFields,
    /// Ocular motility.
    pub ocular_motility: OcularMotility,
    /// Special investigations.
    pub special_investigations: SpecialInvestigations,
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
    /// Impairment level.
    pub impairment_level: ImpairmentLevel,
    /// Impairment score.
    pub impairment_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
