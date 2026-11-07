#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::replacement_attorneys::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub title: String,
    pub given_names: String,
    pub family_name: String,
    pub birth_date: Option<Date>,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub country_as_iso_3166_1_alpha_2: String,
    pub postcode: String,
    pub relationship_to_donor: String,
    pub is_bankrupt: String,
    pub capacity_declared: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO replacement_attorneys (title, given_names, family_name, \
            birth_date, email, phone, postal_address_as_full_text, \
            country_as_iso_3166_1_alpha_2, postcode, relationship_to_donor, is_bankrupt, \
            capacity_declared) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12) RETURNING *",
        )
        .bind(&self.title)
        .bind(&self.given_names)
        .bind(&self.family_name)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.relationship_to_donor)
        .bind(&self.is_bankrupt)
        .bind(&self.capacity_declared)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE replacement_attorneys SET title = $2, given_names = $3, family_name = \
            $4, birth_date = $5, email = $6, phone = $7, postal_address_as_full_text = \
            $8, country_as_iso_3166_1_alpha_2 = $9, postcode = $10, \
            relationship_to_donor = $11, is_bankrupt = $12, capacity_declared = $13, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.title)
        .bind(&self.given_names)
        .bind(&self.family_name)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.relationship_to_donor)
        .bind(&self.is_bankrupt)
        .bind(&self.capacity_declared)
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
        .prefix("api/replacement_attorneys/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
