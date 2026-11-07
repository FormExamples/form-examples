#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::people::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub title: String,
    pub first_names: String,
    pub last_name: String,
    pub other_names: String,
    pub date_of_birth: Option<Date>,
    pub email: String,
    pub phone: String,
    pub address_id: Option<Uuid>,
    pub is_trust_corporation: bool,
    pub trust_corporation_number: String,
    pub is_bankrupt: bool,
    pub has_debt_relief_order: bool,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO people (title, first_names, last_name, other_names, \
            date_of_birth, email, phone, address_id, is_trust_corporation, \
            trust_corporation_number, is_bankrupt, has_debt_relief_order) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(&self.title)
        .bind(&self.first_names)
        .bind(&self.last_name)
        .bind(&self.other_names)
        .bind(self.date_of_birth)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(self.address_id)
        .bind(self.is_trust_corporation)
        .bind(&self.trust_corporation_number)
        .bind(self.is_bankrupt)
        .bind(self.has_debt_relief_order)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE people SET title = $2, first_names = $3, last_name = $4, other_names \
            = $5, date_of_birth = $6, email = $7, phone = $8, address_id = $9, \
            is_trust_corporation = $10, trust_corporation_number = $11, is_bankrupt = \
            $12, has_debt_relief_order = $13, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.title)
        .bind(&self.first_names)
        .bind(&self.last_name)
        .bind(&self.other_names)
        .bind(self.date_of_birth)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(self.address_id)
        .bind(self.is_trust_corporation)
        .bind(&self.trust_corporation_number)
        .bind(self.is_bankrupt)
        .bind(self.has_debt_relief_order)
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
        .prefix("api/people/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
