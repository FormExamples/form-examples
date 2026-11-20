//! Applicant module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::applicants::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Name.
    #[validate(length(max = TEXT_MAX))]
    pub name: String,
    /// Owner type.
    pub owner_type: String,
    /// Birth date.
    #[validate(custom(function = "plausible_date"))]
    pub birth_date: Option<Date>,
    /// Email.
    #[validate(length(max = TEXT_MAX))]
    pub email: Option<String>,
    /// Phone.
    #[validate(length(max = TEXT_MAX))]
    pub phone: Option<String>,
    /// Postal address as full text.
    #[validate(length(max = TEXT_MAX))]
    pub postal_address_as_full_text: Option<String>,
    /// State code.
    pub state_code: String,
    /// Postcode.
    #[validate(length(max = TEXT_MAX))]
    pub postcode: Option<String>,
    /// Identification type.
    pub identification_type: String,
    /// Identification number.
    #[validate(length(max = TEXT_MAX))]
    pub identification_number: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO applicants (name, owner_type, birth_date, email, phone, \
            postal_address_as_full_text, state_code, postcode, identification_type, \
            identification_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) \
            RETURNING *",
        )
        .bind(&self.name)
        .bind(&self.owner_type)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.state_code)
        .bind(&self.postcode)
        .bind(&self.identification_type)
        .bind(&self.identification_number)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE applicants SET name = $2, owner_type = $3, birth_date = $4, email = \
            $5, phone = $6, postal_address_as_full_text = $7, state_code = $8, postcode \
            = $9, identification_type = $10, identification_number = $11, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.name)
        .bind(&self.owner_type)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.state_code)
        .bind(&self.postcode)
        .bind(&self.identification_type)
        .bind(&self.identification_number)
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
        .prefix("api/united-states-vehicle-title-and-registration-application/applicants/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
