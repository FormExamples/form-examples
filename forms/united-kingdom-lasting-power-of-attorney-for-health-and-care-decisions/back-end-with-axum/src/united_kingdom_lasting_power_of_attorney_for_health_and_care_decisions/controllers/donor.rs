#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::donors::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub title: String,
    pub given_names: String,
    pub family_name: String,
    pub other_names_used: String,
    pub birth_date: Option<Date>,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub country_as_iso_3166_1_alpha_2: String,
    pub postcode: String,
    pub united_kingdom_nhs_number: Option<String>,
    pub jurisdiction: String,
    pub preferred_language: String,
    pub capacity_declared: String,
    pub capacity_declared_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO donors (deleted_at, title, given_names, family_name, \
            other_names_used, birth_date, email, phone, postal_address_as_full_text, \
            country_as_iso_3166_1_alpha_2, postcode, united_kingdom_nhs_number, jurisdiction, \
            preferred_language, capacity_declared, capacity_declared_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.title)
        .bind(&self.given_names)
        .bind(&self.family_name)
        .bind(&self.other_names_used)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.united_kingdom_nhs_number)
        .bind(&self.jurisdiction)
        .bind(&self.preferred_language)
        .bind(&self.capacity_declared)
        .bind(self.capacity_declared_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE donors SET deleted_at = $2, title = $3, given_names = $4, family_name = \
            $5, other_names_used = $6, birth_date = $7, email = $8, phone = $9, \
            postal_address_as_full_text = $10, country_as_iso_3166_1_alpha_2 = $11, postcode \
            = $12, united_kingdom_nhs_number = $13, jurisdiction = $14, preferred_language = \
            $15, capacity_declared = $16, capacity_declared_at = $17, updated_at = now() \
            WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.title)
        .bind(&self.given_names)
        .bind(&self.family_name)
        .bind(&self.other_names_used)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.united_kingdom_nhs_number)
        .bind(&self.jurisdiction)
        .bind(&self.preferred_language)
        .bind(&self.capacity_declared)
        .bind(self.capacity_declared_at)
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
        .prefix("api/donors/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
