//! Supplier module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::suppliers::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Name.
    pub name: String,
    /// Trading name.
    pub trading_name: String,
    /// Company registration number.
    pub company_registration_number: String,
    /// Country of registration as iso 3166 1 alpha 2.
    pub country_of_registration_as_iso_3166_1_alpha_2: Option<String>,
    /// Ico registration number.
    pub ico_registration_number: String,
    /// Website.
    pub website: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: Option<String>,
    /// Postcode.
    pub postcode: Option<String>,
    /// Contact name.
    pub contact_name: String,
    /// Contact email.
    pub contact_email: Option<String>,
    /// Contact phone.
    pub contact_phone: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO suppliers (name, trading_name, company_registration_number, \
            country_of_registration_as_iso_3166_1_alpha_2, ico_registration_number, \
            website, postal_address_as_full_text, postcode, contact_name, contact_email, \
            contact_phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
            RETURNING *",
        )
        .bind(&self.name)
        .bind(&self.trading_name)
        .bind(&self.company_registration_number)
        .bind(&self.country_of_registration_as_iso_3166_1_alpha_2)
        .bind(&self.ico_registration_number)
        .bind(&self.website)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.postcode)
        .bind(&self.contact_name)
        .bind(&self.contact_email)
        .bind(&self.contact_phone)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE suppliers SET name = $2, trading_name = $3, \
            company_registration_number = $4, \
            country_of_registration_as_iso_3166_1_alpha_2 = $5, ico_registration_number \
            = $6, website = $7, postal_address_as_full_text = $8, postcode = $9, \
            contact_name = $10, contact_email = $11, contact_phone = $12, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.name)
        .bind(&self.trading_name)
        .bind(&self.company_registration_number)
        .bind(&self.country_of_registration_as_iso_3166_1_alpha_2)
        .bind(&self.ico_registration_number)
        .bind(&self.website)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.postcode)
        .bind(&self.contact_name)
        .bind(&self.contact_email)
        .bind(&self.contact_phone)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/suppliers/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
