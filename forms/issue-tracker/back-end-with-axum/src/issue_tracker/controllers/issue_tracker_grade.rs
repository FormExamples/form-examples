#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::issue_tracker_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub issue_tracker_id: Uuid,
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<i32>,
    pub score_by_magnitude_of_damage: Option<i32>,
    pub score_by_harm_grade: Option<i32>,
    pub score_by_failure_condition: String,
    pub score_by_moscow_requirement: Option<i32>,
    pub score_by_frequency_percent: Option<f64>,
    pub computed_composite_priority: String,
    pub final_composite_priority: String,
    pub override_reason: String,
    pub recommendation: String,
    pub triage_notes: String,
    pub signed_by: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO issue_tracker_grades (deleted_at, issue_tracker_id, \
            score_by_priority_rank, score_by_severity_of_impact, \
            score_by_magnitude_of_damage, score_by_harm_grade, score_by_failure_condition, \
            score_by_moscow_requirement, score_by_frequency_percent, \
            computed_composite_priority, final_composite_priority, override_reason, \
            recommendation, triage_notes, signed_by, signed_at, graded_at) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.issue_tracker_id)
        .bind(self.score_by_priority_rank)
        .bind(self.score_by_severity_of_impact)
        .bind(self.score_by_magnitude_of_damage)
        .bind(self.score_by_harm_grade)
        .bind(&self.score_by_failure_condition)
        .bind(self.score_by_moscow_requirement)
        .bind(self.score_by_frequency_percent)
        .bind(&self.computed_composite_priority)
        .bind(&self.final_composite_priority)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.triage_notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE issue_tracker_grades SET deleted_at = $2, issue_tracker_id = $3, \
            score_by_priority_rank = $4, score_by_severity_of_impact = $5, \
            score_by_magnitude_of_damage = $6, score_by_harm_grade = $7, \
            score_by_failure_condition = $8, score_by_moscow_requirement = $9, \
            score_by_frequency_percent = $10, computed_composite_priority = $11, \
            final_composite_priority = $12, override_reason = $13, recommendation = $14, \
            triage_notes = $15, signed_by = $16, signed_at = $17, graded_at = $18, updated_at \
            = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.issue_tracker_id)
        .bind(self.score_by_priority_rank)
        .bind(self.score_by_severity_of_impact)
        .bind(self.score_by_magnitude_of_damage)
        .bind(self.score_by_harm_grade)
        .bind(&self.score_by_failure_condition)
        .bind(self.score_by_moscow_requirement)
        .bind(self.score_by_frequency_percent)
        .bind(&self.computed_composite_priority)
        .bind(&self.final_composite_priority)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.triage_notes)
        .bind(&self.signed_by)
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
        .prefix("api/issue_tracker_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
