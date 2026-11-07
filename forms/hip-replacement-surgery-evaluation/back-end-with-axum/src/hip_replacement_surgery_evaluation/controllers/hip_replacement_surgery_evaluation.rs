#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hip_replacement_surgery_evaluations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub site_name: String,
    pub affected_side: String,
    pub symptom_duration_months: Option<i32>,
    pub pain_at_rest_0_10: Option<i32>,
    pub pain_on_activity_0_10: Option<i32>,
    pub night_pain: String,
    pub prior_hip_surgery: String,
    pub prior_hip_surgery_detail: String,
    pub prior_injury_or_dysplasia_history: String,
    pub prior_injury_or_dysplasia_detail: String,
    pub ohs_pain_severity: Option<i32>,
    pub ohs_washing_and_drying: Option<i32>,
    pub ohs_transport: Option<i32>,
    pub ohs_dressing_socks: Option<i32>,
    pub ohs_shopping: Option<i32>,
    pub ohs_walking_pain: Option<i32>,
    pub ohs_limping: Option<i32>,
    pub ohs_kneeling: Option<i32>,
    pub ohs_night_pain: Option<i32>,
    pub ohs_work_interference: Option<i32>,
    pub ohs_giving_way: Option<i32>,
    pub ohs_stairs: Option<i32>,
    pub walking_distance_before_pain: String,
    pub shoes_and_socks_difficulty: String,
    pub walking_aid_use: String,
    pub limp_present: String,
    pub antalgic_gait: String,
    pub trendelenburg_sign: String,
    pub leg_length_discrepancy_as_cm: Option<f64>,
    pub flexion_degrees: Option<i32>,
    pub internal_rotation_degrees: Option<i32>,
    pub external_rotation_degrees: Option<i32>,
    pub abduction_degrees: Option<i32>,
    pub adduction_degrees: Option<i32>,
    pub fixed_flexion_deformity_present: String,
    pub hip_abductor_strength_mrc: Option<i32>,
    pub joint_stability: String,
    pub tenderness_site: String,
    pub weight_bearing_xray_performed: String,
    pub kellgren_lawrence_grade: Option<i32>,
    pub joint_space_narrowing: String,
    pub subchondral_sclerosis_or_cysts_present: String,
    pub mri_performed: String,
    pub mri_findings: String,
    pub ct_performed: String,
    pub ct_indication: String,
    pub physiotherapy_tried: String,
    pub physiotherapy_duration_weeks: Option<i32>,
    pub weight_management_advice_given: String,
    pub steroid_injection_given: String,
    pub steroid_injection_count: Option<i32>,
    pub steroid_injection_response: String,
    pub analgesic_trial_given: String,
    pub analgesic_trial_response: String,
    pub walking_aid_trial: String,
    pub conservative_measures_exhausted: String,
    pub diabetes_controlled: String,
    pub cardiac_disease_present: String,
    pub bleeding_disorder_or_anticoagulant_use: String,
    pub smoking_status: String,
    pub general_fitness_note: String,
    pub full_blood_count_done: String,
    pub renal_function_done: String,
    pub clotting_or_inr_done: String,
    pub ecg_done: String,
    pub mrsa_screen_done: String,
    pub urinalysis_done: String,
    pub risks_and_benefits_discussed: String,
    pub realistic_expectations_discussed: String,
    pub patient_decision_aid_given: String,
    pub interpreter_required: String,
    pub interpreter_language: String,
    pub recommendation: String,
    pub target_list_date: Option<Date>,
    pub responsible_surgeon: String,
    pub additional_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hip_replacement_surgery_evaluations (patient_id, clinician_id, \
            status, assessment_date, assessment_time, site_name, affected_side, \
            symptom_duration_months, pain_at_rest_0_10, pain_on_activity_0_10, \
            night_pain, prior_hip_surgery, prior_hip_surgery_detail, \
            prior_injury_or_dysplasia_history, prior_injury_or_dysplasia_detail, \
            ohs_pain_severity, ohs_washing_and_drying, ohs_transport, \
            ohs_dressing_socks, ohs_shopping, ohs_walking_pain, ohs_limping, \
            ohs_kneeling, ohs_night_pain, ohs_work_interference, ohs_giving_way, \
            ohs_stairs, walking_distance_before_pain, shoes_and_socks_difficulty, \
            walking_aid_use, limp_present, antalgic_gait, trendelenburg_sign, \
            leg_length_discrepancy_as_cm, flexion_degrees, internal_rotation_degrees, \
            external_rotation_degrees, abduction_degrees, adduction_degrees, \
            fixed_flexion_deformity_present, hip_abductor_strength_mrc, joint_stability, \
            tenderness_site, weight_bearing_xray_performed, kellgren_lawrence_grade, \
            joint_space_narrowing, subchondral_sclerosis_or_cysts_present, \
            mri_performed, mri_findings, ct_performed, ct_indication, \
            physiotherapy_tried, physiotherapy_duration_weeks, \
            weight_management_advice_given, steroid_injection_given, \
            steroid_injection_count, steroid_injection_response, analgesic_trial_given, \
            analgesic_trial_response, walking_aid_trial, \
            conservative_measures_exhausted, diabetes_controlled, \
            cardiac_disease_present, bleeding_disorder_or_anticoagulant_use, \
            smoking_status, general_fitness_note, full_blood_count_done, \
            renal_function_done, clotting_or_inr_done, ecg_done, mrsa_screen_done, \
            urinalysis_done, risks_and_benefits_discussed, \
            realistic_expectations_discussed, patient_decision_aid_given, \
            interpreter_required, interpreter_language, recommendation, \
            target_list_date, responsible_surgeon, additional_notes) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, \
            $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, \
            $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, \
            $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, \
            $80, $81) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.affected_side)
        .bind(self.symptom_duration_months)
        .bind(self.pain_at_rest_0_10)
        .bind(self.pain_on_activity_0_10)
        .bind(&self.night_pain)
        .bind(&self.prior_hip_surgery)
        .bind(&self.prior_hip_surgery_detail)
        .bind(&self.prior_injury_or_dysplasia_history)
        .bind(&self.prior_injury_or_dysplasia_detail)
        .bind(self.ohs_pain_severity)
        .bind(self.ohs_washing_and_drying)
        .bind(self.ohs_transport)
        .bind(self.ohs_dressing_socks)
        .bind(self.ohs_shopping)
        .bind(self.ohs_walking_pain)
        .bind(self.ohs_limping)
        .bind(self.ohs_kneeling)
        .bind(self.ohs_night_pain)
        .bind(self.ohs_work_interference)
        .bind(self.ohs_giving_way)
        .bind(self.ohs_stairs)
        .bind(&self.walking_distance_before_pain)
        .bind(&self.shoes_and_socks_difficulty)
        .bind(&self.walking_aid_use)
        .bind(&self.limp_present)
        .bind(&self.antalgic_gait)
        .bind(&self.trendelenburg_sign)
        .bind(self.leg_length_discrepancy_as_cm)
        .bind(self.flexion_degrees)
        .bind(self.internal_rotation_degrees)
        .bind(self.external_rotation_degrees)
        .bind(self.abduction_degrees)
        .bind(self.adduction_degrees)
        .bind(&self.fixed_flexion_deformity_present)
        .bind(self.hip_abductor_strength_mrc)
        .bind(&self.joint_stability)
        .bind(&self.tenderness_site)
        .bind(&self.weight_bearing_xray_performed)
        .bind(self.kellgren_lawrence_grade)
        .bind(&self.joint_space_narrowing)
        .bind(&self.subchondral_sclerosis_or_cysts_present)
        .bind(&self.mri_performed)
        .bind(&self.mri_findings)
        .bind(&self.ct_performed)
        .bind(&self.ct_indication)
        .bind(&self.physiotherapy_tried)
        .bind(self.physiotherapy_duration_weeks)
        .bind(&self.weight_management_advice_given)
        .bind(&self.steroid_injection_given)
        .bind(self.steroid_injection_count)
        .bind(&self.steroid_injection_response)
        .bind(&self.analgesic_trial_given)
        .bind(&self.analgesic_trial_response)
        .bind(&self.walking_aid_trial)
        .bind(&self.conservative_measures_exhausted)
        .bind(&self.diabetes_controlled)
        .bind(&self.cardiac_disease_present)
        .bind(&self.bleeding_disorder_or_anticoagulant_use)
        .bind(&self.smoking_status)
        .bind(&self.general_fitness_note)
        .bind(&self.full_blood_count_done)
        .bind(&self.renal_function_done)
        .bind(&self.clotting_or_inr_done)
        .bind(&self.ecg_done)
        .bind(&self.mrsa_screen_done)
        .bind(&self.urinalysis_done)
        .bind(&self.risks_and_benefits_discussed)
        .bind(&self.realistic_expectations_discussed)
        .bind(&self.patient_decision_aid_given)
        .bind(&self.interpreter_required)
        .bind(&self.interpreter_language)
        .bind(&self.recommendation)
        .bind(self.target_list_date)
        .bind(&self.responsible_surgeon)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hip_replacement_surgery_evaluations SET patient_id = $2, clinician_id \
            = $3, status = $4, assessment_date = $5, assessment_time = $6, site_name = \
            $7, affected_side = $8, symptom_duration_months = $9, pain_at_rest_0_10 = \
            $10, pain_on_activity_0_10 = $11, night_pain = $12, prior_hip_surgery = $13, \
            prior_hip_surgery_detail = $14, prior_injury_or_dysplasia_history = $15, \
            prior_injury_or_dysplasia_detail = $16, ohs_pain_severity = $17, \
            ohs_washing_and_drying = $18, ohs_transport = $19, ohs_dressing_socks = $20, \
            ohs_shopping = $21, ohs_walking_pain = $22, ohs_limping = $23, ohs_kneeling \
            = $24, ohs_night_pain = $25, ohs_work_interference = $26, ohs_giving_way = \
            $27, ohs_stairs = $28, walking_distance_before_pain = $29, \
            shoes_and_socks_difficulty = $30, walking_aid_use = $31, limp_present = $32, \
            antalgic_gait = $33, trendelenburg_sign = $34, leg_length_discrepancy_as_cm \
            = $35, flexion_degrees = $36, internal_rotation_degrees = $37, \
            external_rotation_degrees = $38, abduction_degrees = $39, adduction_degrees \
            = $40, fixed_flexion_deformity_present = $41, hip_abductor_strength_mrc = \
            $42, joint_stability = $43, tenderness_site = $44, \
            weight_bearing_xray_performed = $45, kellgren_lawrence_grade = $46, \
            joint_space_narrowing = $47, subchondral_sclerosis_or_cysts_present = $48, \
            mri_performed = $49, mri_findings = $50, ct_performed = $51, ct_indication = \
            $52, physiotherapy_tried = $53, physiotherapy_duration_weeks = $54, \
            weight_management_advice_given = $55, steroid_injection_given = $56, \
            steroid_injection_count = $57, steroid_injection_response = $58, \
            analgesic_trial_given = $59, analgesic_trial_response = $60, \
            walking_aid_trial = $61, conservative_measures_exhausted = $62, \
            diabetes_controlled = $63, cardiac_disease_present = $64, \
            bleeding_disorder_or_anticoagulant_use = $65, smoking_status = $66, \
            general_fitness_note = $67, full_blood_count_done = $68, renal_function_done \
            = $69, clotting_or_inr_done = $70, ecg_done = $71, mrsa_screen_done = $72, \
            urinalysis_done = $73, risks_and_benefits_discussed = $74, \
            realistic_expectations_discussed = $75, patient_decision_aid_given = $76, \
            interpreter_required = $77, interpreter_language = $78, recommendation = \
            $79, target_list_date = $80, responsible_surgeon = $81, additional_notes = \
            $82, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.affected_side)
        .bind(self.symptom_duration_months)
        .bind(self.pain_at_rest_0_10)
        .bind(self.pain_on_activity_0_10)
        .bind(&self.night_pain)
        .bind(&self.prior_hip_surgery)
        .bind(&self.prior_hip_surgery_detail)
        .bind(&self.prior_injury_or_dysplasia_history)
        .bind(&self.prior_injury_or_dysplasia_detail)
        .bind(self.ohs_pain_severity)
        .bind(self.ohs_washing_and_drying)
        .bind(self.ohs_transport)
        .bind(self.ohs_dressing_socks)
        .bind(self.ohs_shopping)
        .bind(self.ohs_walking_pain)
        .bind(self.ohs_limping)
        .bind(self.ohs_kneeling)
        .bind(self.ohs_night_pain)
        .bind(self.ohs_work_interference)
        .bind(self.ohs_giving_way)
        .bind(self.ohs_stairs)
        .bind(&self.walking_distance_before_pain)
        .bind(&self.shoes_and_socks_difficulty)
        .bind(&self.walking_aid_use)
        .bind(&self.limp_present)
        .bind(&self.antalgic_gait)
        .bind(&self.trendelenburg_sign)
        .bind(self.leg_length_discrepancy_as_cm)
        .bind(self.flexion_degrees)
        .bind(self.internal_rotation_degrees)
        .bind(self.external_rotation_degrees)
        .bind(self.abduction_degrees)
        .bind(self.adduction_degrees)
        .bind(&self.fixed_flexion_deformity_present)
        .bind(self.hip_abductor_strength_mrc)
        .bind(&self.joint_stability)
        .bind(&self.tenderness_site)
        .bind(&self.weight_bearing_xray_performed)
        .bind(self.kellgren_lawrence_grade)
        .bind(&self.joint_space_narrowing)
        .bind(&self.subchondral_sclerosis_or_cysts_present)
        .bind(&self.mri_performed)
        .bind(&self.mri_findings)
        .bind(&self.ct_performed)
        .bind(&self.ct_indication)
        .bind(&self.physiotherapy_tried)
        .bind(self.physiotherapy_duration_weeks)
        .bind(&self.weight_management_advice_given)
        .bind(&self.steroid_injection_given)
        .bind(self.steroid_injection_count)
        .bind(&self.steroid_injection_response)
        .bind(&self.analgesic_trial_given)
        .bind(&self.analgesic_trial_response)
        .bind(&self.walking_aid_trial)
        .bind(&self.conservative_measures_exhausted)
        .bind(&self.diabetes_controlled)
        .bind(&self.cardiac_disease_present)
        .bind(&self.bleeding_disorder_or_anticoagulant_use)
        .bind(&self.smoking_status)
        .bind(&self.general_fitness_note)
        .bind(&self.full_blood_count_done)
        .bind(&self.renal_function_done)
        .bind(&self.clotting_or_inr_done)
        .bind(&self.ecg_done)
        .bind(&self.mrsa_screen_done)
        .bind(&self.urinalysis_done)
        .bind(&self.risks_and_benefits_discussed)
        .bind(&self.realistic_expectations_discussed)
        .bind(&self.patient_decision_aid_given)
        .bind(&self.interpreter_required)
        .bind(&self.interpreter_language)
        .bind(&self.recommendation)
        .bind(self.target_list_date)
        .bind(&self.responsible_surgeon)
        .bind(&self.additional_notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/hip_replacement_surgery_evaluations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
