//! Suppliers module.

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
    /// Name.
    pub name: String,
    /// Trading name.
    pub trading_name: String,
    /// Company registration number.
    pub company_registration_number: String,
    /// Country of registration as iso 3166 1 alpha 2.
    pub country_of_registration_as_iso_3166_1_alpha_2: Option<String>,
    /// Ico registration number.
    pub ico_registration_number: String,
    /// Website.
    pub website: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: Option<String>,
    /// Postcode.
    pub postcode: Option<String>,
    /// Contact name.
    pub contact_name: String,
    /// Contact email.
    pub contact_email: Option<String>,
    /// Contact phone.
    pub contact_phone: Option<String>,
}
/// Suppliers.
pub type Suppliers = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM suppliers WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET \
            $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM suppliers WHERE deleted_at IS NULL")
            .fetch_one(db)
            .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM suppliers WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE suppliers SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            products SET deleted_at = now(), updated_at = now() WHERE supplier_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE uk_nhs_digital_technology_assessment_criteria SET deleted_at = \
            now(), updated_at = now() WHERE supplier_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria SET deleted_at = now(), \
            updated_at = now() WHERE product_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grades SET deleted_at = now(), \
            updated_at = now() WHERE uk_nhs_digital_technology_assessment_criteria_id IN \
            (SELECT id FROM child2) AND deleted_at IS NULL RETURNING id), child5 AS \
            (UPDATE uk_nhs_digital_technology_assessment_criteria_grades SET deleted_at \
            = now(), updated_at = now() WHERE \
            uk_nhs_digital_technology_assessment_criteria_id IN (SELECT id FROM child3) \
            AND deleted_at IS NULL RETURNING id), child6 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE grade_id IN (SELECT id FROM child4) AND \
            deleted_at IS NULL RETURNING id), child7 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            uk_nhs_digital_technology_assessment_criteria_grade_id IN (SELECT id FROM \
            child4) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE grade_id IN (SELECT id FROM child5) AND \
            deleted_at IS NULL RETURNING id), child9 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            uk_nhs_digital_technology_assessment_criteria_grade_id IN (SELECT id FROM \
            child5) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
