#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cha2ds2_vasc_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub cha2ds2_vasc_id: Uuid,
    pub congestive_heart_failure_points: Option<i32>,
    pub hypertension_points: Option<i32>,
    pub age_points: Option<i32>,
    pub diabetes_points: Option<i32>,
    pub stroke_points: Option<i32>,
    pub vascular_disease_points: Option<i32>,
    pub sex_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub annual_stroke_risk_percent: Option<f64>,
    pub anticoagulation_recommendation: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cha2ds2_vasc_grades (cha2ds2_vasc_id, \
            congestive_heart_failure_points, hypertension_points, age_points, \
            diabetes_points, stroke_points, vascular_disease_points, sex_points, total_score, \
            risk_band, annual_stroke_risk_percent, anticoagulation_recommendation, graded_at) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.cha2ds2_vasc_id)
        .bind(self.congestive_heart_failure_points)
        .bind(self.hypertension_points)
        .bind(self.age_points)
        .bind(self.diabetes_points)
        .bind(self.stroke_points)
        .bind(self.vascular_disease_points)
        .bind(self.sex_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(self.annual_stroke_risk_percent)
        .bind(&self.anticoagulation_recommendation)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE cha2ds2_vasc_grades SET cha2ds2_vasc_id = $2, \
            congestive_heart_failure_points = $3, hypertension_points = $4, age_points = $5, \
            diabetes_points = $6, stroke_points = $7, vascular_disease_points = $8, \
            sex_points = $9, total_score = $10, risk_band = $11, annual_stroke_risk_percent = \
            $12, anticoagulation_recommendation = $13, graded_at = $14, updated_at = now() \
            WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.cha2ds2_vasc_id)
        .bind(self.congestive_heart_failure_points)
        .bind(self.hypertension_points)
        .bind(self.age_points)
        .bind(self.diabetes_points)
        .bind(self.stroke_points)
        .bind(self.vascular_disease_points)
        .bind(self.sex_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(self.annual_stroke_risk_percent)
        .bind(&self.anticoagulation_recommendation)
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
        .prefix("api/cha2ds2_vasc_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
