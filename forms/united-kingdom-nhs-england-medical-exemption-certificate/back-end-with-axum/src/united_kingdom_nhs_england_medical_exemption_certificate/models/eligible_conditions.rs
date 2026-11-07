//! Eligible conditions module.

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
    /// Code.
    pub code: String,
    /// Label.
    pub label: String,
    /// Description.
    pub description: String,
    /// Requires appliance detail.
    pub requires_appliance_detail: String,
    /// Requires substitution therapy detail.
    pub requires_substitution_therapy_detail: String,
    /// Requires disability attestation.
    pub requires_disability_attestation: String,
    /// Requires cancer detail.
    pub requires_cancer_detail: String,
    /// Excludes diet only diabetes.
    pub excludes_diet_only_diabetes: String,
    /// Snomed ct reference.
    pub snomed_ct_reference: String,
    /// Icd10 reference.
    pub icd10_reference: String,
}
/// Eligible conditions.
pub type EligibleConditions = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM eligible_conditions WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM eligible_conditions WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM eligible_conditions WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE eligible_conditions SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE application_eligible_conditions SET deleted_at = now(), \
            updated_at = now() WHERE eligible_condition_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
