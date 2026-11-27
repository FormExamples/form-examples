//! Patient module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patients::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Family name.
    pub family_name: String,
    /// Given names.
    pub given_names: String,
    /// Previous name.
    pub previous_name: String,
    /// Birth date.
    #[validate(custom(function = "plausible_date"))]
    pub birth_date: Date,
    /// Sex.
    pub sex: String,
    /// National health identifier.
    pub national_health_identifier: String,
    /// Medical record number.
    pub medical_record_number: String,
    /// Email.
    #[validate(length(max = TEXT_MAX))]
    pub email: Option<String>,
    /// Phone.
    #[validate(length(max = TEXT_MAX))]
    pub phone: Option<String>,
    /// Postal address as full text.
    #[validate(length(max = TEXT_MAX))]
    pub postal_address_as_full_text: Option<String>,
    /// Country as iso 3166 1 alpha 2.
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    /// Postcode.
    #[validate(length(max = TEXT_MAX))]
    pub postcode: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patients (family_name, given_names, previous_name, birth_date, \
            sex, national_health_identifier, medical_record_number, email, phone, \
            postal_address_as_full_text, country_as_iso_3166_1_alpha_2, postcode) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(&self.family_name)
        .bind(&self.given_names)
        .bind(&self.previous_name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.national_health_identifier)
        .bind(&self.medical_record_number)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patients SET family_name = $2, given_names = $3, previous_name = $4, \
            birth_date = $5, sex = $6, national_health_identifier = $7, \
            medical_record_number = $8, email = $9, phone = $10, \
            postal_address_as_full_text = $11, country_as_iso_3166_1_alpha_2 = $12, \
            postcode = $13, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(&self.family_name)
        .bind(&self.given_names)
        .bind(&self.previous_name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.national_health_identifier)
        .bind(&self.medical_record_number)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/medical-human-leukocyte-and-disease-association-request/patients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
