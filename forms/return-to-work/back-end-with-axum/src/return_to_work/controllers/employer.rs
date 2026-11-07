#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::employers::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub name: String,
    pub industry_sector: String,
    pub postal_address_as_full_text: Option<String>,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub postcode: Option<String>,
    pub occupational_health_contact_name: String,
    pub occupational_health_contact_email: String,
    pub occupational_health_contact_phone: String,
    pub hr_contact_name: String,
    pub hr_contact_email: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO employers (name, industry_sector, postal_address_as_full_text, \
            country_as_iso_3166_1_alpha_2, postcode, occupational_health_contact_name, \
            occupational_health_contact_email, occupational_health_contact_phone, \
            hr_contact_name, hr_contact_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10) RETURNING *",
        )
        .bind(&self.name)
        .bind(&self.industry_sector)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.occupational_health_contact_name)
        .bind(&self.occupational_health_contact_email)
        .bind(&self.occupational_health_contact_phone)
        .bind(&self.hr_contact_name)
        .bind(&self.hr_contact_email)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE employers SET name = $2, industry_sector = $3, \
            postal_address_as_full_text = $4, country_as_iso_3166_1_alpha_2 = $5, \
            postcode = $6, occupational_health_contact_name = $7, \
            occupational_health_contact_email = $8, occupational_health_contact_phone = \
            $9, hr_contact_name = $10, hr_contact_email = $11, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.name)
        .bind(&self.industry_sector)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.occupational_health_contact_name)
        .bind(&self.occupational_health_contact_email)
        .bind(&self.occupational_health_contact_phone)
        .bind(&self.hr_contact_name)
        .bind(&self.hr_contact_email)
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
        .prefix("api/employers/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
