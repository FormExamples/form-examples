#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patients::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub surname: String,
    pub given_names: String,
    pub birth_date: Option<Date>,
    pub sex: String,
    pub nationality_as_iso_3166_1_alpha_3: String,
    pub travel_document_kind: String,
    pub travel_document_number: String,
    pub travel_document_issuer_as_iso_3166_1_alpha_3: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub postal_address_as_full_text: Option<String>,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub postcode: Option<String>,
    pub consented_to_data_sharing: String,
    pub signature_image_data_url: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patients (deleted_at, surname, given_names, birth_date, sex, \
            nationality_as_iso_3166_1_alpha_3, travel_document_kind, travel_document_number, \
            travel_document_issuer_as_iso_3166_1_alpha_3, email, phone, \
            postal_address_as_full_text, country_as_iso_3166_1_alpha_2, postcode, \
            consented_to_data_sharing, signature_image_data_url) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.surname)
        .bind(&self.given_names)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.nationality_as_iso_3166_1_alpha_3)
        .bind(&self.travel_document_kind)
        .bind(&self.travel_document_number)
        .bind(&self.travel_document_issuer_as_iso_3166_1_alpha_3)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.consented_to_data_sharing)
        .bind(&self.signature_image_data_url)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patients SET deleted_at = $2, surname = $3, given_names = $4, birth_date = \
            $5, sex = $6, nationality_as_iso_3166_1_alpha_3 = $7, travel_document_kind = $8, \
            travel_document_number = $9, travel_document_issuer_as_iso_3166_1_alpha_3 = $10, \
            email = $11, phone = $12, postal_address_as_full_text = $13, \
            country_as_iso_3166_1_alpha_2 = $14, postcode = $15, consented_to_data_sharing = \
            $16, signature_image_data_url = $17, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.surname)
        .bind(&self.given_names)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.nationality_as_iso_3166_1_alpha_3)
        .bind(&self.travel_document_kind)
        .bind(&self.travel_document_number)
        .bind(&self.travel_document_issuer_as_iso_3166_1_alpha_3)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.consented_to_data_sharing)
        .bind(&self.signature_image_data_url)
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
        .prefix("api/patients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
