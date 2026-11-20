//! ss5_applications model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub application_date: Option<Date>,
    pub request_type: String,
    pub channel: String,
    pub previously_applied: String,
    pub name_change: String,
    pub name_change_reason: String,
    pub date_of_birth_correction: String,
    pub replacements_this_year: Option<i32>,
    pub replacements_lifetime: Option<i32>,
    pub limit_exception_reason: String,
    pub limit_exception_evidence: String,
    pub name_on_card: String,
    pub name_at_birth: String,
    pub other_names_used: String,
    pub name_on_most_recent_card: String,
    pub date_of_birth: Option<Date>,
    pub place_of_birth_city: String,
    pub place_of_birth_region: String,
    pub sex: String,
    pub citizenship: String,
    pub non_work_reason_valid: String,
    pub mother_name_at_birth: String,
    pub father_name: String,
    pub state_of_residence: String,
    pub mailing_address: String,
    pub phone: String,
    pub identity_document: String,
    pub identity_document_expired: String,
    pub age_document: String,
    pub citizenship_document: String,
    pub citizenship_on_file: String,
    pub name_change_document: String,
    pub documents_original_or_certified: String,
    pub signer_relationship: String,
    pub signer_name: String,
    pub signer_identity_document: String,
    pub signature_present: String,
    pub applicant_deceased: String,
    pub death_reported_to_ssa: String,
    pub preparer_note: String,
}

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM ss5_applications WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
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
        sqlx::query_as(
            "SELECT * FROM ss5_applications WHERE id = $1 AND \
            deleted_at IS NULL",
        )
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
        sqlx::query(
            "WITH target AS (UPDATE ss5_applications SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE ss5_application_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            ss5_application_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            ss5_application_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE ss5_application_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE ss5_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            ss5_application_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
