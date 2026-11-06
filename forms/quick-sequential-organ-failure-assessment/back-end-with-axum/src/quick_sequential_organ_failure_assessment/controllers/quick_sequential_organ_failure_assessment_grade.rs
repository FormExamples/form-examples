#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::quick_sequential_organ_failure_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub quick_sequential_organ_failure_assessment_id: Uuid,
    pub respiratory_rate_point: Option<i32>,
    pub mentation_point: Option<i32>,
    pub systolic_blood_pressure_point: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub threshold_met: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO quick_sequential_organ_failure_assessment_grades \
            (quick_sequential_organ_failure_assessment_id, respiratory_rate_point, \
            mentation_point, systolic_blood_pressure_point, total_score, risk_band, \
            threshold_met, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.quick_sequential_organ_failure_assessment_id)
        .bind(self.respiratory_rate_point)
        .bind(self.mentation_point)
        .bind(self.systolic_blood_pressure_point)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.threshold_met)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE quick_sequential_organ_failure_assessment_grades SET \
            quick_sequential_organ_failure_assessment_id = $2, respiratory_rate_point = $3, \
            mentation_point = $4, systolic_blood_pressure_point = $5, total_score = $6, \
            risk_band = $7, threshold_met = $8, graded_at = $9, updated_at = now() WHERE id = \
            $1 RETURNING *",
        )
        .bind(id)
        .bind(self.quick_sequential_organ_failure_assessment_id)
        .bind(self.respiratory_rate_point)
        .bind(self.mentation_point)
        .bind(self.systolic_blood_pressure_point)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.threshold_met)
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
        .prefix("api/quick_sequential_organ_failure_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
