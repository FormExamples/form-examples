//! Hsct hla typing request module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hsct_hla_typing_requests::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Subject id.
    pub subject_id: Uuid,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Request date.
    #[validate(custom(function = "plausible_date"))]
    pub request_date: Option<Date>,
    /// Subject role.
    pub subject_role: String,
    /// Donor type.
    pub donor_type: String,
    /// Hla typing resolution.
    pub hla_typing_resolution: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Clinical details.
    pub clinical_details: String,
    /// Referrer department.
    pub referrer_department: String,
    /// Referrer organization.
    pub referrer_organization: String,
    /// Copy of report to.
    pub copy_of_report_to: String,
    /// Report email.
    #[validate(length(max = TEXT_MAX))]
    pub report_email: Option<String>,
    /// Recipient family name.
    pub recipient_family_name: String,
    /// Recipient given names.
    pub recipient_given_names: String,
    /// Recipient medical record number.
    pub recipient_medical_record_number: String,
    /// Recipient birth date.
    #[validate(custom(function = "plausible_date"))]
    pub recipient_birth_date: Option<Date>,
    /// Relationship to recipient.
    pub relationship_to_recipient: String,
    /// Urgent testing.
    pub urgent_testing: bool,
    /// Urgent testing reason.
    pub urgent_testing_reason: String,
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
    /// Edta purple volume ml.
    pub edta_purple_volume_ml: Option<i32>,
    /// Edta pink volume ml.
    pub edta_pink_volume_ml: Option<i32>,
    /// Clotted red volume ml.
    pub clotted_red_volume_ml: Option<i32>,
    /// Samples other description.
    pub samples_other_description: String,
    /// Laboratory recipient identifier.
    pub laboratory_recipient_identifier: String,
    /// Laboratory donor identifier.
    pub laboratory_donor_identifier: String,
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
            "INSERT INTO hsct_hla_typing_requests (subject_id, clinician_id, status, \
            request_date, subject_role, donor_type, hla_typing_resolution, ethnicity, \
            clinical_details, referrer_department, referrer_organization, \
            copy_of_report_to, report_email, recipient_family_name, \
            recipient_given_names, recipient_medical_record_number, \
            recipient_birth_date, relationship_to_recipient, urgent_testing, \
            urgent_testing_reason, requested_by_signed_at, \
            consent_and_identity_confirmed, sample_collector_name, sample_collected_at, \
            identifiers_on_sample_count, identifiers_on_form_count, \
            sample_and_form_details_match, edta_purple_volume_ml, edta_pink_volume_ml, \
            clotted_red_volume_ml, samples_other_description, \
            laboratory_recipient_identifier, laboratory_donor_identifier, \
            laboratory_sample_number, laboratory_sample_received_at, \
            laboratory_identifiers_checked_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36) RETURNING *",
        )
        .bind(self.subject_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.subject_role)
        .bind(&self.donor_type)
        .bind(&self.hla_typing_resolution)
        .bind(&self.ethnicity)
        .bind(&self.clinical_details)
        .bind(&self.referrer_department)
        .bind(&self.referrer_organization)
        .bind(&self.copy_of_report_to)
        .bind(&self.report_email)
        .bind(&self.recipient_family_name)
        .bind(&self.recipient_given_names)
        .bind(&self.recipient_medical_record_number)
        .bind(self.recipient_birth_date)
        .bind(&self.relationship_to_recipient)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(self.requested_by_signed_at)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.edta_purple_volume_ml)
        .bind(self.edta_pink_volume_ml)
        .bind(self.clotted_red_volume_ml)
        .bind(&self.samples_other_description)
        .bind(&self.laboratory_recipient_identifier)
        .bind(&self.laboratory_donor_identifier)
        .bind(&self.laboratory_sample_number)
        .bind(self.laboratory_sample_received_at)
        .bind(&self.laboratory_identifiers_checked_by)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hsct_hla_typing_requests SET subject_id = $2, clinician_id = $3, \
            status = $4, request_date = $5, subject_role = $6, donor_type = $7, \
            hla_typing_resolution = $8, ethnicity = $9, clinical_details = $10, \
            referrer_department = $11, referrer_organization = $12, copy_of_report_to = \
            $13, report_email = $14, recipient_family_name = $15, recipient_given_names \
            = $16, recipient_medical_record_number = $17, recipient_birth_date = $18, \
            relationship_to_recipient = $19, urgent_testing = $20, urgent_testing_reason \
            = $21, requested_by_signed_at = $22, consent_and_identity_confirmed = $23, \
            sample_collector_name = $24, sample_collected_at = $25, \
            identifiers_on_sample_count = $26, identifiers_on_form_count = $27, \
            sample_and_form_details_match = $28, edta_purple_volume_ml = $29, \
            edta_pink_volume_ml = $30, clotted_red_volume_ml = $31, \
            samples_other_description = $32, laboratory_recipient_identifier = $33, \
            laboratory_donor_identifier = $34, laboratory_sample_number = $35, \
            laboratory_sample_received_at = $36, laboratory_identifiers_checked_by = \
            $37, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.subject_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.subject_role)
        .bind(&self.donor_type)
        .bind(&self.hla_typing_resolution)
        .bind(&self.ethnicity)
        .bind(&self.clinical_details)
        .bind(&self.referrer_department)
        .bind(&self.referrer_organization)
        .bind(&self.copy_of_report_to)
        .bind(&self.report_email)
        .bind(&self.recipient_family_name)
        .bind(&self.recipient_given_names)
        .bind(&self.recipient_medical_record_number)
        .bind(self.recipient_birth_date)
        .bind(&self.relationship_to_recipient)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(self.requested_by_signed_at)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.edta_purple_volume_ml)
        .bind(self.edta_pink_volume_ml)
        .bind(self.clotted_red_volume_ml)
        .bind(&self.samples_other_description)
        .bind(&self.laboratory_recipient_identifier)
        .bind(&self.laboratory_donor_identifier)
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
        .prefix("api/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/hsct_hla_typing_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
