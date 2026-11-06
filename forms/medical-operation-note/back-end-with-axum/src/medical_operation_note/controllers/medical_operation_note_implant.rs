//! Medical operation note implant controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_implants::Model;

/// Parameters accepted when creating or updating a medical operation note implant record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Category.
    pub category: String,
    /// Name.
    pub name: String,
    /// Size or gauge.
    pub size_or_gauge: String,
    /// Quantity.
    pub quantity: i32,
    /// Manufacturer.
    pub manufacturer: String,
    /// Lot number.
    pub lot_number: String,
    /// Serial number.
    pub serial_number: String,
    /// Batch number.
    pub batch_number: String,
    /// Expiry date.
    pub expiry_date: Option<Date>,
    /// Udi di.
    pub udi_di: String,
    /// Implant site.
    pub implant_site: String,
    /// Registry required.
    pub registry_required: String,
    /// Registry submitted.
    pub registry_submitted: String,
    /// Notes.
    pub notes: String,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_implants (category, name, size_or_gauge, \
            quantity, manufacturer, lot_number, serial_number, batch_number, expiry_date, \
            udi_di, implant_site, registry_required, registry_submitted, notes, \
            medical_operation_note_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15) RETURNING *",
        )
        .bind(&self.category)
        .bind(&self.name)
        .bind(&self.size_or_gauge)
        .bind(self.quantity)
        .bind(&self.manufacturer)
        .bind(&self.lot_number)
        .bind(&self.serial_number)
        .bind(&self.batch_number)
        .bind(self.expiry_date)
        .bind(&self.udi_di)
        .bind(&self.implant_site)
        .bind(&self.registry_required)
        .bind(&self.registry_submitted)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_implants SET category = $2, name = $3, \
            size_or_gauge = $4, quantity = $5, manufacturer = $6, lot_number = $7, \
            serial_number = $8, batch_number = $9, expiry_date = $10, udi_di = $11, \
            implant_site = $12, registry_required = $13, registry_submitted = $14, notes = \
            $15, medical_operation_note_id = $16, updated_at = now() WHERE id = $1 RETURNING \
            *",
        )
        .bind(id)
        .bind(&self.category)
        .bind(&self.name)
        .bind(&self.size_or_gauge)
        .bind(self.quantity)
        .bind(&self.manufacturer)
        .bind(&self.lot_number)
        .bind(&self.serial_number)
        .bind(&self.batch_number)
        .bind(self.expiry_date)
        .bind(&self.udi_di)
        .bind(&self.implant_site)
        .bind(&self.registry_required)
        .bind(&self.registry_submitted)
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

/// List every medical operation note implant record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Create a new medical operation note implant record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note implant record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note implant record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note implant record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note implants resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_implants/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
