#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub total_symptom_score: i32,
    pub dermatological_score: i32,
    pub gastrointestinal_score: i32,
    pub cardiovascular_score: i32,
    pub respiratory_score: i32,
    pub neurological_score: i32,
    pub organ_system_count: i32,
    pub severity_level: String,
    pub trigger_count: i32,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, total_symptom_score, \
            dermatological_score, gastrointestinal_score, cardiovascular_score, \
            respiratory_score, neurological_score, organ_system_count, severity_level, \
            trigger_count, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.total_symptom_score)
        .bind(self.dermatological_score)
        .bind(self.gastrointestinal_score)
        .bind(self.cardiovascular_score)
        .bind(self.respiratory_score)
        .bind(self.neurological_score)
        .bind(self.organ_system_count)
        .bind(&self.severity_level)
        .bind(self.trigger_count)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, total_symptom_score = $3, \
            dermatological_score = $4, gastrointestinal_score = $5, cardiovascular_score \
            = $6, respiratory_score = $7, neurological_score = $8, organ_system_count = \
            $9, severity_level = $10, trigger_count = $11, graded_at = $12, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.total_symptom_score)
        .bind(self.dermatological_score)
        .bind(self.gastrointestinal_score)
        .bind(self.cardiovascular_score)
        .bind(self.respiratory_score)
        .bind(self.neurological_score)
        .bind(self.organ_system_count)
        .bind(&self.severity_level)
        .bind(self.trigger_count)
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
