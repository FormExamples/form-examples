#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hip_replacement_surgery_evaluations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
            "INSERT INTO hip_replacement_surgery_evaluations (deleted_at, patient_id, \
            clinician_id, status, assessment_date, assessment_time, site_name, affected_side, \
            symptom_duration_months, pain_at_rest_0_10, pain_on_activity_0_10, night_pain, \
            prior_hip_surgery, prior_hip_surgery_detail, prior_injury_or_dysplasia_history, \
            prior_injury_or_dysplasia_detail, ohs_pain_severity, ohs_washing_and_drying, \
            ohs_transport, ohs_dressing_socks, ohs_shopping, ohs_walking_pain, ohs_limping, \
            ohs_kneeling, ohs_night_pain, ohs_work_interference, ohs_giving_way, ohs_stairs, \
            walking_distance_before_pain, shoes_and_socks_difficulty, walking_aid_use, \
            limp_present, antalgic_gait, trendelenburg_sign, leg_length_discrepancy_as_cm, \
            flexion_degrees, internal_rotation_degrees, external_rotation_degrees, \
            abduction_degrees, adduction_degrees, fixed_flexion_deformity_present, \
            hip_abductor_strength_mrc, joint_stability, tenderness_site, \
            weight_bearing_xray_performed, kellgren_lawrence_grade, joint_space_narrowing, \
            subchondral_sclerosis_or_cysts_present, mri_performed, mri_findings, \
            ct_performed, ct_indication, physiotherapy_tried, physiotherapy_duration_weeks, \
            weight_management_advice_given, steroid_injection_given, steroid_injection_count, \
            steroid_injection_response, analgesic_trial_given, analgesic_trial_response, \
            walking_aid_trial, conservative_measures_exhausted, diabetes_controlled, \
            cardiac_disease_present, bleeding_disorder_or_anticoagulant_use, smoking_status, \
            general_fitness_note, full_blood_count_done, renal_function_done, \
            clotting_or_inr_done, ecg_done, mrsa_screen_done, urinalysis_done, \
            risks_and_benefits_discussed, realistic_expectations_discussed, \
            patient_decision_aid_given, interpreter_required, interpreter_language, \
            recommendation, target_list_date, responsible_surgeon, additional_notes) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, \
            $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, \
            $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, \
            $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82) \
            RETURNING *",
        )
        .bind(self.deleted_at)
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
            "UPDATE hip_replacement_surgery_evaluations SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, assessment_date = $6, assessment_time = $7, \
            site_name = $8, affected_side = $9, symptom_duration_months = $10, \
            pain_at_rest_0_10 = $11, pain_on_activity_0_10 = $12, night_pain = $13, \
            prior_hip_surgery = $14, prior_hip_surgery_detail = $15, \
            prior_injury_or_dysplasia_history = $16, prior_injury_or_dysplasia_detail = $17, \
            ohs_pain_severity = $18, ohs_washing_and_drying = $19, ohs_transport = $20, \
            ohs_dressing_socks = $21, ohs_shopping = $22, ohs_walking_pain = $23, ohs_limping \
            = $24, ohs_kneeling = $25, ohs_night_pain = $26, ohs_work_interference = $27, \
            ohs_giving_way = $28, ohs_stairs = $29, walking_distance_before_pain = $30, \
            shoes_and_socks_difficulty = $31, walking_aid_use = $32, limp_present = $33, \
            antalgic_gait = $34, trendelenburg_sign = $35, leg_length_discrepancy_as_cm = \
            $36, flexion_degrees = $37, internal_rotation_degrees = $38, \
            external_rotation_degrees = $39, abduction_degrees = $40, adduction_degrees = \
            $41, fixed_flexion_deformity_present = $42, hip_abductor_strength_mrc = $43, \
            joint_stability = $44, tenderness_site = $45, weight_bearing_xray_performed = \
            $46, kellgren_lawrence_grade = $47, joint_space_narrowing = $48, \
            subchondral_sclerosis_or_cysts_present = $49, mri_performed = $50, mri_findings = \
            $51, ct_performed = $52, ct_indication = $53, physiotherapy_tried = $54, \
            physiotherapy_duration_weeks = $55, weight_management_advice_given = $56, \
            steroid_injection_given = $57, steroid_injection_count = $58, \
            steroid_injection_response = $59, analgesic_trial_given = $60, \
            analgesic_trial_response = $61, walking_aid_trial = $62, \
            conservative_measures_exhausted = $63, diabetes_controlled = $64, \
            cardiac_disease_present = $65, bleeding_disorder_or_anticoagulant_use = $66, \
            smoking_status = $67, general_fitness_note = $68, full_blood_count_done = $69, \
            renal_function_done = $70, clotting_or_inr_done = $71, ecg_done = $72, \
            mrsa_screen_done = $73, urinalysis_done = $74, risks_and_benefits_discussed = \
            $75, realistic_expectations_discussed = $76, patient_decision_aid_given = $77, \
            interpreter_required = $78, interpreter_language = $79, recommendation = $80, \
            target_list_date = $81, responsible_surgeon = $82, additional_notes = $83, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
