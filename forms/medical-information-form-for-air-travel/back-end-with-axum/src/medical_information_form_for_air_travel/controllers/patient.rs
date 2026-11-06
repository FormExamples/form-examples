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
    pub name: String,
    pub birth_date: Option<Date>,
    pub sex_at_birth: String,
    pub nationality_as_iso_3166_1_alpha_2: Option<String>,
    pub passport_number: String,
    pub united_kingdom_nhs_number: Option<String>,
    pub national_health_id: String,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub postcode: String,
    pub emergency_contact_name: String,
    pub emergency_contact_relationship: String,
    pub emergency_contact_phone: String,
    pub weight_as_kg: Option<f64>,
    pub height_as_cm: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patients (deleted_at, name, birth_date, sex_at_birth, \
            nationality_as_iso_3166_1_alpha_2, passport_number, united_kingdom_nhs_number, \
            national_health_id, email, phone, postal_address_as_full_text, \
            country_as_iso_3166_1_alpha_2, postcode, emergency_contact_name, \
            emergency_contact_relationship, emergency_contact_phone, weight_as_kg, \
            height_as_cm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex_at_birth)
        .bind(&self.nationality_as_iso_3166_1_alpha_2)
        .bind(&self.passport_number)
        .bind(&self.united_kingdom_nhs_number)
        .bind(&self.national_health_id)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.emergency_contact_name)
        .bind(&self.emergency_contact_relationship)
        .bind(&self.emergency_contact_phone)
        .bind(self.weight_as_kg)
        .bind(self.height_as_cm)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patients SET deleted_at = $2, name = $3, birth_date = $4, sex_at_birth = \
            $5, nationality_as_iso_3166_1_alpha_2 = $6, passport_number = $7, \
            united_kingdom_nhs_number = $8, national_health_id = $9, email = $10, phone = \
            $11, postal_address_as_full_text = $12, country_as_iso_3166_1_alpha_2 = $13, \
            postcode = $14, emergency_contact_name = $15, emergency_contact_relationship = \
            $16, emergency_contact_phone = $17, weight_as_kg = $18, height_as_cm = $19, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex_at_birth)
        .bind(&self.nationality_as_iso_3166_1_alpha_2)
        .bind(&self.passport_number)
        .bind(&self.united_kingdom_nhs_number)
        .bind(&self.national_health_id)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.emergency_contact_name)
        .bind(&self.emergency_contact_relationship)
        .bind(&self.emergency_contact_phone)
        .bind(self.weight_as_kg)
        .bind(self.height_as_cm)
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
