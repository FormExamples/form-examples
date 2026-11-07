#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::has_bled_score_for_major_bleeding_risk_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub has_bled_score_for_major_bleeding_risk_id: Uuid,
    pub hypertension_points: Option<i32>,
    pub renal_points: Option<i32>,
    pub liver_points: Option<i32>,
    pub stroke_points: Option<i32>,
    pub bleeding_points: Option<i32>,
    pub labile_inr_points: Option<i32>,
    pub elderly_points: Option<i32>,
    pub drugs_points: Option<i32>,
    pub alcohol_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub modifiable_factors: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO has_bled_score_for_major_bleeding_risk_grades \
            (has_bled_score_for_major_bleeding_risk_id, hypertension_points, renal_points, \
            liver_points, stroke_points, bleeding_points, labile_inr_points, elderly_points, \
            drugs_points, alcohol_points, total_score, risk_band, modifiable_factors, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) \
            RETURNING *",
        )
        .bind(self.has_bled_score_for_major_bleeding_risk_id)
        .bind(self.hypertension_points)
        .bind(self.renal_points)
        .bind(self.liver_points)
        .bind(self.stroke_points)
        .bind(self.bleeding_points)
        .bind(self.labile_inr_points)
        .bind(self.elderly_points)
        .bind(self.drugs_points)
        .bind(self.alcohol_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.modifiable_factors)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE has_bled_score_for_major_bleeding_risk_grades SET \
            has_bled_score_for_major_bleeding_risk_id = $2, hypertension_points = $3, \
            renal_points = $4, liver_points = $5, stroke_points = $6, bleeding_points = \
            $7, labile_inr_points = $8, elderly_points = $9, drugs_points = $10, \
            alcohol_points = $11, total_score = $12, risk_band = $13, modifiable_factors \
            = $14, graded_at = $15, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.has_bled_score_for_major_bleeding_risk_id)
        .bind(self.hypertension_points)
        .bind(self.renal_points)
        .bind(self.liver_points)
        .bind(self.stroke_points)
        .bind(self.bleeding_points)
        .bind(self.labile_inr_points)
        .bind(self.elderly_points)
        .bind(self.drugs_points)
        .bind(self.alcohol_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.modifiable_factors)
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
        .prefix("api/has_bled_score_for_major_bleeding_risk_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
