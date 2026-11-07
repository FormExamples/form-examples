//! International certificate of vaccination or prophylaxis module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::international_certificate_of_vaccination_or_prophylaxes::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Status.
    pub status: String,
    /// Issued at.
    pub issued_at: Option<DateTimeWithTimeZone>,
    /// Revoked at.
    pub revoked_at: Option<DateTimeWithTimeZone>,
    /// Revocation reason.
    pub revocation_reason: String,
    /// Certificate serial number.
    pub certificate_serial_number: String,
    /// Issuing country as iso 3166 1 alpha 3.
    pub issuing_country_as_iso_3166_1_alpha_3: String,
    /// Primary language as bcp 47.
    pub primary_language_as_bcp_47: String,
    /// Secondary language as bcp 47.
    pub secondary_language_as_bcp_47: String,
    /// Tertiary language as bcp 47.
    pub tertiary_language_as_bcp_47: String,
    /// Destination countries as iso 3166 1 alpha 3.
    pub destination_countries_as_iso_3166_1_alpha_3: String,
    /// Planned arrival date.
    pub planned_arrival_date: Option<Date>,
    /// Purpose of travel.
    pub purpose_of_travel: String,
    /// Medical waiver.
    pub medical_waiver: String,
    /// Medical waiver reason.
    pub medical_waiver_reason: String,
    /// Medical waiver signed at.
    pub medical_waiver_signed_at: Option<DateTimeWithTimeZone>,
    /// Declared pregnancy.
    pub declared_pregnancy: String,
    /// Declared breastfeeding.
    pub declared_breastfeeding: String,
    /// Declared immunosuppression.
    pub declared_immunosuppression: String,
    /// Electronic signature data url.
    pub electronic_signature_data_url: String,
    /// Electronic signature signed at.
    pub electronic_signature_signed_at: Option<DateTimeWithTimeZone>,
    /// Overall valid.
    pub overall_valid: String,
    /// Validity computed at.
    pub validity_computed_at: Option<DateTimeWithTimeZone>,
    /// Notes.
    pub notes: String,
    /// Patient id.
    pub patient_id: Uuid,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Center id.
    pub center_id: Uuid,
    /// Medical waiver signed by clinician id.
    pub medical_waiver_signed_by_clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO international_certificate_of_vaccination_or_prophylaxes (status, \
            issued_at, revoked_at, revocation_reason, certificate_serial_number, \
            issuing_country_as_iso_3166_1_alpha_3, primary_language_as_bcp_47, \
            secondary_language_as_bcp_47, tertiary_language_as_bcp_47, \
            destination_countries_as_iso_3166_1_alpha_3, planned_arrival_date, \
            purpose_of_travel, medical_waiver, medical_waiver_reason, \
            medical_waiver_signed_at, declared_pregnancy, declared_breastfeeding, \
            declared_immunosuppression, electronic_signature_data_url, \
            electronic_signature_signed_at, overall_valid, validity_computed_at, notes, \
            patient_id, clinician_id, center_id, medical_waiver_signed_by_clinician_id) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(&self.status)
        .bind(self.issued_at)
        .bind(self.revoked_at)
        .bind(&self.revocation_reason)
        .bind(&self.certificate_serial_number)
        .bind(&self.issuing_country_as_iso_3166_1_alpha_3)
        .bind(&self.primary_language_as_bcp_47)
        .bind(&self.secondary_language_as_bcp_47)
        .bind(&self.tertiary_language_as_bcp_47)
        .bind(&self.destination_countries_as_iso_3166_1_alpha_3)
        .bind(self.planned_arrival_date)
        .bind(&self.purpose_of_travel)
        .bind(&self.medical_waiver)
        .bind(&self.medical_waiver_reason)
        .bind(self.medical_waiver_signed_at)
        .bind(&self.declared_pregnancy)
        .bind(&self.declared_breastfeeding)
        .bind(&self.declared_immunosuppression)
        .bind(&self.electronic_signature_data_url)
        .bind(self.electronic_signature_signed_at)
        .bind(&self.overall_valid)
        .bind(self.validity_computed_at)
        .bind(&self.notes)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.center_id)
        .bind(self.medical_waiver_signed_by_clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE international_certificate_of_vaccination_or_prophylaxes SET status = \
            $2, issued_at = $3, revoked_at = $4, revocation_reason = $5, \
            certificate_serial_number = $6, issuing_country_as_iso_3166_1_alpha_3 = $7, \
            primary_language_as_bcp_47 = $8, secondary_language_as_bcp_47 = $9, \
            tertiary_language_as_bcp_47 = $10, \
            destination_countries_as_iso_3166_1_alpha_3 = $11, planned_arrival_date = \
            $12, purpose_of_travel = $13, medical_waiver = $14, medical_waiver_reason = \
            $15, medical_waiver_signed_at = $16, declared_pregnancy = $17, \
            declared_breastfeeding = $18, declared_immunosuppression = $19, \
            electronic_signature_data_url = $20, electronic_signature_signed_at = $21, \
            overall_valid = $22, validity_computed_at = $23, notes = $24, patient_id = \
            $25, clinician_id = $26, center_id = $27, \
            medical_waiver_signed_by_clinician_id = $28, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(self.issued_at)
        .bind(self.revoked_at)
        .bind(&self.revocation_reason)
        .bind(&self.certificate_serial_number)
        .bind(&self.issuing_country_as_iso_3166_1_alpha_3)
        .bind(&self.primary_language_as_bcp_47)
        .bind(&self.secondary_language_as_bcp_47)
        .bind(&self.tertiary_language_as_bcp_47)
        .bind(&self.destination_countries_as_iso_3166_1_alpha_3)
        .bind(self.planned_arrival_date)
        .bind(&self.purpose_of_travel)
        .bind(&self.medical_waiver)
        .bind(&self.medical_waiver_reason)
        .bind(self.medical_waiver_signed_at)
        .bind(&self.declared_pregnancy)
        .bind(&self.declared_breastfeeding)
        .bind(&self.declared_immunosuppression)
        .bind(&self.electronic_signature_data_url)
        .bind(self.electronic_signature_signed_at)
        .bind(&self.overall_valid)
        .bind(self.validity_computed_at)
        .bind(&self.notes)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.center_id)
        .bind(self.medical_waiver_signed_by_clinician_id)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/international_certificate_of_vaccination_or_prophylaxes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
