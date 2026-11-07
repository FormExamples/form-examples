//! Lpa registration recipient module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lpa_registration_recipients::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Lpa id.
    pub lpa_id: Uuid,
    /// Recipient kind.
    pub recipient_kind: String,
    /// Recipient person id.
    pub recipient_person_id: Option<Uuid>,
    /// Company name.
    pub company_name: String,
    /// Prefers post.
    pub prefers_post: bool,
    /// Prefers phone.
    pub prefers_phone: bool,
    /// Prefers email.
    pub prefers_email: bool,
    /// Prefers welsh.
    pub prefers_welsh: bool,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact email.
    pub contact_email: String,
    /// Other first names.
    pub other_first_names: String,
    /// Other last name.
    pub other_last_name: String,
    /// Other address line 1.
    pub other_address_line_1: String,
    /// Other address line 2.
    pub other_address_line_2: String,
    /// Other address line 3.
    pub other_address_line_3: String,
    /// Other postcode.
    pub other_postcode: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lpa_registration_recipients (lpa_id, recipient_kind, \
            recipient_person_id, company_name, prefers_post, prefers_phone, \
            prefers_email, prefers_welsh, contact_phone, contact_email, \
            other_first_names, other_last_name, other_address_line_1, \
            other_address_line_2, other_address_line_3, other_postcode) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.lpa_id)
        .bind(&self.recipient_kind)
        .bind(self.recipient_person_id)
        .bind(&self.company_name)
        .bind(self.prefers_post)
        .bind(self.prefers_phone)
        .bind(self.prefers_email)
        .bind(self.prefers_welsh)
        .bind(&self.contact_phone)
        .bind(&self.contact_email)
        .bind(&self.other_first_names)
        .bind(&self.other_last_name)
        .bind(&self.other_address_line_1)
        .bind(&self.other_address_line_2)
        .bind(&self.other_address_line_3)
        .bind(&self.other_postcode)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lpa_registration_recipients SET lpa_id = $2, recipient_kind = $3, \
            recipient_person_id = $4, company_name = $5, prefers_post = $6, \
            prefers_phone = $7, prefers_email = $8, prefers_welsh = $9, contact_phone = \
            $10, contact_email = $11, other_first_names = $12, other_last_name = $13, \
            other_address_line_1 = $14, other_address_line_2 = $15, other_address_line_3 \
            = $16, other_postcode = $17, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.lpa_id)
        .bind(&self.recipient_kind)
        .bind(self.recipient_person_id)
        .bind(&self.company_name)
        .bind(self.prefers_post)
        .bind(self.prefers_phone)
        .bind(self.prefers_email)
        .bind(self.prefers_welsh)
        .bind(&self.contact_phone)
        .bind(&self.contact_email)
        .bind(&self.other_first_names)
        .bind(&self.other_last_name)
        .bind(&self.other_address_line_1)
        .bind(&self.other_address_line_2)
        .bind(&self.other_address_line_3)
        .bind(&self.other_postcode)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
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
        .prefix("api/lpa_registration_recipients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
