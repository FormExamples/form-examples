#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::knee_replacement_surgery_evaluations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub knee_side: String,
    pub symptom_duration_months: Option<i32>,
    pub pain_at_rest_0_to_10: Option<i32>,
    pub pain_on_activity_0_to_10: Option<i32>,
    pub night_pain: String,
    pub prior_knee_surgery: String,
    pub prior_knee_surgery_type: String,
    pub prior_knee_surgery_date: Option<Date>,
    pub prior_injury: String,
    pub prior_injury_detail: String,
    pub oks_pain_severity: Option<i32>,
    pub oks_washing_and_drying: Option<i32>,
    pub oks_transport: Option<i32>,
    pub oks_walking_distance: Option<i32>,
    pub oks_pain_sitting_or_lying: Option<i32>,
    pub oks_limping: Option<i32>,
    pub oks_kneeling: Option<i32>,
    pub oks_night_pain_frequency: Option<i32>,
    pub oks_pain_interfering_with_work: Option<i32>,
    pub oks_giving_way: Option<i32>,
    pub oks_shopping: Option<i32>,
    pub oks_stairs: Option<i32>,
    pub walking_distance_before_pain: String,
    pub stair_climbing_ability: String,
    pub stand_from_chair_unaided: String,
    pub walking_aid: String,
    pub flexion_degrees: Option<i32>,
    pub extension_deficit_degrees: Option<i32>,
    pub fixed_flexion_deformity_present: String,
    pub fixed_flexion_deformity_degrees: Option<i32>,
    pub coronal_deformity_type: String,
    pub coronal_deformity_severity: String,
    pub ligament_acl: String,
    pub ligament_pcl: String,
    pub ligament_mcl: String,
    pub ligament_lcl: String,
    pub patellar_tracking: String,
    pub quadriceps_strength_mrc: Option<i32>,
    pub effusion_present: String,
    pub crepitus_present: String,
    pub weight_bearing_xray_performed: String,
    pub kellgren_lawrence_grade_medial: Option<i32>,
    pub kellgren_lawrence_grade_lateral: Option<i32>,
    pub kellgren_lawrence_grade_patellofemoral: Option<i32>,
    pub mri_performed: String,
    pub mri_findings: String,
    pub ct_performed: String,
    pub ct_indication: String,
    pub physiotherapy_tried: String,
    pub physiotherapy_duration_weeks: Option<i32>,
    pub weight_management_advice_given: String,
    pub injection_given: String,
    pub injection_type: String,
    pub injection_count: Option<i32>,
    pub injection_response: String,
    pub nsaid_analgesic_trial: String,
    pub nsaid_analgesic_response: String,
    pub walking_aid_trial: String,
    pub conservative_measures_exhausted: String,
    pub diabetes_controlled: String,
    pub cardiac_disease: String,
    pub bleeding_disorder_or_anticoagulant: String,
    pub smoking_status: String,
    pub general_fitness_note: String,
    pub fbc_done: String,
    pub renal_function_done: String,
    pub clotting_done: String,
    pub ecg_done: String,
    pub mrsa_screen_done: String,
    pub urinalysis_done: String,
    pub risks_benefits_discussed: String,
    pub realistic_expectations_discussed: String,
    pub patient_decision_aid_given: String,
    pub interpreter_required: String,
    pub plan_recommendation: String,
    pub target_list_date: Option<Date>,
    pub responsible_surgeon: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO knee_replacement_surgery_evaluations (patient_id, clinician_id, \
            status, site_name, assessment_date, assessment_time, knee_side, \
            symptom_duration_months, pain_at_rest_0_to_10, pain_on_activity_0_to_10, \
            night_pain, prior_knee_surgery, prior_knee_surgery_type, \
            prior_knee_surgery_date, prior_injury, prior_injury_detail, \
            oks_pain_severity, oks_washing_and_drying, oks_transport, \
            oks_walking_distance, oks_pain_sitting_or_lying, oks_limping, oks_kneeling, \
            oks_night_pain_frequency, oks_pain_interfering_with_work, oks_giving_way, \
            oks_shopping, oks_stairs, walking_distance_before_pain, \
            stair_climbing_ability, stand_from_chair_unaided, walking_aid, \
            flexion_degrees, extension_deficit_degrees, fixed_flexion_deformity_present, \
            fixed_flexion_deformity_degrees, coronal_deformity_type, \
            coronal_deformity_severity, ligament_acl, ligament_pcl, ligament_mcl, \
            ligament_lcl, patellar_tracking, quadriceps_strength_mrc, effusion_present, \
            crepitus_present, weight_bearing_xray_performed, \
            kellgren_lawrence_grade_medial, kellgren_lawrence_grade_lateral, \
            kellgren_lawrence_grade_patellofemoral, mri_performed, mri_findings, \
            ct_performed, ct_indication, physiotherapy_tried, \
            physiotherapy_duration_weeks, weight_management_advice_given, \
            injection_given, injection_type, injection_count, injection_response, \
            nsaid_analgesic_trial, nsaid_analgesic_response, walking_aid_trial, \
            conservative_measures_exhausted, diabetes_controlled, cardiac_disease, \
            bleeding_disorder_or_anticoagulant, smoking_status, general_fitness_note, \
            fbc_done, renal_function_done, clotting_done, ecg_done, mrsa_screen_done, \
            urinalysis_done, risks_benefits_discussed, realistic_expectations_discussed, \
            patient_decision_aid_given, interpreter_required, plan_recommendation, \
            target_list_date, responsible_surgeon) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, \
            $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, \
            $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, \
            $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, \
            $83) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.knee_side)
        .bind(self.symptom_duration_months)
        .bind(self.pain_at_rest_0_to_10)
        .bind(self.pain_on_activity_0_to_10)
        .bind(&self.night_pain)
        .bind(&self.prior_knee_surgery)
        .bind(&self.prior_knee_surgery_type)
        .bind(self.prior_knee_surgery_date)
        .bind(&self.prior_injury)
        .bind(&self.prior_injury_detail)
        .bind(self.oks_pain_severity)
        .bind(self.oks_washing_and_drying)
        .bind(self.oks_transport)
        .bind(self.oks_walking_distance)
        .bind(self.oks_pain_sitting_or_lying)
        .bind(self.oks_limping)
        .bind(self.oks_kneeling)
        .bind(self.oks_night_pain_frequency)
        .bind(self.oks_pain_interfering_with_work)
        .bind(self.oks_giving_way)
        .bind(self.oks_shopping)
        .bind(self.oks_stairs)
        .bind(&self.walking_distance_before_pain)
        .bind(&self.stair_climbing_ability)
        .bind(&self.stand_from_chair_unaided)
        .bind(&self.walking_aid)
        .bind(self.flexion_degrees)
        .bind(self.extension_deficit_degrees)
        .bind(&self.fixed_flexion_deformity_present)
        .bind(self.fixed_flexion_deformity_degrees)
        .bind(&self.coronal_deformity_type)
        .bind(&self.coronal_deformity_severity)
        .bind(&self.ligament_acl)
        .bind(&self.ligament_pcl)
        .bind(&self.ligament_mcl)
        .bind(&self.ligament_lcl)
        .bind(&self.patellar_tracking)
        .bind(self.quadriceps_strength_mrc)
        .bind(&self.effusion_present)
        .bind(&self.crepitus_present)
        .bind(&self.weight_bearing_xray_performed)
        .bind(self.kellgren_lawrence_grade_medial)
        .bind(self.kellgren_lawrence_grade_lateral)
        .bind(self.kellgren_lawrence_grade_patellofemoral)
        .bind(&self.mri_performed)
        .bind(&self.mri_findings)
        .bind(&self.ct_performed)
        .bind(&self.ct_indication)
        .bind(&self.physiotherapy_tried)
        .bind(self.physiotherapy_duration_weeks)
        .bind(&self.weight_management_advice_given)
        .bind(&self.injection_given)
        .bind(&self.injection_type)
        .bind(self.injection_count)
        .bind(&self.injection_response)
        .bind(&self.nsaid_analgesic_trial)
        .bind(&self.nsaid_analgesic_response)
        .bind(&self.walking_aid_trial)
        .bind(&self.conservative_measures_exhausted)
        .bind(&self.diabetes_controlled)
        .bind(&self.cardiac_disease)
        .bind(&self.bleeding_disorder_or_anticoagulant)
        .bind(&self.smoking_status)
        .bind(&self.general_fitness_note)
        .bind(&self.fbc_done)
        .bind(&self.renal_function_done)
        .bind(&self.clotting_done)
        .bind(&self.ecg_done)
        .bind(&self.mrsa_screen_done)
        .bind(&self.urinalysis_done)
        .bind(&self.risks_benefits_discussed)
        .bind(&self.realistic_expectations_discussed)
        .bind(&self.patient_decision_aid_given)
        .bind(&self.interpreter_required)
        .bind(&self.plan_recommendation)
        .bind(self.target_list_date)
        .bind(&self.responsible_surgeon)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE knee_replacement_surgery_evaluations SET patient_id = $2, \
            clinician_id = $3, status = $4, site_name = $5, assessment_date = $6, \
            assessment_time = $7, knee_side = $8, symptom_duration_months = $9, \
            pain_at_rest_0_to_10 = $10, pain_on_activity_0_to_10 = $11, night_pain = \
            $12, prior_knee_surgery = $13, prior_knee_surgery_type = $14, \
            prior_knee_surgery_date = $15, prior_injury = $16, prior_injury_detail = \
            $17, oks_pain_severity = $18, oks_washing_and_drying = $19, oks_transport = \
            $20, oks_walking_distance = $21, oks_pain_sitting_or_lying = $22, \
            oks_limping = $23, oks_kneeling = $24, oks_night_pain_frequency = $25, \
            oks_pain_interfering_with_work = $26, oks_giving_way = $27, oks_shopping = \
            $28, oks_stairs = $29, walking_distance_before_pain = $30, \
            stair_climbing_ability = $31, stand_from_chair_unaided = $32, walking_aid = \
            $33, flexion_degrees = $34, extension_deficit_degrees = $35, \
            fixed_flexion_deformity_present = $36, fixed_flexion_deformity_degrees = \
            $37, coronal_deformity_type = $38, coronal_deformity_severity = $39, \
            ligament_acl = $40, ligament_pcl = $41, ligament_mcl = $42, ligament_lcl = \
            $43, patellar_tracking = $44, quadriceps_strength_mrc = $45, \
            effusion_present = $46, crepitus_present = $47, \
            weight_bearing_xray_performed = $48, kellgren_lawrence_grade_medial = $49, \
            kellgren_lawrence_grade_lateral = $50, \
            kellgren_lawrence_grade_patellofemoral = $51, mri_performed = $52, \
            mri_findings = $53, ct_performed = $54, ct_indication = $55, \
            physiotherapy_tried = $56, physiotherapy_duration_weeks = $57, \
            weight_management_advice_given = $58, injection_given = $59, injection_type \
            = $60, injection_count = $61, injection_response = $62, \
            nsaid_analgesic_trial = $63, nsaid_analgesic_response = $64, \
            walking_aid_trial = $65, conservative_measures_exhausted = $66, \
            diabetes_controlled = $67, cardiac_disease = $68, \
            bleeding_disorder_or_anticoagulant = $69, smoking_status = $70, \
            general_fitness_note = $71, fbc_done = $72, renal_function_done = $73, \
            clotting_done = $74, ecg_done = $75, mrsa_screen_done = $76, urinalysis_done \
            = $77, risks_benefits_discussed = $78, realistic_expectations_discussed = \
            $79, patient_decision_aid_given = $80, interpreter_required = $81, \
            plan_recommendation = $82, target_list_date = $83, responsible_surgeon = \
            $84, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.knee_side)
        .bind(self.symptom_duration_months)
        .bind(self.pain_at_rest_0_to_10)
        .bind(self.pain_on_activity_0_to_10)
        .bind(&self.night_pain)
        .bind(&self.prior_knee_surgery)
        .bind(&self.prior_knee_surgery_type)
        .bind(self.prior_knee_surgery_date)
        .bind(&self.prior_injury)
        .bind(&self.prior_injury_detail)
        .bind(self.oks_pain_severity)
        .bind(self.oks_washing_and_drying)
        .bind(self.oks_transport)
        .bind(self.oks_walking_distance)
        .bind(self.oks_pain_sitting_or_lying)
        .bind(self.oks_limping)
        .bind(self.oks_kneeling)
        .bind(self.oks_night_pain_frequency)
        .bind(self.oks_pain_interfering_with_work)
        .bind(self.oks_giving_way)
        .bind(self.oks_shopping)
        .bind(self.oks_stairs)
        .bind(&self.walking_distance_before_pain)
        .bind(&self.stair_climbing_ability)
        .bind(&self.stand_from_chair_unaided)
        .bind(&self.walking_aid)
        .bind(self.flexion_degrees)
        .bind(self.extension_deficit_degrees)
        .bind(&self.fixed_flexion_deformity_present)
        .bind(self.fixed_flexion_deformity_degrees)
        .bind(&self.coronal_deformity_type)
        .bind(&self.coronal_deformity_severity)
        .bind(&self.ligament_acl)
        .bind(&self.ligament_pcl)
        .bind(&self.ligament_mcl)
        .bind(&self.ligament_lcl)
        .bind(&self.patellar_tracking)
        .bind(self.quadriceps_strength_mrc)
        .bind(&self.effusion_present)
        .bind(&self.crepitus_present)
        .bind(&self.weight_bearing_xray_performed)
        .bind(self.kellgren_lawrence_grade_medial)
        .bind(self.kellgren_lawrence_grade_lateral)
        .bind(self.kellgren_lawrence_grade_patellofemoral)
        .bind(&self.mri_performed)
        .bind(&self.mri_findings)
        .bind(&self.ct_performed)
        .bind(&self.ct_indication)
        .bind(&self.physiotherapy_tried)
        .bind(self.physiotherapy_duration_weeks)
        .bind(&self.weight_management_advice_given)
        .bind(&self.injection_given)
        .bind(&self.injection_type)
        .bind(self.injection_count)
        .bind(&self.injection_response)
        .bind(&self.nsaid_analgesic_trial)
        .bind(&self.nsaid_analgesic_response)
        .bind(&self.walking_aid_trial)
        .bind(&self.conservative_measures_exhausted)
        .bind(&self.diabetes_controlled)
        .bind(&self.cardiac_disease)
        .bind(&self.bleeding_disorder_or_anticoagulant)
        .bind(&self.smoking_status)
        .bind(&self.general_fitness_note)
        .bind(&self.fbc_done)
        .bind(&self.renal_function_done)
        .bind(&self.clotting_done)
        .bind(&self.ecg_done)
        .bind(&self.mrsa_screen_done)
        .bind(&self.urinalysis_done)
        .bind(&self.risks_benefits_discussed)
        .bind(&self.realistic_expectations_discussed)
        .bind(&self.patient_decision_aid_given)
        .bind(&self.interpreter_required)
        .bind(&self.plan_recommendation)
        .bind(self.target_list_date)
        .bind(&self.responsible_surgeon)
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
        .prefix("api/knee_replacement_surgery_evaluations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
