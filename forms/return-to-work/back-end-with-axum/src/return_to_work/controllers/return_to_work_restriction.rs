#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::return_to_work_restrictions::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub return_to_work_id: Uuid,
    pub kind: String,
    pub severity: String,
    pub quantitative_limit: String,
    pub notes: String,
    pub start_date: Option<Date>,
    pub end_date: Option<Date>,
    pub priority_rank: i32,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO return_to_work_restrictions (return_to_work_id, kind, severity, \
            quantitative_limit, notes, start_date, end_date, priority_rank) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.return_to_work_id)
        .bind(&self.kind)
        .bind(&self.severity)
        .bind(&self.quantitative_limit)
        .bind(&self.notes)
        .bind(self.start_date)
        .bind(self.end_date)
        .bind(self.priority_rank)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE return_to_work_restrictions SET return_to_work_id = $2, kind = $3, \
            severity = $4, quantitative_limit = $5, notes = $6, start_date = $7, \
            end_date = $8, priority_rank = $9, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.return_to_work_id)
        .bind(&self.kind)
        .bind(&self.severity)
        .bind(&self.quantitative_limit)
        .bind(&self.notes)
        .bind(self.start_date)
        .bind(self.end_date)
        .bind(self.priority_rank)
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
        .prefix("api/return_to_work_restrictions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
