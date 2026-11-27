//! Hsct hla typing requests module.

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
    /// Subject id.
    pub subject_id: Uuid,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Request date.
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
    pub report_email: Option<String>,
    /// Recipient family name.
    pub recipient_family_name: String,
    /// Recipient given names.
    pub recipient_given_names: String,
    /// Recipient medical record number.
    pub recipient_medical_record_number: String,
    /// Recipient birth date.
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
/// Hsct hla typing requests.
pub type HsctHlaTypingRequests = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM hsct_hla_typing_requests WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM hsct_hla_typing_requests WHERE id = $1 AND deleted_at IS NULL")
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
        sqlx::query("WITH target AS (UPDATE hsct_hla_typing_requests SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE hsct_hla_typing_request_grades SET deleted_at = now(), \
            updated_at = now() WHERE request_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            hsct_hla_typing_request_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child3 AS (UPDATE hsct_hla_typing_request_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
