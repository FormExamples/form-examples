//! Medical renal transplant recipient request module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_renal_transplant_recipient_requests::Model;
use crate::support::validation::{plausible_date, unprocessable};

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
    /// Organ required.
    pub organ_required: String,
    /// Previous transplant count.
    pub previous_transplant_count: Option<i32>,
    /// Previous transplant dates.
    pub previous_transplant_dates: String,
    /// Transfusion count.
    pub transfusion_count: Option<i32>,
    /// Transfusion dates.
    pub transfusion_dates: String,
    /// Pregnancy count.
    pub pregnancy_count: Option<i32>,
    /// Pregnancy dates.
    pub pregnancy_dates: String,
    /// Autoimmune disease.
    pub autoimmune_disease: bool,
    /// Virology risk.
    pub virology_risk: bool,
    /// Immunosuppression.
    pub immunosuppression: String,
    /// Clinical information.
    pub clinical_information: String,
    /// Recipient abo group.
    pub recipient_abo_group: String,
    /// Dialysis mode.
    pub dialysis_mode: String,
    /// Dialysis unit name.
    pub dialysis_unit_name: String,
    /// Urgent testing.
    pub urgent_testing: bool,
    /// Urgent testing reason.
    pub urgent_testing_reason: String,
    /// Dfpp status.
    pub dfpp_status: String,
    /// Post transfusion dates and number.
    pub post_transfusion_dates_and_number: String,
    /// Donor reference.
    pub donor_reference: String,
    /// Requested by signed at.
    pub requested_by_signed_at: Option<DateTimeWithTimeZone>,
    /// Transplant centre name.
    pub transplant_centre_name: String,
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
    /// Samples serum count.
    pub samples_serum_count: Option<i32>,
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
            "INSERT INTO medical_renal_transplant_recipient_requests (patient_id, \
            clinician_id, status, request_date, organ_required, \
            previous_transplant_count, previous_transplant_dates, transfusion_count, \
            transfusion_dates, pregnancy_count, pregnancy_dates, autoimmune_disease, \
            virology_risk, immunosuppression, clinical_information, recipient_abo_group, \
            dialysis_mode, dialysis_unit_name, urgent_testing, urgent_testing_reason, \
            dfpp_status, post_transfusion_dates_and_number, donor_reference, \
            requested_by_signed_at, transplant_centre_name, \
            consent_and_identity_confirmed, sample_collector_name, sample_collected_at, \
            identifiers_on_sample_count, identifiers_on_form_count, \
            sample_and_form_details_match, samples_edta_purple_count, \
            samples_edta_pink_hand_labelled_count, samples_serum_count, \
            samples_other_description, laboratory_donor_identifier, \
            laboratory_recipient_identifier, laboratory_sample_number, \
            laboratory_sample_received_at, laboratory_identifiers_checked_by) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36, $37, $38, $39, $40) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.organ_required)
        .bind(self.previous_transplant_count)
        .bind(&self.previous_transplant_dates)
        .bind(self.transfusion_count)
        .bind(&self.transfusion_dates)
        .bind(self.pregnancy_count)
        .bind(&self.pregnancy_dates)
        .bind(self.autoimmune_disease)
        .bind(self.virology_risk)
        .bind(&self.immunosuppression)
        .bind(&self.clinical_information)
        .bind(&self.recipient_abo_group)
        .bind(&self.dialysis_mode)
        .bind(&self.dialysis_unit_name)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(&self.dfpp_status)
        .bind(&self.post_transfusion_dates_and_number)
        .bind(&self.donor_reference)
        .bind(self.requested_by_signed_at)
        .bind(&self.transplant_centre_name)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.samples_edta_purple_count)
        .bind(self.samples_edta_pink_hand_labelled_count)
        .bind(self.samples_serum_count)
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
            "UPDATE medical_renal_transplant_recipient_requests SET patient_id = $2, \
            clinician_id = $3, status = $4, request_date = $5, organ_required = $6, \
            previous_transplant_count = $7, previous_transplant_dates = $8, \
            transfusion_count = $9, transfusion_dates = $10, pregnancy_count = $11, \
            pregnancy_dates = $12, autoimmune_disease = $13, virology_risk = $14, \
            immunosuppression = $15, clinical_information = $16, recipient_abo_group = \
            $17, dialysis_mode = $18, dialysis_unit_name = $19, urgent_testing = $20, \
            urgent_testing_reason = $21, dfpp_status = $22, \
            post_transfusion_dates_and_number = $23, donor_reference = $24, \
            requested_by_signed_at = $25, transplant_centre_name = $26, \
            consent_and_identity_confirmed = $27, sample_collector_name = $28, \
            sample_collected_at = $29, identifiers_on_sample_count = $30, \
            identifiers_on_form_count = $31, sample_and_form_details_match = $32, \
            samples_edta_purple_count = $33, samples_edta_pink_hand_labelled_count = \
            $34, samples_serum_count = $35, samples_other_description = $36, \
            laboratory_donor_identifier = $37, laboratory_recipient_identifier = $38, \
            laboratory_sample_number = $39, laboratory_sample_received_at = $40, \
            laboratory_identifiers_checked_by = $41, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.request_date)
        .bind(&self.organ_required)
        .bind(self.previous_transplant_count)
        .bind(&self.previous_transplant_dates)
        .bind(self.transfusion_count)
        .bind(&self.transfusion_dates)
        .bind(self.pregnancy_count)
        .bind(&self.pregnancy_dates)
        .bind(self.autoimmune_disease)
        .bind(self.virology_risk)
        .bind(&self.immunosuppression)
        .bind(&self.clinical_information)
        .bind(&self.recipient_abo_group)
        .bind(&self.dialysis_mode)
        .bind(&self.dialysis_unit_name)
        .bind(self.urgent_testing)
        .bind(&self.urgent_testing_reason)
        .bind(&self.dfpp_status)
        .bind(&self.post_transfusion_dates_and_number)
        .bind(&self.donor_reference)
        .bind(self.requested_by_signed_at)
        .bind(&self.transplant_centre_name)
        .bind(self.consent_and_identity_confirmed)
        .bind(&self.sample_collector_name)
        .bind(self.sample_collected_at)
        .bind(self.identifiers_on_sample_count)
        .bind(self.identifiers_on_form_count)
        .bind(self.sample_and_form_details_match)
        .bind(self.samples_edta_purple_count)
        .bind(self.samples_edta_pink_hand_labelled_count)
        .bind(self.samples_serum_count)
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
        .prefix("api/medical-renal-transplant-recipient-request/medical_renal_transplant_recipient_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
