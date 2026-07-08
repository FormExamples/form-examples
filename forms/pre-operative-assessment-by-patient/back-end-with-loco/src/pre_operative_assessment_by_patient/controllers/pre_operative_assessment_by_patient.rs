#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::pre_operative_assessment_by_patients::{ActiveModel, Entity, Model};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: i32,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub planned_procedure: String,
    pub procedure_urgency: String,
    pub status: String,
    pub hypertension: String,
    pub hypertension_controlled: String,
    pub ischemic_heart_disease: String,
    pub ihd_details: String,
    pub heart_failure: String,
    pub heart_failure_nyha: String,
    pub valvular_disease: String,
    pub valvular_details: String,
    pub arrhythmia: String,
    pub arrhythmia_type: String,
    pub pacemaker: String,
    pub recent_mi: String,
    pub recent_mi_weeks: Option<i32>,
    pub asthma: String,
    pub asthma_frequency: String,
    pub copd: String,
    pub copd_severity: String,
    pub osa: String,
    pub osa_cpap: String,
    pub smoking: String,
    pub smoking_pack_years: Option<i32>,
    pub recent_urti: String,
    pub ckd: String,
    pub ckd_stage: String,
    pub dialysis: String,
    pub dialysis_type: String,
    pub liver_disease: String,
    pub cirrhosis: String,
    pub child_pugh_score: String,
    pub hepatitis: String,
    pub hepatitis_type: String,
    pub diabetes: String,
    pub diabetes_control: String,
    pub diabetes_on_insulin: String,
    pub thyroid_disease: String,
    pub thyroid_type: String,
    pub adrenal_insufficiency: String,
    pub stroke_or_tia: String,
    pub stroke_details: String,
    pub epilepsy: String,
    pub epilepsy_controlled: String,
    pub neuromuscular_disease: String,
    pub neuromuscular_details: String,
    pub raised_icp: String,
    pub bleeding_disorder: String,
    pub bleeding_details: String,
    pub on_anticoagulants: String,
    pub anticoagulant_type: String,
    pub sickle_cell_disease: String,
    pub sickle_cell_trait: String,
    pub anaemia: String,
    pub rheumatoid_arthritis: String,
    pub cervical_spine_issues: String,
    pub limited_neck_movement: String,
    pub limited_mouth_opening: String,
    pub dental_issues: String,
    pub dental_details: String,
    pub previous_difficult_airway: String,
    pub mallampati_score: String,
    pub gord: String,
    pub hiatus_hernia: String,
    pub nausea: String,
    pub name: String,
    pub dose: String,
    pub frequency: String,
    pub sort_order: i32,
    pub allergen: String,
    pub reaction: String,
    pub severity: String,
    pub allergy_sort_order: i32,
    pub previous_anaesthesia: String,
    pub anaesthesia_problems: String,
    pub anaesthesia_problem_details: String,
    pub family_mh_history: String,
    pub family_mh_details: String,
    pub ponv: String,
    pub alcohol: String,
    pub alcohol_units_per_week: Option<i32>,
    pub recreational_drugs: String,
    pub drug_details: String,
    pub exercise_tolerance: String,
    pub estimated_mets: Option<f64>,
    pub mobility_aids: String,
    pub recent_decline: String,
    pub possibly_pregnant: String,
    pub pregnancy_confirmed: String,
    pub gestation_weeks: Option<i32>,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.patient_id = Set(self.patient_id);
      item.weight = Set(self.weight);
      item.height = Set(self.height);
      item.bmi = Set(self.bmi);
      item.planned_procedure = Set(self.planned_procedure.clone());
      item.procedure_urgency = Set(self.procedure_urgency.clone());
      item.status = Set(self.status.clone());
      item.hypertension = Set(self.hypertension.clone());
      item.hypertension_controlled = Set(self.hypertension_controlled.clone());
      item.ischemic_heart_disease = Set(self.ischemic_heart_disease.clone());
      item.ihd_details = Set(self.ihd_details.clone());
      item.heart_failure = Set(self.heart_failure.clone());
      item.heart_failure_nyha = Set(self.heart_failure_nyha.clone());
      item.valvular_disease = Set(self.valvular_disease.clone());
      item.valvular_details = Set(self.valvular_details.clone());
      item.arrhythmia = Set(self.arrhythmia.clone());
      item.arrhythmia_type = Set(self.arrhythmia_type.clone());
      item.pacemaker = Set(self.pacemaker.clone());
      item.recent_mi = Set(self.recent_mi.clone());
      item.recent_mi_weeks = Set(self.recent_mi_weeks);
      item.asthma = Set(self.asthma.clone());
      item.asthma_frequency = Set(self.asthma_frequency.clone());
      item.copd = Set(self.copd.clone());
      item.copd_severity = Set(self.copd_severity.clone());
      item.osa = Set(self.osa.clone());
      item.osa_cpap = Set(self.osa_cpap.clone());
      item.smoking = Set(self.smoking.clone());
      item.smoking_pack_years = Set(self.smoking_pack_years);
      item.recent_urti = Set(self.recent_urti.clone());
      item.ckd = Set(self.ckd.clone());
      item.ckd_stage = Set(self.ckd_stage.clone());
      item.dialysis = Set(self.dialysis.clone());
      item.dialysis_type = Set(self.dialysis_type.clone());
      item.liver_disease = Set(self.liver_disease.clone());
      item.cirrhosis = Set(self.cirrhosis.clone());
      item.child_pugh_score = Set(self.child_pugh_score.clone());
      item.hepatitis = Set(self.hepatitis.clone());
      item.hepatitis_type = Set(self.hepatitis_type.clone());
      item.diabetes = Set(self.diabetes.clone());
      item.diabetes_control = Set(self.diabetes_control.clone());
      item.diabetes_on_insulin = Set(self.diabetes_on_insulin.clone());
      item.thyroid_disease = Set(self.thyroid_disease.clone());
      item.thyroid_type = Set(self.thyroid_type.clone());
      item.adrenal_insufficiency = Set(self.adrenal_insufficiency.clone());
      item.stroke_or_tia = Set(self.stroke_or_tia.clone());
      item.stroke_details = Set(self.stroke_details.clone());
      item.epilepsy = Set(self.epilepsy.clone());
      item.epilepsy_controlled = Set(self.epilepsy_controlled.clone());
      item.neuromuscular_disease = Set(self.neuromuscular_disease.clone());
      item.neuromuscular_details = Set(self.neuromuscular_details.clone());
      item.raised_icp = Set(self.raised_icp.clone());
      item.bleeding_disorder = Set(self.bleeding_disorder.clone());
      item.bleeding_details = Set(self.bleeding_details.clone());
      item.on_anticoagulants = Set(self.on_anticoagulants.clone());
      item.anticoagulant_type = Set(self.anticoagulant_type.clone());
      item.sickle_cell_disease = Set(self.sickle_cell_disease.clone());
      item.sickle_cell_trait = Set(self.sickle_cell_trait.clone());
      item.anaemia = Set(self.anaemia.clone());
      item.rheumatoid_arthritis = Set(self.rheumatoid_arthritis.clone());
      item.cervical_spine_issues = Set(self.cervical_spine_issues.clone());
      item.limited_neck_movement = Set(self.limited_neck_movement.clone());
      item.limited_mouth_opening = Set(self.limited_mouth_opening.clone());
      item.dental_issues = Set(self.dental_issues.clone());
      item.dental_details = Set(self.dental_details.clone());
      item.previous_difficult_airway = Set(self.previous_difficult_airway.clone());
      item.mallampati_score = Set(self.mallampati_score.clone());
      item.gord = Set(self.gord.clone());
      item.hiatus_hernia = Set(self.hiatus_hernia.clone());
      item.nausea = Set(self.nausea.clone());
      item.name = Set(self.name.clone());
      item.dose = Set(self.dose.clone());
      item.frequency = Set(self.frequency.clone());
      item.sort_order = Set(self.sort_order);
      item.allergen = Set(self.allergen.clone());
      item.reaction = Set(self.reaction.clone());
      item.severity = Set(self.severity.clone());
      item.allergy_sort_order = Set(self.allergy_sort_order);
      item.previous_anaesthesia = Set(self.previous_anaesthesia.clone());
      item.anaesthesia_problems = Set(self.anaesthesia_problems.clone());
      item.anaesthesia_problem_details = Set(self.anaesthesia_problem_details.clone());
      item.family_mh_history = Set(self.family_mh_history.clone());
      item.family_mh_details = Set(self.family_mh_details.clone());
      item.ponv = Set(self.ponv.clone());
      item.alcohol = Set(self.alcohol.clone());
      item.alcohol_units_per_week = Set(self.alcohol_units_per_week);
      item.recreational_drugs = Set(self.recreational_drugs.clone());
      item.drug_details = Set(self.drug_details.clone());
      item.exercise_tolerance = Set(self.exercise_tolerance.clone());
      item.estimated_mets = Set(self.estimated_mets);
      item.mobility_aids = Set(self.mobility_aids.clone());
      item.recent_decline = Set(self.recent_decline.clone());
      item.possibly_pregnant = Set(self.possibly_pregnant.clone());
      item.pregnancy_confirmed = Set(self.pregnancy_confirmed.clone());
      item.gestation_weeks = Set(self.gestation_weeks);
      }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
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
    Path(id): Path<i32>,
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
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/pre_operative_assessment_by_patients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
