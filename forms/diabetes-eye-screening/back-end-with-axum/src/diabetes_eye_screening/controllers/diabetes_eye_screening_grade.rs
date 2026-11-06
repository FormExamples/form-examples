#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::diabetes_eye_screening_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub diabetes_eye_screening_id: Uuid,
    pub worst_retinopathy: String,
    pub worst_maculopathy: String,
    pub any_ungradable: String,
    pub outcome: String,
    pub referral: String,
    pub recall_interval_months: Option<i32>,
    pub status: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO diabetes_eye_screening_grades (diabetes_eye_screening_id, \
            worst_retinopathy, worst_maculopathy, any_ungradable, outcome, referral, \
            recall_interval_months, status, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9) RETURNING *",
        )
        .bind(self.diabetes_eye_screening_id)
        .bind(&self.worst_retinopathy)
        .bind(&self.worst_maculopathy)
        .bind(&self.any_ungradable)
        .bind(&self.outcome)
        .bind(&self.referral)
        .bind(self.recall_interval_months)
        .bind(&self.status)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE diabetes_eye_screening_grades SET diabetes_eye_screening_id = $2, \
            worst_retinopathy = $3, worst_maculopathy = $4, any_ungradable = $5, outcome = \
            $6, referral = $7, recall_interval_months = $8, status = $9, graded_at = $10, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.diabetes_eye_screening_id)
        .bind(&self.worst_retinopathy)
        .bind(&self.worst_maculopathy)
        .bind(&self.any_ungradable)
        .bind(&self.outcome)
        .bind(&self.referral)
        .bind(self.recall_interval_months)
        .bind(&self.status)
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
        .prefix("api/diabetes_eye_screening_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
