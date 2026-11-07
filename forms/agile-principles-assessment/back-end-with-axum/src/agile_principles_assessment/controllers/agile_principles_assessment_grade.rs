#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_principles_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub agile_principles_assessment_id: Uuid,
    pub answered_count: i32,
    pub mean_score: Option<f64>,
    pub weighted_mean_score: Option<f64>,
    pub weights_customised: bool,
    pub maturity: String,
    pub top_action_1: String,
    pub top_action_2: String,
    pub top_action_3: String,
    pub coach_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_principles_assessment_grades \
            (agile_principles_assessment_id, answered_count, mean_score, \
            weighted_mean_score, weights_customised, maturity, top_action_1, \
            top_action_2, top_action_3, coach_notes, signed_at, graded_at) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.agile_principles_assessment_id)
        .bind(self.answered_count)
        .bind(self.mean_score)
        .bind(self.weighted_mean_score)
        .bind(self.weights_customised)
        .bind(&self.maturity)
        .bind(&self.top_action_1)
        .bind(&self.top_action_2)
        .bind(&self.top_action_3)
        .bind(&self.coach_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_principles_assessment_grades SET agile_principles_assessment_id \
            = $2, answered_count = $3, mean_score = $4, weighted_mean_score = $5, \
            weights_customised = $6, maturity = $7, top_action_1 = $8, top_action_2 = \
            $9, top_action_3 = $10, coach_notes = $11, signed_at = $12, graded_at = $13, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.agile_principles_assessment_id)
        .bind(self.answered_count)
        .bind(self.mean_score)
        .bind(self.weighted_mean_score)
        .bind(self.weights_customised)
        .bind(&self.maturity)
        .bind(&self.top_action_1)
        .bind(&self.top_action_2)
        .bind(&self.top_action_3)
        .bind(&self.coach_notes)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/agile_principles_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
