#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub international_nonproprietary_name: String,
    pub brand_name: String,
    pub kind: String,
    pub hold_class: String,
    pub hold_required: bool,
    pub default_hold_start_before_days: Option<i32>,
    pub default_restart_after_days: Option<i32>,
    pub perioperative_hold_guidance: String,
    pub description: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medications (deleted_at, international_nonproprietary_name, \
            brand_name, kind, hold_class, hold_required, default_hold_start_before_days, \
            default_restart_after_days, perioperative_hold_guidance, description) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.international_nonproprietary_name)
        .bind(&self.brand_name)
        .bind(&self.kind)
        .bind(&self.hold_class)
        .bind(self.hold_required)
        .bind(self.default_hold_start_before_days)
        .bind(self.default_restart_after_days)
        .bind(&self.perioperative_hold_guidance)
        .bind(&self.description)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medications SET deleted_at = $2, international_nonproprietary_name = $3, \
            brand_name = $4, kind = $5, hold_class = $6, hold_required = $7, \
            default_hold_start_before_days = $8, default_restart_after_days = $9, \
            perioperative_hold_guidance = $10, description = $11, updated_at = now() WHERE id \
            = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.international_nonproprietary_name)
        .bind(&self.brand_name)
        .bind(&self.kind)
        .bind(&self.hold_class)
        .bind(self.hold_required)
        .bind(self.default_hold_start_before_days)
        .bind(self.default_restart_after_days)
        .bind(&self.perioperative_hold_guidance)
        .bind(&self.description)
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
        .prefix("api/medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
