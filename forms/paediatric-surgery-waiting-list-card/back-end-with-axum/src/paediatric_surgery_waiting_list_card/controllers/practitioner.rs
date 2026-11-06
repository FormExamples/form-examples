#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::practitioners::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub role: String,
    pub registration_body: String,
    pub registration_number: String,
    pub organisation_name: String,
    pub organisation_ods_code: String,
    pub site_name: String,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO practitioners (deleted_at, name, email, phone, role, \
            registration_body, registration_number, organisation_name, organisation_ods_code, \
            site_name, country_as_iso_3166_1_alpha_2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.role)
        .bind(&self.registration_body)
        .bind(&self.registration_number)
        .bind(&self.organisation_name)
        .bind(&self.organisation_ods_code)
        .bind(&self.site_name)
        .bind(&self.country_as_iso_3166_1_alpha_2)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE practitioners SET deleted_at = $2, name = $3, email = $4, phone = $5, role \
            = $6, registration_body = $7, registration_number = $8, organisation_name = $9, \
            organisation_ods_code = $10, site_name = $11, country_as_iso_3166_1_alpha_2 = \
            $12, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.role)
        .bind(&self.registration_body)
        .bind(&self.registration_number)
        .bind(&self.organisation_name)
        .bind(&self.organisation_ods_code)
        .bind(&self.site_name)
        .bind(&self.country_as_iso_3166_1_alpha_2)
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
        .prefix("api/practitioners/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
