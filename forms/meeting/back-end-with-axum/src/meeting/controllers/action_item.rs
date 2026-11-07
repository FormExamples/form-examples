#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::action_items::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub meeting_id: Uuid,
    pub position: i32,
    pub title: String,
    pub description: String,
    pub owner_name: String,
    pub owner_email: String,
    pub due_date: Option<Date>,
    pub priority: String,
    pub status: String,
    pub completed_at: Option<DateTimeWithTimeZone>,
    pub external_reference: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO action_items (meeting_id, position, title, description, \
            owner_name, owner_email, due_date, priority, status, completed_at, \
            external_reference) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
            RETURNING *",
        )
        .bind(self.meeting_id)
        .bind(self.position)
        .bind(&self.title)
        .bind(&self.description)
        .bind(&self.owner_name)
        .bind(&self.owner_email)
        .bind(self.due_date)
        .bind(&self.priority)
        .bind(&self.status)
        .bind(self.completed_at)
        .bind(&self.external_reference)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE action_items SET meeting_id = $2, position = $3, title = $4, \
            description = $5, owner_name = $6, owner_email = $7, due_date = $8, priority \
            = $9, status = $10, completed_at = $11, external_reference = $12, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.meeting_id)
        .bind(self.position)
        .bind(&self.title)
        .bind(&self.description)
        .bind(&self.owner_name)
        .bind(&self.owner_email)
        .bind(self.due_date)
        .bind(&self.priority)
        .bind(&self.status)
        .bind(self.completed_at)
        .bind(&self.external_reference)
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
        .prefix("api/action_items/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
