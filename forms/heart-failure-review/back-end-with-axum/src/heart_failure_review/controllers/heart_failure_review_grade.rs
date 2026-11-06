#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::heart_failure_review_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub heart_failure_review_id: Uuid,
    pub nyha_status: String,
    pub medication_optimisation_status: String,
    pub review_status: String,
    pub indicated_pillars: Option<i32>,
    pub prescribed_pillars: Option<i32>,
    pub missing_pillars: String,
    pub completeness_score: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO heart_failure_review_grades (heart_failure_review_id, nyha_status, \
            medication_optimisation_status, review_status, indicated_pillars, \
            prescribed_pillars, missing_pillars, completeness_score, graded_at) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.heart_failure_review_id)
        .bind(&self.nyha_status)
        .bind(&self.medication_optimisation_status)
        .bind(&self.review_status)
        .bind(self.indicated_pillars)
        .bind(self.prescribed_pillars)
        .bind(&self.missing_pillars)
        .bind(self.completeness_score)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE heart_failure_review_grades SET heart_failure_review_id = $2, nyha_status \
            = $3, medication_optimisation_status = $4, review_status = $5, indicated_pillars \
            = $6, prescribed_pillars = $7, missing_pillars = $8, completeness_score = $9, \
            graded_at = $10, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.heart_failure_review_id)
        .bind(&self.nyha_status)
        .bind(&self.medication_optimisation_status)
        .bind(&self.review_status)
        .bind(self.indicated_pillars)
        .bind(self.prescribed_pillars)
        .bind(&self.missing_pillars)
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
        .prefix("api/heart_failure_review_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
