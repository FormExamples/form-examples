#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::satisfaction_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub encounter_satisfaction_id: Uuid,
    pub composite_score: f64,
    pub category: String,
    pub answered_count: i32,
    pub scored_at: DateTimeWithTimeZone,
    #[serde(default)]
    pub domain_scores: Option<serde_json::Value>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO satisfaction_results (encounter_satisfaction_id, \
            composite_score, category, answered_count, scored_at, domain_scores) VALUES \
            ($1, $2, $3, $4, $5, COALESCE($6, '[]')) RETURNING *",
        )
        .bind(self.encounter_satisfaction_id)
        .bind(self.composite_score)
        .bind(&self.category)
        .bind(self.answered_count)
        .bind(self.scored_at)
        .bind(&self.domain_scores)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE satisfaction_results SET encounter_satisfaction_id = $2, \
            composite_score = $3, category = $4, answered_count = $5, scored_at = $6, \
            domain_scores = COALESCE($7, domain_scores), updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.encounter_satisfaction_id)
        .bind(self.composite_score)
        .bind(&self.category)
        .bind(self.answered_count)
        .bind(self.scored_at)
        .bind(&self.domain_scores)
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
        .prefix("api/satisfaction_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
