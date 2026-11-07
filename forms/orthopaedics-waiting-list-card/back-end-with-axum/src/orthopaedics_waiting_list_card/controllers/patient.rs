#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patients::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub name: String,
    pub birth_date: Date,
    pub sex: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub postal_address_as_full_text: Option<String>,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub postcode: Option<String>,
    pub united_kingdom_nhs_number: Option<String>,
    pub preferred_language_as_iso_639_1: String,
    pub interpreter_required: String,
    pub accessibility_needs: String,
    pub preferred_contact_channel: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patients (name, birth_date, sex, email, phone, \
            postal_address_as_full_text, country_as_iso_3166_1_alpha_2, postcode, \
            united_kingdom_nhs_number, preferred_language_as_iso_639_1, \
            interpreter_required, accessibility_needs, preferred_contact_channel) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.united_kingdom_nhs_number)
        .bind(&self.preferred_language_as_iso_639_1)
        .bind(&self.interpreter_required)
        .bind(&self.accessibility_needs)
        .bind(&self.preferred_contact_channel)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patients SET name = $2, birth_date = $3, sex = $4, email = $5, phone \
            = $6, postal_address_as_full_text = $7, country_as_iso_3166_1_alpha_2 = $8, \
            postcode = $9, united_kingdom_nhs_number = $10, \
            preferred_language_as_iso_639_1 = $11, interpreter_required = $12, \
            accessibility_needs = $13, preferred_contact_channel = $14, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.united_kingdom_nhs_number)
        .bind(&self.preferred_language_as_iso_639_1)
        .bind(&self.interpreter_required)
        .bind(&self.accessibility_needs)
        .bind(&self.preferred_contact_channel)
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
        .prefix("api/patients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
