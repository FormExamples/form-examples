//! architectures model.

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
    pub version: String,
    pub owner: String,
    pub status: String,
    pub description: String,
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
            "SELECT * FROM architectures WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM architectures WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM architectures WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE architectures SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            arc42_documentations SET deleted_at = now(), updated_at = now() WHERE \
            architecture_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE business_goals SET deleted_at = now(), updated_at = \
            now() WHERE arc42_documentation_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child3 AS (UPDATE quality_goals SET deleted_at = \
            now(), updated_at = now() WHERE arc42_documentation_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE stakeholders \
            SET deleted_at = now(), updated_at = now() WHERE arc42_documentation_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child5 AS \
            (UPDATE constraint_items SET deleted_at = now(), updated_at = now() WHERE \
            arc42_documentation_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child6 AS (UPDATE context_partners SET deleted_at = now(), \
            updated_at = now() WHERE arc42_documentation_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child7 AS (UPDATE technology_decisions \
            SET deleted_at = now(), updated_at = now() WHERE arc42_documentation_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child8 AS \
            (UPDATE building_blocks SET deleted_at = now(), updated_at = now() WHERE \
            arc42_documentation_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child9 AS (UPDATE runtime_scenarios SET deleted_at = now(), \
            updated_at = now() WHERE arc42_documentation_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child10 AS (UPDATE deployment_nodes \
            SET deleted_at = now(), updated_at = now() WHERE arc42_documentation_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child11 AS \
            (UPDATE architectural_decisions SET deleted_at = now(), updated_at = now() \
            WHERE arc42_documentation_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child12 AS (UPDATE quality_scenarios SET deleted_at = \
            now(), updated_at = now() WHERE arc42_documentation_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child13 AS (UPDATE risk_items \
            SET deleted_at = now(), updated_at = now() WHERE arc42_documentation_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child14 AS \
            (UPDATE glossary_terms SET deleted_at = now(), updated_at = now() WHERE \
            arc42_documentation_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child15 AS (UPDATE arc42_documentation_grades SET deleted_at \
            = now(), updated_at = now() WHERE arc42_documentation_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child16 AS (UPDATE \
            arc42_documentation_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE arc42_documentation_grade_id IN (SELECT id FROM child15) AND \
            deleted_at IS NULL RETURNING id), child17 AS (UPDATE \
            arc42_documentation_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE arc42_documentation_grade_id IN (SELECT id FROM child15) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
