//! Medical fit note module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::medical_fit_notes::{ActiveModel, Entity, Model};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Employee ID.
    pub employee_id: Uuid,
    /// Clinician ID.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// Assessment method.
    pub assessment_method: String,
    /// Diagnosis primary.
    pub diagnosis_primary: String,
    /// Diagnosis additional.
    pub diagnosis_additional: String,
    /// Fitness advice.
    pub fitness_advice: String,
    /// Period from.
    pub period_from: Option<Date>,
    /// Period to.
    pub period_to: Option<Date>,
    /// Period duration days.
    pub period_duration_days: Option<i32>,
    /// Reassessment required.
    pub reassessment_required: String,
    /// Adjustment phased return.
    pub adjustment_phased_return: String,
    /// Adjustment altered hours.
    pub adjustment_altered_hours: String,
    /// Adjustment amended duties.
    pub adjustment_amended_duties: String,
    /// Adjustment workplace adaptations.
    pub adjustment_workplace_adaptations: String,
    /// Functional effects.
    pub functional_effects: String,
    /// Comments.
    pub comments: String,
    /// Employee consent to share.
    pub employee_consent_to_share: String,
    /// Clinician declaration.
    pub clinician_declaration: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.employee_id = Set(self.employee_id);
      item.clinician_id = Set(self.clinician_id);
      item.status = Set(self.status.clone());
      item.assessment_date = Set(self.assessment_date);
      item.assessment_method = Set(self.assessment_method.clone());
      item.diagnosis_primary = Set(self.diagnosis_primary.clone());
      item.diagnosis_additional = Set(self.diagnosis_additional.clone());
      item.fitness_advice = Set(self.fitness_advice.clone());
      item.period_from = Set(self.period_from);
      item.period_to = Set(self.period_to);
      item.period_duration_days = Set(self.period_duration_days);
      item.reassessment_required = Set(self.reassessment_required.clone());
      item.adjustment_phased_return = Set(self.adjustment_phased_return.clone());
      item.adjustment_altered_hours = Set(self.adjustment_altered_hours.clone());
      item.adjustment_amended_duties = Set(self.adjustment_amended_duties.clone());
      item.adjustment_workplace_adaptations = Set(self.adjustment_workplace_adaptations.clone());
      item.functional_effects = Set(self.functional_effects.clone());
      item.comments = Set(self.comments.clone());
      item.employee_consent_to_share = Set(self.employee_consent_to_share.clone());
      item.clinician_declaration = Set(self.clinician_declaration.clone());
      item.signed_at = Set(self.signed_at);
      }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_fit_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
