#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::centers::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub name: String,
    pub who_designation_reference: String,
    pub national_authority_reference: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub postal_address_as_full_text: Option<String>,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub country_as_iso_3166_1_alpha_3: Option<String>,
    pub postcode: Option<String>,
    pub uniform_stamp_image_data_url: String,
    pub authorised_diseases: String,
    pub designation_valid_from: Option<Date>,
    pub designation_valid_until: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO centers (deleted_at, name, who_designation_reference, \
            national_authority_reference, email, phone, postal_address_as_full_text, \
            country_as_iso_3166_1_alpha_2, country_as_iso_3166_1_alpha_3, postcode, \
            uniform_stamp_image_data_url, authorised_diseases, designation_valid_from, \
            designation_valid_until) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(&self.who_designation_reference)
        .bind(&self.national_authority_reference)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.country_as_iso_3166_1_alpha_3)
        .bind(&self.postcode)
        .bind(&self.uniform_stamp_image_data_url)
        .bind(&self.authorised_diseases)
        .bind(self.designation_valid_from)
        .bind(self.designation_valid_until)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE centers SET deleted_at = $2, name = $3, who_designation_reference = $4, \
            national_authority_reference = $5, email = $6, phone = $7, \
            postal_address_as_full_text = $8, country_as_iso_3166_1_alpha_2 = $9, \
            country_as_iso_3166_1_alpha_3 = $10, postcode = $11, uniform_stamp_image_data_url \
            = $12, authorised_diseases = $13, designation_valid_from = $14, \
            designation_valid_until = $15, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(&self.who_designation_reference)
        .bind(&self.national_authority_reference)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.country_as_iso_3166_1_alpha_3)
        .bind(&self.postcode)
        .bind(&self.uniform_stamp_image_data_url)
        .bind(&self.authorised_diseases)
        .bind(self.designation_valid_from)
        .bind(self.designation_valid_until)
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
        .prefix("api/centers/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
