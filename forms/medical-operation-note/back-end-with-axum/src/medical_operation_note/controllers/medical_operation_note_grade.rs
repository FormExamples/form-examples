//! Medical operation note grade controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_grades::Model;

/// Parameters accepted when creating or updating a medical operation note grade record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Computed composite risk.
    pub computed_composite_risk: String,
    /// Final composite risk.
    pub final_composite_risk: String,
    /// Override reason.
    pub override_reason: String,
    /// Worst clavien dindo grade.
    pub worst_clavien_dindo_grade: String,
    /// Asa physical status.
    pub asa_physical_status: String,
    /// Blood loss band.
    pub blood_loss_band: String,
    /// Counts agreed.
    pub counts_agreed: String,
    /// Never event suspected.
    pub never_event_suspected: String,
    /// Recommendation.
    pub recommendation: String,
    /// Surgeon notes.
    pub surgeon_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_grades (computed_composite_risk, \
            final_composite_risk, override_reason, worst_clavien_dindo_grade, \
            asa_physical_status, blood_loss_band, counts_agreed, never_event_suspected, \
            recommendation, surgeon_notes, signed_at, graded_at, medical_operation_note_id) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(&self.computed_composite_risk)
        .bind(&self.final_composite_risk)
        .bind(&self.override_reason)
        .bind(&self.worst_clavien_dindo_grade)
        .bind(&self.asa_physical_status)
        .bind(&self.blood_loss_band)
        .bind(&self.counts_agreed)
        .bind(&self.never_event_suspected)
        .bind(&self.recommendation)
        .bind(&self.surgeon_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .bind(self.medical_operation_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_grades SET computed_composite_risk = $2, \
            final_composite_risk = $3, override_reason = $4, worst_clavien_dindo_grade = $5, \
            asa_physical_status = $6, blood_loss_band = $7, counts_agreed = $8, \
            never_event_suspected = $9, recommendation = $10, surgeon_notes = $11, signed_at \
            = $12, graded_at = $13, medical_operation_note_id = $14, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(&self.computed_composite_risk)
        .bind(&self.final_composite_risk)
        .bind(&self.override_reason)
        .bind(&self.worst_clavien_dindo_grade)
        .bind(&self.asa_physical_status)
        .bind(&self.blood_loss_band)
        .bind(&self.counts_agreed)
        .bind(&self.never_event_suspected)
        .bind(&self.recommendation)
        .bind(&self.surgeon_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .bind(self.medical_operation_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note grade record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Create a new medical operation note grade record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note grade record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note grade record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note grade record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note grades resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
