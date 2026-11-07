//! Grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Risk level.
    pub risk_level: String,
    /// Total risk score.
    pub total_risk_score: i32,
    /// Cancer genetics score.
    pub cancer_genetics_score: i32,
    /// Cardiovascular genetics score.
    pub cardiovascular_genetics_score: i32,
    /// Neurogenetics score.
    pub neurogenetics_score: i32,
    /// Reproductive genetics score.
    pub reproductive_genetics_score: i32,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, risk_level, total_risk_score, \
            cancer_genetics_score, cardiovascular_genetics_score, neurogenetics_score, \
            reproductive_genetics_score, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.risk_level)
        .bind(self.total_risk_score)
        .bind(self.cancer_genetics_score)
        .bind(self.cardiovascular_genetics_score)
        .bind(self.neurogenetics_score)
        .bind(self.reproductive_genetics_score)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, risk_level = $3, total_risk_score = \
            $4, cancer_genetics_score = $5, cardiovascular_genetics_score = $6, \
            neurogenetics_score = $7, reproductive_genetics_score = $8, graded_at = $9, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.risk_level)
        .bind(self.total_risk_score)
        .bind(self.cancer_genetics_score)
        .bind(self.cardiovascular_genetics_score)
        .bind(self.neurogenetics_score)
        .bind(self.reproductive_genetics_score)
        .bind(self.graded_at)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
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
