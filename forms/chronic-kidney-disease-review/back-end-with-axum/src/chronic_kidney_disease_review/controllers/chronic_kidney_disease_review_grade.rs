#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::chronic_kidney_disease_review_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub chronic_kidney_disease_review_id: Uuid,
    pub gfr_category: String,
    pub albuminuria_category: String,
    pub kdigo_risk_zone: String,
    pub review_status: String,
    pub blood_pressure_target_systolic: Option<i32>,
    pub blood_pressure_target_diastolic: Option<i32>,
    pub blood_pressure_at_target: Option<bool>,
    pub completeness_score: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO chronic_kidney_disease_review_grades \
            (chronic_kidney_disease_review_id, gfr_category, albuminuria_category, \
            kdigo_risk_zone, review_status, blood_pressure_target_systolic, \
            blood_pressure_target_diastolic, blood_pressure_at_target, completeness_score, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.chronic_kidney_disease_review_id)
        .bind(&self.gfr_category)
        .bind(&self.albuminuria_category)
        .bind(&self.kdigo_risk_zone)
        .bind(&self.review_status)
        .bind(self.blood_pressure_target_systolic)
        .bind(self.blood_pressure_target_diastolic)
        .bind(self.blood_pressure_at_target)
        .bind(self.completeness_score)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE chronic_kidney_disease_review_grades SET \
            chronic_kidney_disease_review_id = $2, gfr_category = $3, \
            albuminuria_category = $4, kdigo_risk_zone = $5, review_status = $6, \
            blood_pressure_target_systolic = $7, blood_pressure_target_diastolic = $8, \
            blood_pressure_at_target = $9, completeness_score = $10, graded_at = $11, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.chronic_kidney_disease_review_id)
        .bind(&self.gfr_category)
        .bind(&self.albuminuria_category)
        .bind(&self.kdigo_risk_zone)
        .bind(&self.review_status)
        .bind(self.blood_pressure_target_systolic)
        .bind(self.blood_pressure_target_diastolic)
        .bind(self.blood_pressure_at_target)
        .bind(self.completeness_score)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/chronic_kidney_disease_review_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
