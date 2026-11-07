#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hypertension_review_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub control_status: String,
    pub hypertension_stage: String,
    pub review_status: String,
    pub primary_source: String,
    pub target_group: String,
    pub clinic_target_systolic: Option<i32>,
    pub clinic_target_diastolic: Option<i32>,
    pub home_target_systolic: Option<i32>,
    pub home_target_diastolic: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
    pub hypertension_review_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hypertension_review_grades (control_status, hypertension_stage, \
            review_status, primary_source, target_group, clinic_target_systolic, \
            clinic_target_diastolic, home_target_systolic, home_target_diastolic, graded_at, \
            hypertension_review_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
            RETURNING *",
        )
        .bind(&self.control_status)
        .bind(&self.hypertension_stage)
        .bind(&self.review_status)
        .bind(&self.primary_source)
        .bind(&self.target_group)
        .bind(self.clinic_target_systolic)
        .bind(self.clinic_target_diastolic)
        .bind(self.home_target_systolic)
        .bind(self.home_target_diastolic)
        .bind(self.graded_at)
        .bind(self.hypertension_review_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hypertension_review_grades SET control_status = $2, \
            hypertension_stage = $3, review_status = $4, primary_source = $5, \
            target_group = $6, clinic_target_systolic = $7, clinic_target_diastolic = \
            $8, home_target_systolic = $9, home_target_diastolic = $10, graded_at = $11, \
            hypertension_review_id = $12, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.control_status)
        .bind(&self.hypertension_stage)
        .bind(&self.review_status)
        .bind(&self.primary_source)
        .bind(&self.target_group)
        .bind(self.clinic_target_systolic)
        .bind(self.clinic_target_diastolic)
        .bind(self.home_target_systolic)
        .bind(self.home_target_diastolic)
        .bind(self.graded_at)
        .bind(self.hypertension_review_id)
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
        .prefix("api/hypertension_review_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
