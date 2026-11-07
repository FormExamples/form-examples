//! Application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::applications::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Patient id.
    pub patient_id: Uuid,
    /// Practitioner id.
    pub practitioner_id: Uuid,
    /// Status.
    pub status: String,
    /// Application kind.
    pub application_kind: String,
    /// Previous certificate number.
    pub previous_certificate_number: String,
    /// Previous certificate expiry date.
    pub previous_certificate_expiry_date: Option<Date>,
    /// Completed date.
    pub completed_date: Option<Date>,
    /// Posted date.
    pub posted_date: Option<Date>,
    /// Received by nhsbsa date.
    pub received_by_nhsbsa_date: Option<Date>,
    /// Certificate number.
    pub certificate_number: String,
    /// Valid from.
    pub valid_from: Option<Date>,
    /// Valid until.
    pub valid_until: Option<Date>,
    /// Practitioner signature present.
    pub practitioner_signature_present: String,
    /// Practitioner declaration text.
    pub practitioner_declaration_text: String,
    /// Notes.
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO applications (patient_id, practitioner_id, status, \
            application_kind, previous_certificate_number, \
            previous_certificate_expiry_date, completed_date, posted_date, \
            received_by_nhsbsa_date, certificate_number, valid_from, valid_until, \
            practitioner_signature_present, practitioner_declaration_text, notes) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING \
            *",
        )
        .bind(self.patient_id)
        .bind(self.practitioner_id)
        .bind(&self.status)
        .bind(&self.application_kind)
        .bind(&self.previous_certificate_number)
        .bind(self.previous_certificate_expiry_date)
        .bind(self.completed_date)
        .bind(self.posted_date)
        .bind(self.received_by_nhsbsa_date)
        .bind(&self.certificate_number)
        .bind(self.valid_from)
        .bind(self.valid_until)
        .bind(&self.practitioner_signature_present)
        .bind(&self.practitioner_declaration_text)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE applications SET patient_id = $2, practitioner_id = $3, status = $4, \
            application_kind = $5, previous_certificate_number = $6, \
            previous_certificate_expiry_date = $7, completed_date = $8, posted_date = \
            $9, received_by_nhsbsa_date = $10, certificate_number = $11, valid_from = \
            $12, valid_until = $13, practitioner_signature_present = $14, \
            practitioner_declaration_text = $15, notes = $16, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.practitioner_id)
        .bind(&self.status)
        .bind(&self.application_kind)
        .bind(&self.previous_certificate_number)
        .bind(self.previous_certificate_expiry_date)
        .bind(self.completed_date)
        .bind(self.posted_date)
        .bind(self.received_by_nhsbsa_date)
        .bind(&self.certificate_number)
        .bind(self.valid_from)
        .bind(self.valid_until)
        .bind(&self.practitioner_signature_present)
        .bind(&self.practitioner_declaration_text)
        .bind(&self.notes)
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
        .prefix("api/applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
