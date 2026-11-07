#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::glasgow_coma_scale_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub glasgow_coma_scale_id: Uuid,
    pub eye_score: Option<i32>,
    pub verbal_score: Option<i32>,
    pub motor_score: Option<i32>,
    pub total_score: Option<i32>,
    pub breakdown: String,
    pub total_display: String,
    pub severity_band: String,
    pub pupil_reactivity_score: Option<i32>,
    pub gcs_p: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO glasgow_coma_scale_grades (glasgow_coma_scale_id, eye_score, \
            verbal_score, motor_score, total_score, breakdown, total_display, severity_band, \
            pupil_reactivity_score, gcs_p, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11) RETURNING *",
        )
        .bind(self.glasgow_coma_scale_id)
        .bind(self.eye_score)
        .bind(self.verbal_score)
        .bind(self.motor_score)
        .bind(self.total_score)
        .bind(&self.breakdown)
        .bind(&self.total_display)
        .bind(&self.severity_band)
        .bind(self.pupil_reactivity_score)
        .bind(self.gcs_p)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE glasgow_coma_scale_grades SET glasgow_coma_scale_id = $2, eye_score = \
            $3, verbal_score = $4, motor_score = $5, total_score = $6, breakdown = $7, \
            total_display = $8, severity_band = $9, pupil_reactivity_score = $10, gcs_p \
            = $11, graded_at = $12, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.glasgow_coma_scale_id)
        .bind(self.eye_score)
        .bind(self.verbal_score)
        .bind(self.motor_score)
        .bind(self.total_score)
        .bind(&self.breakdown)
        .bind(&self.total_display)
        .bind(&self.severity_band)
        .bind(self.pupil_reactivity_score)
        .bind(self.gcs_p)
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
        .prefix("api/glasgow_coma_scale_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
