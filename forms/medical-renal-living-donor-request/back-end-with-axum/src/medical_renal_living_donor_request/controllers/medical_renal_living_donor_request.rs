//! Medical renal living donor request module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_renal_living_donor_requests::Model;
use crate::support::validation::{plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Donor id.
    pub donor_id: Uuid,
    /// Recipient id.
    pub recipient_id: Option<Uuid>,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Request date.
    #[validate(custom(function = "plausible_date"))]
    pub request_date: Option<Date>,
    /// Donation pathway.
    pub donation_pathway: String,
    /// Relationship of donor to recipient.
    pub relationship_of_donor_to_recipient: String,
    /// Recipient transplant centre name.
    pub recipient_transplant_centre_name: String,
    /// Donor abo group.
    pub donor_abo_group: String,
    /// Recipient abo group.
    pub recipient_abo_group: String,
    /// Urgent testing.
    pub urgent_testing: bool,
    /// Urgent testing reason.
    pub urgent_testing_reason: String,
    /// Transplant centre name.
    pub transplant_centre_name: String,
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
    /// Samples edta purple count.
    pub samples_edta_purple_count: Option<i32>,
    /// Samples edta pink hand labelled count.
    pub samples_edta_pink_hand_labelled_count: Option<i32>,
    /// Samples other description.
    pub samples_other_description: String,
    /// Laboratory donor identifier.
    pub laboratory_donor_identifier: String,
    /// Laboratory recipient identifier.
    pub laboratory_recipient_identifier: String,
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
            "INSERT INTO medical_renal_living_donor_requests (donor_id, recipient_id, \
            clinician_id, status, request_date, donation_pathway, \
            relationship_of_donor_to_recipient, recipient_transplant_centre_name, \
            donor_abo_group, recipient_abo_group, urgent_testing, urgent_testing_reason, \
            transplant_centre_name, requested_by_signed_at, \
            consent_and_identity_confirmed, sample_collector_name, sample_collected_at, \
            identifiers_on_sample_count, identifiers_on_form_count, \
            sample_and_form_details_match, samples_edta_purple_count, \
            samples_edta_pink_hand_labelled_count, samples_other_description, \
            laboratory_donor_identifier, laboratory_recipient_identifier, \
            laboratory_sample_number, laboratory_sample_received_at, \
            laboratory_identifiers_checked_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28) RETURNING *",
        )
        .bind(self.donor_id)
        .bind(self.recipient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.donation_pathway)
        .bind(&self.relationship_of_donor_to_recipient)
        .bind(&self.recipient_transplant_centre_name)
        .bind(&self.donor_abo_group)
        .bind(&self.recipient_abo_group)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(&self.transplant_centre_name)
        .bind(self.requested_by_signed_at)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.samples_edta_purple_count)
        .bind(self.samples_edta_pink_hand_labelled_count)
        .bind(&self.samples_other_description)
        .bind(&self.laboratory_donor_identifier)
        .bind(&self.laboratory_recipient_identifier)
        .bind(&self.laboratory_sample_number)
        .bind(self.laboratory_sample_received_at)
        .bind(&self.laboratory_identifiers_checked_by)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_renal_living_donor_requests SET donor_id = $2, recipient_id = \
            $3, clinician_id = $4, status = $5, request_date = $6, donation_pathway = \
            $7, relationship_of_donor_to_recipient = $8, \
            recipient_transplant_centre_name = $9, donor_abo_group = $10, \
            recipient_abo_group = $11, urgent_testing = $12, urgent_testing_reason = \
            $13, transplant_centre_name = $14, requested_by_signed_at = $15, \
            consent_and_identity_confirmed = $16, sample_collector_name = $17, \
            sample_collected_at = $18, identifiers_on_sample_count = $19, \
            identifiers_on_form_count = $20, sample_and_form_details_match = $21, \
            samples_edta_purple_count = $22, samples_edta_pink_hand_labelled_count = \
            $23, samples_other_description = $24, laboratory_donor_identifier = $25, \
            laboratory_recipient_identifier = $26, laboratory_sample_number = $27, \
            laboratory_sample_received_at = $28, laboratory_identifiers_checked_by = \
            $29, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.donor_id)
        .bind(self.recipient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.donation_pathway)
        .bind(&self.relationship_of_donor_to_recipient)
        .bind(&self.recipient_transplant_centre_name)
        .bind(&self.donor_abo_group)
        .bind(&self.recipient_abo_group)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(&self.transplant_centre_name)
        .bind(self.requested_by_signed_at)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.samples_edta_purple_count)
        .bind(self.samples_edta_pink_hand_labelled_count)
        .bind(&self.samples_other_description)
        .bind(&self.laboratory_donor_identifier)
        .bind(&self.laboratory_recipient_identifier)
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
        .prefix("api/medical-renal-living-donor-request/medical_renal_living_donor_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
