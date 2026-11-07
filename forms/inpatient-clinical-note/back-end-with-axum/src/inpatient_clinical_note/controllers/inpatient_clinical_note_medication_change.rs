//! Inpatient clinical note medication change controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_note_medication_changes::Model;

/// Parameters accepted when creating or updating a inpatient clinical note medication change record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Sort order.
    pub sort_order: i32,
    /// Drug name.
    pub drug_name: String,
    /// Action.
    pub action: String,
    /// Dose.
    pub dose: String,
    /// Route.
    pub route: String,
    /// Frequency.
    pub frequency: String,
    /// Indication.
    pub indication: String,
    /// Is antimicrobial.
    pub is_antimicrobial: String,
    /// Review date.
    pub review_date: Option<Date>,
    /// Stop date.
    pub stop_date: Option<Date>,
    /// Dmd code.
    pub dmd_code: String,
    /// Notes.
    pub notes: String,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_note_medication_changes (sort_order, \
            drug_name, action, dose, route, frequency, indication, is_antimicrobial, \
            review_date, stop_date, dmd_code, notes, inpatient_clinical_note_id) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.sort_order)
        .bind(&self.drug_name)
        .bind(&self.action)
        .bind(&self.dose)
        .bind(&self.route)
        .bind(&self.frequency)
        .bind(&self.indication)
        .bind(&self.is_antimicrobial)
        .bind(self.review_date)
        .bind(self.stop_date)
        .bind(&self.dmd_code)
        .bind(&self.notes)
        .bind(self.inpatient_clinical_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_note_medication_changes SET sort_order = $2, \
            drug_name = $3, action = $4, dose = $5, route = $6, frequency = $7, \
            indication = $8, is_antimicrobial = $9, review_date = $10, stop_date = $11, \
            dmd_code = $12, notes = $13, inpatient_clinical_note_id = $14, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.sort_order)
        .bind(&self.drug_name)
        .bind(&self.action)
        .bind(&self.dose)
        .bind(&self.route)
        .bind(&self.frequency)
        .bind(&self.indication)
        .bind(&self.is_antimicrobial)
        .bind(self.review_date)
        .bind(self.stop_date)
        .bind(&self.dmd_code)
        .bind(&self.notes)
        .bind(self.inpatient_clinical_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note medication change record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Create a new inpatient clinical note medication change record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note medication change record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note medication change record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note medication change record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the inpatient clinical note medication changes resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_note_medication_changes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
