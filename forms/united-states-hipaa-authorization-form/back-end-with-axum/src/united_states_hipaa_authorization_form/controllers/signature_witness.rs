#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::signature_witnesses::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub hipaa_authorization_id: Uuid,
    pub individual_signature_confirmed: String,
    pub individual_signature_image_uri: String,
    pub signature_date: Option<Date>,
    pub signed_at_location: String,
    pub parent_guardian_co_signature_required: String,
    pub parent_guardian_name: String,
    pub parent_guardian_signature_confirmed: String,
    pub parent_guardian_signature_date: Option<Date>,
    pub witness_name: String,
    pub witness_signature_confirmed: String,
    pub witness_date: Option<Date>,
    pub witness_role: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO signature_witnesses (deleted_at, hipaa_authorization_id, \
            individual_signature_confirmed, individual_signature_image_uri, signature_date, \
            signed_at_location, parent_guardian_co_signature_required, parent_guardian_name, \
            parent_guardian_signature_confirmed, parent_guardian_signature_date, \
            witness_name, witness_signature_confirmed, witness_date, witness_role) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.hipaa_authorization_id)
        .bind(&self.individual_signature_confirmed)
        .bind(&self.individual_signature_image_uri)
        .bind(self.signature_date)
        .bind(&self.signed_at_location)
        .bind(&self.parent_guardian_co_signature_required)
        .bind(&self.parent_guardian_name)
        .bind(&self.parent_guardian_signature_confirmed)
        .bind(self.parent_guardian_signature_date)
        .bind(&self.witness_name)
        .bind(&self.witness_signature_confirmed)
        .bind(self.witness_date)
        .bind(&self.witness_role)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE signature_witnesses SET deleted_at = $2, hipaa_authorization_id = $3, \
            individual_signature_confirmed = $4, individual_signature_image_uri = $5, \
            signature_date = $6, signed_at_location = $7, \
            parent_guardian_co_signature_required = $8, parent_guardian_name = $9, \
            parent_guardian_signature_confirmed = $10, parent_guardian_signature_date = $11, \
            witness_name = $12, witness_signature_confirmed = $13, witness_date = $14, \
            witness_role = $15, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.hipaa_authorization_id)
        .bind(&self.individual_signature_confirmed)
        .bind(&self.individual_signature_image_uri)
        .bind(self.signature_date)
        .bind(&self.signed_at_location)
        .bind(&self.parent_guardian_co_signature_required)
        .bind(&self.parent_guardian_name)
        .bind(&self.parent_guardian_signature_confirmed)
        .bind(self.parent_guardian_signature_date)
        .bind(&self.witness_name)
        .bind(&self.witness_signature_confirmed)
        .bind(self.witness_date)
        .bind(&self.witness_role)
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
        .prefix("api/signature_witnesses/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
