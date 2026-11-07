//! organizations model.

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
    pub name: String,
    pub legal_name: String,
    pub sector: String,
    pub size_band: String,
    pub headcount: Option<i32>,
    pub country: String,
    pub region: String,
    pub website: String,
    pub notes: String,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM organizations WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM organizations WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE organizations SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            respondents SET deleted_at = now(), updated_at = now() WHERE organization_id \
            IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE agile_consulting_scorecard_for_hiring_helps SET deleted_at = now(), \
            updated_at = now() WHERE organization_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_helps SET deleted_at = now(), \
            updated_at = now() WHERE respondent_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_help_grades SET deleted_at = now(), \
            updated_at = now() WHERE agile_consulting_scorecard_for_hiring_help_id IN \
            (SELECT id FROM child2) AND deleted_at IS NULL RETURNING id), child5 AS \
            (UPDATE agile_consulting_scorecard_for_hiring_help_grades SET deleted_at = \
            now(), updated_at = now() WHERE \
            agile_consulting_scorecard_for_hiring_help_id IN (SELECT id FROM child3) AND \
            deleted_at IS NULL RETURNING id), child6 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_help_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE agile_consulting_scorecard_grade_id IN \
            (SELECT id FROM child4) AND deleted_at IS NULL RETURNING id), child7 AS \
            (UPDATE agile_consulting_scorecard_for_hiring_help_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE \
            agile_consulting_scorecard_grade_id IN (SELECT id FROM child4) AND \
            deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_help_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE agile_consulting_scorecard_grade_id IN \
            (SELECT id FROM child5) AND deleted_at IS NULL RETURNING id), child9 AS \
            (UPDATE agile_consulting_scorecard_for_hiring_help_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE \
            agile_consulting_scorecard_grade_id IN (SELECT id FROM child5) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
