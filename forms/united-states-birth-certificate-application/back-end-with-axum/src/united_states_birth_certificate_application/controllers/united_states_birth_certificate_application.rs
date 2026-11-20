#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_birth_certificate_applications::Model;
use crate::support::validation::{TEXT_MAX, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub applicant_id: Option<Uuid>,
    pub registrant_id: Uuid,
    pub requester_relationship: String,
    pub purpose: String,
    pub needs_apostille: String,
    #[validate(length(max = TEXT_MAX))]
    pub apostille_country: String,
    pub certificate_type: String,
    pub copies: Option<i32>,
    pub delivery_method: String,
    #[validate(range(min = -999999.99, max = 999999.99))]
    pub fee_enclosed_usd: Option<f64>,
    pub id_type: String,
    pub id_unexpired: String,
    pub proof_of_relationship: String,
    pub authority_document: String,
    pub notarized_sworn_statement: String,
    pub declaration_signed: String,
    #[validate(length(max = TEXT_MAX))]
    pub application_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_birth_certificate_applications (applicant_id, registrant_id, requester_relationship, purpose, needs_apostille, apostille_country, certificate_type, copies, delivery_method, fee_enclosed_usd, id_type, id_unexpired, proof_of_relationship, authority_document, notarized_sworn_statement, declaration_signed, application_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.registrant_id)
        .bind(&self.requester_relationship)
        .bind(&self.purpose)
        .bind(&self.needs_apostille)
        .bind(&self.apostille_country)
        .bind(&self.certificate_type)
        .bind(self.copies)
        .bind(&self.delivery_method)
        .bind(self.fee_enclosed_usd)
        .bind(&self.id_type)
        .bind(&self.id_unexpired)
        .bind(&self.proof_of_relationship)
        .bind(&self.authority_document)
        .bind(&self.notarized_sworn_statement)
        .bind(&self.declaration_signed)
        .bind(&self.application_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_birth_certificate_applications SET applicant_id = $2, registrant_id = $3, requester_relationship = $4, purpose = $5, needs_apostille = $6, apostille_country = $7, certificate_type = $8, copies = $9, delivery_method = $10, fee_enclosed_usd = $11, id_type = $12, id_unexpired = $13, proof_of_relationship = $14, authority_document = $15, notarized_sworn_statement = $16, declaration_signed = $17, application_note = $18, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.registrant_id)
        .bind(&self.requester_relationship)
        .bind(&self.purpose)
        .bind(&self.needs_apostille)
        .bind(&self.apostille_country)
        .bind(&self.certificate_type)
        .bind(self.copies)
        .bind(&self.delivery_method)
        .bind(self.fee_enclosed_usd)
        .bind(&self.id_type)
        .bind(&self.id_unexpired)
        .bind(&self.proof_of_relationship)
        .bind(&self.authority_document)
        .bind(&self.notarized_sworn_statement)
        .bind(&self.declaration_signed)
        .bind(&self.application_note)
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
        .prefix("api/united_states_birth_certificate_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
