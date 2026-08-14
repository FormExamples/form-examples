#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::knee_replacement_surgery_evaluations::{ActiveModel, Entity, Model};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: i64,
    pub clinician_id: i64,
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
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.patient_id = Set(self.patient_id);
      item.clinician_id = Set(self.clinician_id);
      item.status = Set(self.status.clone());
      item.site_name = Set(self.site_name.clone());
      item.assessment_date = Set(self.assessment_date);
      item.assessment_time = Set(self.assessment_time.clone());
      item.knee_side = Set(self.knee_side.clone());
      item.symptom_duration_months = Set(self.symptom_duration_months);
      item.pain_at_rest_0_to_10 = Set(self.pain_at_rest_0_to_10);
      item.pain_on_activity_0_to_10 = Set(self.pain_on_activity_0_to_10);
      item.night_pain = Set(self.night_pain.clone());
      item.prior_knee_surgery = Set(self.prior_knee_surgery.clone());
      item.prior_knee_surgery_type = Set(self.prior_knee_surgery_type.clone());
      item.prior_knee_surgery_date = Set(self.prior_knee_surgery_date);
      item.prior_injury = Set(self.prior_injury.clone());
      item.prior_injury_detail = Set(self.prior_injury_detail.clone());
      item.oks_pain_severity = Set(self.oks_pain_severity);
      item.oks_washing_and_drying = Set(self.oks_washing_and_drying);
      item.oks_transport = Set(self.oks_transport);
      item.oks_walking_distance = Set(self.oks_walking_distance);
      item.oks_pain_sitting_or_lying = Set(self.oks_pain_sitting_or_lying);
      item.oks_limping = Set(self.oks_limping);
      item.oks_kneeling = Set(self.oks_kneeling);
      item.oks_night_pain_frequency = Set(self.oks_night_pain_frequency);
      item.oks_pain_interfering_with_work = Set(self.oks_pain_interfering_with_work);
      item.oks_giving_way = Set(self.oks_giving_way);
      item.oks_shopping = Set(self.oks_shopping);
      item.oks_stairs = Set(self.oks_stairs);
      item.walking_distance_before_pain = Set(self.walking_distance_before_pain.clone());
      item.stair_climbing_ability = Set(self.stair_climbing_ability.clone());
      item.stand_from_chair_unaided = Set(self.stand_from_chair_unaided.clone());
      item.walking_aid = Set(self.walking_aid.clone());
      item.flexion_degrees = Set(self.flexion_degrees);
      item.extension_deficit_degrees = Set(self.extension_deficit_degrees);
      item.fixed_flexion_deformity_present = Set(self.fixed_flexion_deformity_present.clone());
      item.fixed_flexion_deformity_degrees = Set(self.fixed_flexion_deformity_degrees);
      item.coronal_deformity_type = Set(self.coronal_deformity_type.clone());
      item.coronal_deformity_severity = Set(self.coronal_deformity_severity.clone());
      item.ligament_acl = Set(self.ligament_acl.clone());
      item.ligament_pcl = Set(self.ligament_pcl.clone());
      item.ligament_mcl = Set(self.ligament_mcl.clone());
      item.ligament_lcl = Set(self.ligament_lcl.clone());
      item.patellar_tracking = Set(self.patellar_tracking.clone());
      item.quadriceps_strength_mrc = Set(self.quadriceps_strength_mrc);
      item.effusion_present = Set(self.effusion_present.clone());
      item.crepitus_present = Set(self.crepitus_present.clone());
      item.weight_bearing_xray_performed = Set(self.weight_bearing_xray_performed.clone());
      item.kellgren_lawrence_grade_medial = Set(self.kellgren_lawrence_grade_medial);
      item.kellgren_lawrence_grade_lateral = Set(self.kellgren_lawrence_grade_lateral);
      item.kellgren_lawrence_grade_patellofemoral = Set(self.kellgren_lawrence_grade_patellofemoral);
      item.mri_performed = Set(self.mri_performed.clone());
      item.mri_findings = Set(self.mri_findings.clone());
      item.ct_performed = Set(self.ct_performed.clone());
      item.ct_indication = Set(self.ct_indication.clone());
      item.physiotherapy_tried = Set(self.physiotherapy_tried.clone());
      item.physiotherapy_duration_weeks = Set(self.physiotherapy_duration_weeks);
      item.weight_management_advice_given = Set(self.weight_management_advice_given.clone());
      item.injection_given = Set(self.injection_given.clone());
      item.injection_type = Set(self.injection_type.clone());
      item.injection_count = Set(self.injection_count);
      item.injection_response = Set(self.injection_response.clone());
      item.nsaid_analgesic_trial = Set(self.nsaid_analgesic_trial.clone());
      item.nsaid_analgesic_response = Set(self.nsaid_analgesic_response.clone());
      item.walking_aid_trial = Set(self.walking_aid_trial.clone());
      item.conservative_measures_exhausted = Set(self.conservative_measures_exhausted.clone());
      item.diabetes_controlled = Set(self.diabetes_controlled.clone());
      item.cardiac_disease = Set(self.cardiac_disease.clone());
      item.bleeding_disorder_or_anticoagulant = Set(self.bleeding_disorder_or_anticoagulant.clone());
      item.smoking_status = Set(self.smoking_status.clone());
      item.general_fitness_note = Set(self.general_fitness_note.clone());
      item.fbc_done = Set(self.fbc_done.clone());
      item.renal_function_done = Set(self.renal_function_done.clone());
      item.clotting_done = Set(self.clotting_done.clone());
      item.ecg_done = Set(self.ecg_done.clone());
      item.mrsa_screen_done = Set(self.mrsa_screen_done.clone());
      item.urinalysis_done = Set(self.urinalysis_done.clone());
      item.risks_benefits_discussed = Set(self.risks_benefits_discussed.clone());
      item.realistic_expectations_discussed = Set(self.realistic_expectations_discussed.clone());
      item.patient_decision_aid_given = Set(self.patient_decision_aid_given.clone());
      item.interpreter_required = Set(self.interpreter_required.clone());
      item.plan_recommendation = Set(self.plan_recommendation.clone());
      item.target_list_date = Set(self.target_list_date);
      item.responsible_surgeon = Set(self.responsible_surgeon.clone());
      }
}

async fn load_item(ctx: &AppContext, id: i64) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i64>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<i64>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<i64>, State(ctx): State<AppContext>) -> Result<Response> {
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
