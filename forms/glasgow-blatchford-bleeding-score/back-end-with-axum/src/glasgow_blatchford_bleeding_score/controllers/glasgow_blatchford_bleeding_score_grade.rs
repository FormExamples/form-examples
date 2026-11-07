#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::glasgow_blatchford_bleeding_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub glasgow_blatchford_bleeding_score_id: Uuid,
    pub blood_urea_points: Option<i32>,
    pub haemoglobin_points: Option<i32>,
    pub systolic_blood_pressure_points: Option<i32>,
    pub pulse_point: Option<i32>,
    pub melaena_point: Option<i32>,
    pub syncope_point: Option<i32>,
    pub hepatic_disease_point: Option<i32>,
    pub cardiac_failure_point: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub recommended_management: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO glasgow_blatchford_bleeding_score_grades \
            (glasgow_blatchford_bleeding_score_id, blood_urea_points, \
            haemoglobin_points, systolic_blood_pressure_points, pulse_point, \
            melaena_point, syncope_point, hepatic_disease_point, cardiac_failure_point, \
            total_score, risk_band, recommended_management, graded_at) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.glasgow_blatchford_bleeding_score_id)
        .bind(self.blood_urea_points)
        .bind(self.haemoglobin_points)
        .bind(self.systolic_blood_pressure_points)
        .bind(self.pulse_point)
        .bind(self.melaena_point)
        .bind(self.syncope_point)
        .bind(self.hepatic_disease_point)
        .bind(self.cardiac_failure_point)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.recommended_management)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE glasgow_blatchford_bleeding_score_grades SET \
            glasgow_blatchford_bleeding_score_id = $2, blood_urea_points = $3, \
            haemoglobin_points = $4, systolic_blood_pressure_points = $5, pulse_point = \
            $6, melaena_point = $7, syncope_point = $8, hepatic_disease_point = $9, \
            cardiac_failure_point = $10, total_score = $11, risk_band = $12, \
            recommended_management = $13, graded_at = $14, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.glasgow_blatchford_bleeding_score_id)
        .bind(self.blood_urea_points)
        .bind(self.haemoglobin_points)
        .bind(self.systolic_blood_pressure_points)
        .bind(self.pulse_point)
        .bind(self.melaena_point)
        .bind(self.syncope_point)
        .bind(self.hepatic_disease_point)
        .bind(self.cardiac_failure_point)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.recommended_management)
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
        .prefix("api/glasgow_blatchford_bleeding_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
