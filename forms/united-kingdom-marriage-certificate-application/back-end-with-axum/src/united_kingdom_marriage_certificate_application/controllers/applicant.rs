#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::applicants::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    #[validate(length(max = TEXT_MAX))]
    pub name: String,
    #[validate(custom(function = "plausible_date"))]
    pub birth_date: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub email: String,
    #[validate(length(max = TEXT_MAX))]
    pub phone: String,
    #[validate(length(max = TEXT_MAX))]
    pub postal_address_as_full_text: String,
    #[validate(length(max = TEXT_MAX))]
    pub postcode: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO applicants (name, birth_date, email, phone, \
            postal_address_as_full_text, postcode) VALUES ($1, $2, $3, $4, $5, $6) \
            RETURNING *",
        )
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.postcode)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE applicants SET name = $2, birth_date = $3, email = $4, phone = $5, \
            postal_address_as_full_text = $6, postcode = $7, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.postal_address_as_full_text)
        .bind(&self.postcode)
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
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

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
        .prefix("api/applicants/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
