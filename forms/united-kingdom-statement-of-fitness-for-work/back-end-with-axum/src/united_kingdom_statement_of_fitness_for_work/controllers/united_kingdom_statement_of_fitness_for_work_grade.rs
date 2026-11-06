#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_statement_of_fitness_for_work_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub united_kingdom_statement_of_fitness_for_work_id: Uuid,
    pub fitness_category: String,
    pub adaptation_intensity: String,
    pub adaptation_count: i32,
    pub period_days: Option<i32>,
    pub period_compliance: String,
    pub recommendation: String,
    pub is_within_first_six_months_of_condition: String,
    pub is_valid: String,
    pub grader_notes: String,
    pub graded_at: DateTimeWithTimeZone,
    pub clinician_override: String,
    pub clinician_override_reason: String,
    pub clinician_final_recommendation: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_statement_of_fitness_for_work_grades (deleted_at, \
            united_kingdom_statement_of_fitness_for_work_id, fitness_category, \
            adaptation_intensity, adaptation_count, period_days, period_compliance, \
            recommendation, is_within_first_six_months_of_condition, is_valid, grader_notes, \
            graded_at, clinician_override, clinician_override_reason, \
            clinician_final_recommendation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.united_kingdom_statement_of_fitness_for_work_id)
        .bind(&self.fitness_category)
        .bind(&self.adaptation_intensity)
        .bind(self.adaptation_count)
        .bind(self.period_days)
        .bind(&self.period_compliance)
        .bind(&self.recommendation)
        .bind(&self.is_within_first_six_months_of_condition)
        .bind(&self.is_valid)
        .bind(&self.grader_notes)
        .bind(self.graded_at)
        .bind(&self.clinician_override)
        .bind(&self.clinician_override_reason)
        .bind(&self.clinician_final_recommendation)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_statement_of_fitness_for_work_grades SET deleted_at = $2, \
            united_kingdom_statement_of_fitness_for_work_id = $3, fitness_category = $4, \
            adaptation_intensity = $5, adaptation_count = $6, period_days = $7, \
            period_compliance = $8, recommendation = $9, \
            is_within_first_six_months_of_condition = $10, is_valid = $11, grader_notes = \
            $12, graded_at = $13, clinician_override = $14, clinician_override_reason = $15, \
            clinician_final_recommendation = $16, updated_at = now() WHERE id = $1 RETURNING \
            *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.united_kingdom_statement_of_fitness_for_work_id)
        .bind(&self.fitness_category)
        .bind(&self.adaptation_intensity)
        .bind(self.adaptation_count)
        .bind(self.period_days)
        .bind(&self.period_compliance)
        .bind(&self.recommendation)
        .bind(&self.is_within_first_six_months_of_condition)
        .bind(&self.is_valid)
        .bind(&self.grader_notes)
        .bind(self.graded_at)
        .bind(&self.clinician_override)
        .bind(&self.clinician_override_reason)
        .bind(&self.clinician_final_recommendation)
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
        .prefix("api/united_kingdom_statement_of_fitness_for_work_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
