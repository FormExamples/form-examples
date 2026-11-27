//! Medical renal transplant recipient requests module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Patient id.
    pub patient_id: Uuid,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Request date.
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
/// Medical renal transplant recipient requests.
pub type MedicalRenalTransplantRecipientRequests = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM medical_renal_transplant_recipient_requests WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM medical_renal_transplant_recipient_requests WHERE id = $1 AND \
            deleted_at IS NULL")
            .bind(id)
            .fetch_optional(db)
            .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query("WITH target AS (UPDATE medical_renal_transplant_recipient_requests SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            medical_renal_transplant_recipient_request_tests SET deleted_at = now(), \
            updated_at = now() WHERE request_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            medical_renal_transplant_recipient_request_grades SET deleted_at = now(), \
            updated_at = now() WHERE request_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            medical_renal_transplant_recipient_request_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE grade_id IN (SELECT id FROM child2) AND \
            deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            medical_renal_transplant_recipient_request_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE grade_id IN (SELECT id FROM child2) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
