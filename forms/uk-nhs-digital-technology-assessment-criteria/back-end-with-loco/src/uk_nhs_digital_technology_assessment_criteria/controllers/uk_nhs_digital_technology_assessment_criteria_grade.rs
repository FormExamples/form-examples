//! Uk NHS digital technology assessment criteria grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::uk_nhs_digital_technology_assessment_criteria_grades::{
    ActiveModel, Entity, Model,
};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Uk NHS digital technology assessment criteria ID.
    pub uk_nhs_digital_technology_assessment_criteria_id: Uuid,
    /// Outcome.
    pub outcome: String,
    /// Mandatory total.
    pub mandatory_total: i32,
    /// Mandatory met.
    pub mandatory_met: i32,
    /// Advisory total.
    pub advisory_total: i32,
    /// Advisory met.
    pub advisory_met: i32,
    /// Section a result.
    pub section_a_result: String,
    /// Section b result.
    pub section_b_result: String,
    /// Section c result.
    pub section_c_result: String,
    /// Section d result.
    pub section_d_result: String,
    /// Section e result.
    pub section_e_result: String,
    /// Section f result.
    pub section_f_result: String,
    /// Section g result.
    pub section_g_result: String,
    /// Assessor override reason.
    pub assessor_override_reason: String,
    /// Final outcome.
    pub final_outcome: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    fn update(&self, item: &mut ActiveModel) {
        item.deleted_at = Set(self.deleted_at);
        item.uk_nhs_digital_technology_assessment_criteria_id =
            Set(self.uk_nhs_digital_technology_assessment_criteria_id);
        item.outcome = Set(self.outcome.clone());
        item.mandatory_total = Set(self.mandatory_total);
        item.mandatory_met = Set(self.mandatory_met);
        item.advisory_total = Set(self.advisory_total);
        item.advisory_met = Set(self.advisory_met);
        item.section_a_result = Set(self.section_a_result.clone());
        item.section_b_result = Set(self.section_b_result.clone());
        item.section_c_result = Set(self.section_c_result.clone());
        item.section_d_result = Set(self.section_d_result.clone());
        item.section_e_result = Set(self.section_e_result.clone());
        item.section_f_result = Set(self.section_f_result.clone());
        item.section_g_result = Set(self.section_g_result.clone());
        item.assessor_override_reason = Set(self.assessor_override_reason.clone());
        item.final_outcome = Set(self.final_outcome.clone());
        item.signed_at = Set(self.signed_at);
        item.graded_at = Set(self.graded_at);
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
        .prefix("api/uk_nhs_digital_technology_assessment_criteria_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
