//! Medical human leukocyte and disease association request module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_human_leukocyte_and_disease_association_requests::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Patient id.
    pub patient_id: Uuid,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Request date.
    #[validate(custom(function = "plausible_date"))]
    pub request_date: Option<Date>,
    /// Referrer department.
    pub referrer_department: String,
    /// Referrer organization.
    pub referrer_organization: String,
    /// Copy of report to.
    pub copy_of_report_to: String,
    /// Report email.
    #[validate(length(max = TEXT_MAX))]
    pub report_email: Option<String>,
    /// Clinical details.
    pub clinical_details: String,
    /// Indication category.
    pub indication_category: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Previous hla typing known.
    pub previous_hla_typing_known: bool,
    /// Planned drug.
    pub planned_drug: String,
    /// Urgent testing.
    pub urgent_testing: bool,
    /// Urgent testing reason.
    pub urgent_testing_reason: String,
    /// High risk sample.
    pub high_risk_sample: bool,
    /// High risk description.
    pub high_risk_description: String,
    /// Requested by signed at.
    pub requested_by_signed_at: Option<DateTimeWithTimeZone>,
    /// Consent and identity confirmed.
    pub consent_and_identity_confirmed: bool,
    /// Sample collector name.
    pub sample_collector_name: String,
    /// Sample collected at.
    pub sample_collected_at: Option<DateTimeWithTimeZone>,
    /// Identifiers on sample count.
    pub identifiers_on_sample_count: Option<i32>,
    /// Identifiers on form count.
    pub identifiers_on_form_count: Option<i32>,
    /// Sample and form details match.
    pub sample_and_form_details_match: bool,
    /// Sample volume ml.
    pub sample_volume_ml: Option<i32>,
    /// Samples other description.
    pub samples_other_description: String,
    /// Laboratory sample number.
    pub laboratory_sample_number: String,
    /// Laboratory sample received at.
    pub laboratory_sample_received_at: Option<DateTimeWithTimeZone>,
    /// Laboratory identifiers checked by.
    pub laboratory_identifiers_checked_by: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_human_leukocyte_and_disease_association_requests \
            (patient_id, clinician_id, status, request_date, referrer_department, \
            referrer_organization, copy_of_report_to, report_email, clinical_details, \
            indication_category, ethnicity, previous_hla_typing_known, planned_drug, \
            urgent_testing, urgent_testing_reason, high_risk_sample, \
            high_risk_description, requested_by_signed_at, \
            consent_and_identity_confirmed, sample_collector_name, sample_collected_at, \
            identifiers_on_sample_count, identifiers_on_form_count, \
            sample_and_form_details_match, sample_volume_ml, samples_other_description, \
            laboratory_sample_number, laboratory_sample_received_at, \
            laboratory_identifiers_checked_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.referrer_department)
        .bind(&self.referrer_organization)
        .bind(&self.copy_of_report_to)
        .bind(&self.report_email)
        .bind(&self.clinical_details)
        .bind(&self.indication_category)
        .bind(&self.ethnicity)
        .bind(self.previous_hla_typing_known)
        .bind(&self.planned_drug)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(self.high_risk_sample)
        .bind(&self.high_risk_description)
        .bind(self.requested_by_signed_at)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.sample_volume_ml)
        .bind(&self.samples_other_description)
        .bind(&self.laboratory_sample_number)
        .bind(self.laboratory_sample_received_at)
        .bind(&self.laboratory_identifiers_checked_by)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_human_leukocyte_and_disease_association_requests SET \
            patient_id = $2, clinician_id = $3, status = $4, request_date = $5, \
            referrer_department = $6, referrer_organization = $7, copy_of_report_to = \
            $8, report_email = $9, clinical_details = $10, indication_category = $11, \
            ethnicity = $12, previous_hla_typing_known = $13, planned_drug = $14, \
            urgent_testing = $15, urgent_testing_reason = $16, high_risk_sample = $17, \
            high_risk_description = $18, requested_by_signed_at = $19, \
            consent_and_identity_confirmed = $20, sample_collector_name = $21, \
            sample_collected_at = $22, identifiers_on_sample_count = $23, \
            identifiers_on_form_count = $24, sample_and_form_details_match = $25, \
            sample_volume_ml = $26, samples_other_description = $27, \
            laboratory_sample_number = $28, laboratory_sample_received_at = $29, \
            laboratory_identifiers_checked_by = $30, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.referrer_department)
        .bind(&self.referrer_organization)
        .bind(&self.copy_of_report_to)
        .bind(&self.report_email)
        .bind(&self.clinical_details)
        .bind(&self.indication_category)
        .bind(&self.ethnicity)
        .bind(self.previous_hla_typing_known)
        .bind(&self.planned_drug)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(self.high_risk_sample)
        .bind(&self.high_risk_description)
        .bind(self.requested_by_signed_at)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.sample_volume_ml)
        .bind(&self.samples_other_description)
        .bind(&self.laboratory_sample_number)
        .bind(self.laboratory_sample_received_at)
        .bind(&self.laboratory_identifiers_checked_by)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/medical-human-leukocyte-and-disease-association-request/medical_human_leukocyte_and_disease_association_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
