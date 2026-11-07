#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::apgar_score_timepoints::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub apgar_score_id: Uuid,
    pub timepoint_minutes: Option<i32>,
    pub appearance: String,
    pub pulse: String,
    pub grimace: String,
    pub activity: String,
    pub respiration: String,
    pub total: Option<i32>,
    pub band: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO apgar_score_timepoints (apgar_score_id, timepoint_minutes, \
            appearance, pulse, grimace, activity, respiration, total, band) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.apgar_score_id)
        .bind(self.timepoint_minutes)
        .bind(&self.appearance)
        .bind(&self.pulse)
        .bind(&self.grimace)
        .bind(&self.activity)
        .bind(&self.respiration)
        .bind(self.total)
        .bind(&self.band)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE apgar_score_timepoints SET apgar_score_id = $2, timepoint_minutes = \
            $3, appearance = $4, pulse = $5, grimace = $6, activity = $7, respiration = \
            $8, total = $9, band = $10, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.apgar_score_id)
        .bind(self.timepoint_minutes)
        .bind(&self.appearance)
        .bind(&self.pulse)
        .bind(&self.grimace)
        .bind(&self.activity)
        .bind(&self.respiration)
        .bind(self.total)
        .bind(&self.band)
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
        .prefix("api/apgar_score_timepoints/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
