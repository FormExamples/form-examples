//! united_kingdom_marriage_certificate_applications model.

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
    pub notice_type: String,
    pub notice_date: Option<Date>,
    pub registration_district: String,
    pub notice_given_together: String,
    pub ceremony_type: String,
    pub ceremony_date: Option<Date>,
    pub venue_name: String,
    pub venue_confirmed: String,
    pub closely_related: String,
    pub witness_count: Option<i32>,
    pub party_one_name: String,
    pub party_one_date_of_birth: Option<Date>,
    pub party_one_days_resident_in_district: Option<i32>,
    pub party_one_nationality_status: String,
    pub party_one_marital_status: String,
    pub party_one_identity_provided: String,
    pub party_one_address_proof_provided: String,
    pub party_one_prior_end_evidence_provided: String,
    pub party_one_immigration_evidence_provided: String,
    pub party_two_name: String,
    pub party_two_date_of_birth: Option<Date>,
    pub party_two_days_resident_in_district: Option<i32>,
    pub party_two_nationality_status: String,
    pub party_two_marital_status: String,
    pub party_two_identity_provided: String,
    pub party_two_address_proof_provided: String,
    pub party_two_prior_end_evidence_provided: String,
    pub party_two_immigration_evidence_provided: String,
    pub certificate_copies: Option<i32>,
    pub certificate_service: String,
    pub gro_index_reference: String,
    pub applicant_note: String,
    pub applicant_id: Uuid,
    pub registrar_id: Option<Uuid>,
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
            "SELECT * FROM united_kingdom_marriage_certificate_applications WHERE deleted_at IS \
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
            "SELECT * FROM united_kingdom_marriage_certificate_applications WHERE id = $1 AND \
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
            "WITH target AS (UPDATE united_kingdom_marriage_certificate_applications SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_kingdom_marriage_certificate_application_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_marriage_certificate_application_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_marriage_certificate_application_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_marriage_certificate_application_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_kingdom_marriage_certificate_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_marriage_certificate_application_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
