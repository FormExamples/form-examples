#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lpa_signatures::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub lpa_id: Uuid,
    pub signer_role: String,
    pub signer_id: Option<Uuid>,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub signature_method: String,
    pub signature_data: Option<Vec<u8>>,
    pub witness_name: String,
    pub witness_address: String,
    pub witness_signed_at: Option<DateTimeWithTimeZone>,
    pub witness_is_attorney: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lpa_signatures (lpa_id, signer_role, signer_id, signed_at, \
            signature_method, signature_data, witness_name, witness_address, \
            witness_signed_at, witness_is_attorney) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10) RETURNING *",
        )
        .bind(self.lpa_id)
        .bind(&self.signer_role)
        .bind(self.signer_id)
        .bind(self.signed_at)
        .bind(&self.signature_method)
        .bind(&self.signature_data)
        .bind(&self.witness_name)
        .bind(&self.witness_address)
        .bind(self.witness_signed_at)
        .bind(&self.witness_is_attorney)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lpa_signatures SET lpa_id = $2, signer_role = $3, signer_id = $4, \
            signed_at = $5, signature_method = $6, signature_data = $7, witness_name = \
            $8, witness_address = $9, witness_signed_at = $10, witness_is_attorney = \
            $11, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.lpa_id)
        .bind(&self.signer_role)
        .bind(self.signer_id)
        .bind(self.signed_at)
        .bind(&self.signature_method)
        .bind(&self.signature_data)
        .bind(&self.witness_name)
        .bind(&self.witness_address)
        .bind(self.witness_signed_at)
        .bind(&self.witness_is_attorney)
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
        .prefix("api/lpa_signatures/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
