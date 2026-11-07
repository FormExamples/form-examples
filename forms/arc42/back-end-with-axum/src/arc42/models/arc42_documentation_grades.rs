//! Arc42 documentation grades module.

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
    /// Arc42 documentation id.
    pub arc42_documentation_id: Uuid,
    /// Computed maturity.
    pub computed_maturity: String,
    /// Final maturity.
    pub final_maturity: String,
    /// Override reason.
    pub override_reason: String,
    /// Completeness section 1.
    pub completeness_section_1: String,
    /// Completeness section 2.
    pub completeness_section_2: String,
    /// Completeness section 3.
    pub completeness_section_3: String,
    /// Completeness section 4.
    pub completeness_section_4: String,
    /// Completeness section 5.
    pub completeness_section_5: String,
    /// Completeness section 6.
    pub completeness_section_6: String,
    /// Completeness section 7.
    pub completeness_section_7: String,
    /// Completeness section 8.
    pub completeness_section_8: String,
    /// Completeness section 9.
    pub completeness_section_9: String,
    /// Completeness section 10.
    pub completeness_section_10: String,
    /// Completeness section 11.
    pub completeness_section_11: String,
    /// Completeness section 12.
    pub completeness_section_12: String,
}
/// Arc42 documentation grades.
pub type Arc42DocumentationGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM arc42_documentation_grades WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM arc42_documentation_grades WHERE deleted_at IS NULL",
        )
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
        sqlx::query_as(
            "SELECT * FROM arc42_documentation_grades WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE arc42_documentation_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE arc42_documentation_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE arc42_documentation_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            arc42_documentation_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE arc42_documentation_grade_id IN (SELECT id FROM target) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
