#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::diabetes_podiatry_assessments::{ActiveModel, Entity, Model};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: i64,
    pub clinician_id: i64,
    pub assessed_at: Option<Date>,
    pub assessment_setting: String,
    pub diabetes_type: String,
    pub years_since_diagnosis: Option<f64>,
    pub on_renal_replacement_therapy: String,
    pub visual_acuity_impairment: String,
    pub self_care_ability: String,
    pub footwear_appropriate: String,
    pub right_neuropathy_status: String,
    pub right_pulses_status: String,
    pub right_deformity: String,
    pub right_callus: String,
    pub right_skin_breakdown: String,
    pub right_active_ulcer: String,
    pub right_ulcer_severity: String,
    pub right_previous_ulcer: String,
    pub right_previous_amputation: String,
    pub right_suspected_charcot: String,
    pub left_neuropathy_status: String,
    pub left_pulses_status: String,
    pub left_deformity: String,
    pub left_callus: String,
    pub left_skin_breakdown: String,
    pub left_active_ulcer: String,
    pub left_ulcer_severity: String,
    pub left_previous_ulcer: String,
    pub left_previous_amputation: String,
    pub left_suspected_charcot: String,
    pub clinical_context: String,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.patient_id = Set(self.patient_id);
      item.clinician_id = Set(self.clinician_id);
      item.assessed_at = Set(self.assessed_at);
      item.assessment_setting = Set(self.assessment_setting.clone());
      item.diabetes_type = Set(self.diabetes_type.clone());
      item.years_since_diagnosis = Set(self.years_since_diagnosis);
      item.on_renal_replacement_therapy = Set(self.on_renal_replacement_therapy.clone());
      item.visual_acuity_impairment = Set(self.visual_acuity_impairment.clone());
      item.self_care_ability = Set(self.self_care_ability.clone());
      item.footwear_appropriate = Set(self.footwear_appropriate.clone());
      item.right_neuropathy_status = Set(self.right_neuropathy_status.clone());
      item.right_pulses_status = Set(self.right_pulses_status.clone());
      item.right_deformity = Set(self.right_deformity.clone());
      item.right_callus = Set(self.right_callus.clone());
      item.right_skin_breakdown = Set(self.right_skin_breakdown.clone());
      item.right_active_ulcer = Set(self.right_active_ulcer.clone());
      item.right_ulcer_severity = Set(self.right_ulcer_severity.clone());
      item.right_previous_ulcer = Set(self.right_previous_ulcer.clone());
      item.right_previous_amputation = Set(self.right_previous_amputation.clone());
      item.right_suspected_charcot = Set(self.right_suspected_charcot.clone());
      item.left_neuropathy_status = Set(self.left_neuropathy_status.clone());
      item.left_pulses_status = Set(self.left_pulses_status.clone());
      item.left_deformity = Set(self.left_deformity.clone());
      item.left_callus = Set(self.left_callus.clone());
      item.left_skin_breakdown = Set(self.left_skin_breakdown.clone());
      item.left_active_ulcer = Set(self.left_active_ulcer.clone());
      item.left_ulcer_severity = Set(self.left_ulcer_severity.clone());
      item.left_previous_ulcer = Set(self.left_previous_ulcer.clone());
      item.left_previous_amputation = Set(self.left_previous_amputation.clone());
      item.left_suspected_charcot = Set(self.left_suspected_charcot.clone());
      item.clinical_context = Set(self.clinical_context.clone());
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
        .prefix("api/diabetes_podiatry_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
