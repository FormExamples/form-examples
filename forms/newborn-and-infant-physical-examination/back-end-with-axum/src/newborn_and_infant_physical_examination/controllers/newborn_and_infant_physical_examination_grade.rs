#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::newborn_and_infant_physical_examination_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub newborn_and_infant_physical_examination_id: Uuid,
    pub eyes_result: String,
    pub heart_result: String,
    pub hips_result: String,
    pub testes_result: String,
    pub overall_outcome: String,
    pub completeness: String,
    pub completeness_percent: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO newborn_and_infant_physical_examination_grades \
            (newborn_and_infant_physical_examination_id, eyes_result, heart_result, \
            hips_result, testes_result, overall_outcome, completeness, completeness_percent, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.newborn_and_infant_physical_examination_id)
        .bind(&self.eyes_result)
        .bind(&self.heart_result)
        .bind(&self.hips_result)
        .bind(&self.testes_result)
        .bind(&self.overall_outcome)
        .bind(&self.completeness)
        .bind(self.completeness_percent)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE newborn_and_infant_physical_examination_grades SET \
            newborn_and_infant_physical_examination_id = $2, eyes_result = $3, \
            heart_result = $4, hips_result = $5, testes_result = $6, overall_outcome = \
            $7, completeness = $8, completeness_percent = $9, graded_at = $10, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.newborn_and_infant_physical_examination_id)
        .bind(&self.eyes_result)
        .bind(&self.heart_result)
        .bind(&self.hips_result)
        .bind(&self.testes_result)
        .bind(&self.overall_outcome)
        .bind(&self.completeness)
        .bind(self.completeness_percent)
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
        .prefix("api/newborn_and_infant_physical_examination_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
