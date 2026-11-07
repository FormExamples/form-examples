#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::resources::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub meeting_id: Uuid,
    pub position: i32,
    pub resource_type: String,
    pub name: String,
    pub quantity: Option<i32>,
    pub unit: String,
    pub url: String,
    pub cost_amount: Option<f64>,
    pub cost_currency: String,
    pub status: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO resources (meeting_id, position, resource_type, name, quantity, \
            unit, url, cost_amount, cost_currency, status, notes) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.meeting_id)
        .bind(self.position)
        .bind(&self.resource_type)
        .bind(&self.name)
        .bind(self.quantity)
        .bind(&self.unit)
        .bind(&self.url)
        .bind(self.cost_amount)
        .bind(&self.cost_currency)
        .bind(&self.status)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE resources SET meeting_id = $2, position = $3, resource_type = $4, \
            name = $5, quantity = $6, unit = $7, url = $8, cost_amount = $9, \
            cost_currency = $10, status = $11, notes = $12, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.meeting_id)
        .bind(self.position)
        .bind(&self.resource_type)
        .bind(&self.name)
        .bind(self.quantity)
        .bind(&self.unit)
        .bind(&self.url)
        .bind(self.cost_amount)
        .bind(&self.cost_currency)
        .bind(&self.status)
        .bind(&self.notes)
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
        .prefix("api/resources/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
