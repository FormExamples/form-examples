//! united_kingdom_council_tax_discount_applications model.

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
    pub applicant_id: Uuid,
    pub billing_authority_id: Option<Uuid>,
    pub claim_type: String,
    pub account_reference: String,
    pub application_date: Option<Date>,
    pub effective_date: Option<Date>,
    pub applicant_status: String,
    pub property_address_as_full_text: String,
    pub property_postcode: String,
    pub council_tax_band: String,
    pub main_residence: String,
    pub liable_role: String,
    pub other_occupants: String,
    pub smi_certificate: String,
    pub qualifying_benefit: String,
    pub student_certificate: String,
    pub student_course_months: Option<i32>,
    pub student_hours_per_week: Option<i32>,
    pub disability_adaptation: String,
    pub disabled_person_main_home: String,
    pub apprentice_declaration: String,
    pub care_leaver_proof: String,
    pub care_leaver_age_years: Option<i32>,
    pub evidence_notes: String,
    pub declared_true: String,
    pub agrees_to_report_changes: String,
    pub fraud_warning_acknowledged: String,
    pub declarant_name: String,
    pub declaration_date: Option<Date>,
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
            "SELECT * FROM united_kingdom_council_tax_discount_applications WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
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
        sqlx::query_as("SELECT * FROM united_kingdom_council_tax_discount_applications WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE united_kingdom_council_tax_discount_applications SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE occupants SET deleted_at = now(), updated_at = \
            now() WHERE united_kingdom_council_tax_discount_application_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_council_tax_discount_application_grades SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_council_tax_discount_application_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_kingdom_council_tax_discount_application_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_council_tax_discount_application_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            united_kingdom_council_tax_discount_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_council_tax_discount_application_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
