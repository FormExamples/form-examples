//! Medical operation note specimen controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_specimens::Model;

/// Parameters accepted when creating or updating a medical operation note specimen record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Label.
    pub label: String,
    /// Specimen type.
    pub specimen_type: String,
    /// Anatomical site.
    pub anatomical_site: String,
    /// Container.
    pub container: String,
    /// Fixative.
    pub fixative: String,
    /// Destination.
    pub destination: String,
    /// Urgency.
    pub urgency: String,
    /// Label verified.
    pub label_verified: String,
    /// Chain of custody documented.
    pub chain_of_custody_documented: String,
    /// Notes.
    pub notes: String,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_specimens (label, specimen_type, \
            anatomical_site, container, fixative, destination, urgency, label_verified, \
            chain_of_custody_documented, notes, medical_operation_note_id) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(&self.label)
        .bind(&self.specimen_type)
        .bind(&self.anatomical_site)
        .bind(&self.container)
        .bind(&self.fixative)
        .bind(&self.destination)
        .bind(&self.urgency)
        .bind(&self.label_verified)
        .bind(&self.chain_of_custody_documented)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_specimens SET label = $2, specimen_type = $3, \
            anatomical_site = $4, container = $5, fixative = $6, destination = $7, \
            urgency = $8, label_verified = $9, chain_of_custody_documented = $10, notes \
            = $11, medical_operation_note_id = $12, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.label)
        .bind(&self.specimen_type)
        .bind(&self.anatomical_site)
        .bind(&self.container)
        .bind(&self.fixative)
        .bind(&self.destination)
        .bind(&self.urgency)
        .bind(&self.label_verified)
        .bind(&self.chain_of_custody_documented)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note specimen record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Create a new medical operation note specimen record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note specimen record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note specimen record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note specimen record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note specimens resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_specimens/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
