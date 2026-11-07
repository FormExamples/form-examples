#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::curb_65_pneumonia_severity_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub curb_65_pneumonia_severity_score_id: Uuid,
    pub confusion_score: Option<i32>,
    pub urea_score: Option<i32>,
    pub respiratory_rate_score: Option<i32>,
    pub blood_pressure_score: Option<i32>,
    pub age_score: Option<i32>,
    pub total_score: Option<i32>,
    pub score_variant: String,
    pub risk_band: String,
    pub recommended_setting: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO curb_65_pneumonia_severity_score_grades \
            (curb_65_pneumonia_severity_score_id, confusion_score, urea_score, \
            respiratory_rate_score, blood_pressure_score, age_score, total_score, \
            score_variant, risk_band, recommended_setting, graded_at) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.curb_65_pneumonia_severity_score_id)
        .bind(self.confusion_score)
        .bind(self.urea_score)
        .bind(self.respiratory_rate_score)
        .bind(self.blood_pressure_score)
        .bind(self.age_score)
        .bind(self.total_score)
        .bind(&self.score_variant)
        .bind(&self.risk_band)
        .bind(&self.recommended_setting)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE curb_65_pneumonia_severity_score_grades SET \
            curb_65_pneumonia_severity_score_id = $2, confusion_score = $3, urea_score = \
            $4, respiratory_rate_score = $5, blood_pressure_score = $6, age_score = $7, \
            total_score = $8, score_variant = $9, risk_band = $10, recommended_setting = \
            $11, graded_at = $12, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.curb_65_pneumonia_severity_score_id)
        .bind(self.confusion_score)
        .bind(self.urea_score)
        .bind(self.respiratory_rate_score)
        .bind(self.blood_pressure_score)
        .bind(self.age_score)
        .bind(self.total_score)
        .bind(&self.score_variant)
        .bind(&self.risk_band)
        .bind(&self.recommended_setting)
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
        .prefix("api/curb_65_pneumonia_severity_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
