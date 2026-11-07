//! Uk NHS digital technology assessment criteria grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::uk_nhs_digital_technology_assessment_criteria_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
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
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO uk_nhs_digital_technology_assessment_criteria_grades \
            (uk_nhs_digital_technology_assessment_criteria_id, outcome, mandatory_total, \
            mandatory_met, advisory_total, advisory_met, section_a_result, \
            section_b_result, section_c_result, section_d_result, section_e_result, \
            section_f_result, section_g_result, assessor_override_reason, final_outcome, \
            signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.uk_nhs_digital_technology_assessment_criteria_id)
        .bind(&self.outcome)
        .bind(self.mandatory_total)
        .bind(self.mandatory_met)
        .bind(self.advisory_total)
        .bind(self.advisory_met)
        .bind(&self.section_a_result)
        .bind(&self.section_b_result)
        .bind(&self.section_c_result)
        .bind(&self.section_d_result)
        .bind(&self.section_e_result)
        .bind(&self.section_f_result)
        .bind(&self.section_g_result)
        .bind(&self.assessor_override_reason)
        .bind(&self.final_outcome)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE uk_nhs_digital_technology_assessment_criteria_grades SET \
            uk_nhs_digital_technology_assessment_criteria_id = $2, outcome = $3, \
            mandatory_total = $4, mandatory_met = $5, advisory_total = $6, advisory_met \
            = $7, section_a_result = $8, section_b_result = $9, section_c_result = $10, \
            section_d_result = $11, section_e_result = $12, section_f_result = $13, \
            section_g_result = $14, assessor_override_reason = $15, final_outcome = $16, \
            signed_at = $17, graded_at = $18, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.uk_nhs_digital_technology_assessment_criteria_id)
        .bind(&self.outcome)
        .bind(self.mandatory_total)
        .bind(self.mandatory_met)
        .bind(self.advisory_total)
        .bind(self.advisory_met)
        .bind(&self.section_a_result)
        .bind(&self.section_b_result)
        .bind(&self.section_c_result)
        .bind(&self.section_d_result)
        .bind(&self.section_e_result)
        .bind(&self.section_f_result)
        .bind(&self.section_g_result)
        .bind(&self.assessor_override_reason)
        .bind(&self.final_outcome)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
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
