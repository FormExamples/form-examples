#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::certificate_providers::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub title: String,
    pub given_names: String,
    pub family_name: String,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub country_as_iso_3166_1_alpha_2: String,
    pub postcode: String,
    pub route: String,
    pub profession: String,
    pub profession_registration_number: String,
    pub years_known_donor: Option<f64>,
    pub relationship_to_donor: String,
    pub declared_not_family: String,
    pub declared_not_employee: String,
    pub declared_not_attorney: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO certificate_providers (title, given_names, family_name, email, \
            phone, postal_address_as_full_text, country_as_iso_3166_1_alpha_2, postcode, \
            route, profession, profession_registration_number, years_known_donor, \
            relationship_to_donor, declared_not_family, declared_not_employee, \
            declared_not_attorney) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(&self.title)
        .bind(&self.given_names)
        .bind(&self.family_name)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.route)
        .bind(&self.profession)
        .bind(&self.profession_registration_number)
        .bind(self.years_known_donor)
        .bind(&self.relationship_to_donor)
        .bind(&self.declared_not_family)
        .bind(&self.declared_not_employee)
        .bind(&self.declared_not_attorney)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE certificate_providers SET title = $2, given_names = $3, family_name = \
            $4, email = $5, phone = $6, postal_address_as_full_text = $7, \
            country_as_iso_3166_1_alpha_2 = $8, postcode = $9, route = $10, profession = \
            $11, profession_registration_number = $12, years_known_donor = $13, \
            relationship_to_donor = $14, declared_not_family = $15, \
            declared_not_employee = $16, declared_not_attorney = $17, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.title)
        .bind(&self.given_names)
        .bind(&self.family_name)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .bind(&self.postcode)
        .bind(&self.route)
        .bind(&self.profession)
        .bind(&self.profession_registration_number)
        .bind(self.years_known_donor)
        .bind(&self.relationship_to_donor)
        .bind(&self.declared_not_family)
        .bind(&self.declared_not_employee)
        .bind(&self.declared_not_attorney)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/certificate_providers/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
