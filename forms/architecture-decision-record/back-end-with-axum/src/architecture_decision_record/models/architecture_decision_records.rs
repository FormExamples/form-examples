//! Architecture decision records module.

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
    /// Slug.
    pub slug: String,
    /// Number.
    pub number: Option<i32>,
    /// Title.
    pub title: String,
    /// Decision date.
    pub decision_date: Option<Date>,
    /// Status.
    pub status: String,
    /// Decision group.
    pub decision_group: String,
    /// Issue.
    pub issue: String,
    /// Decision.
    pub decision: String,
    /// Assumptions.
    pub assumptions: String,
    /// Constraints.
    pub constraints: String,
    /// Argument.
    pub argument: String,
    /// Implications.
    pub implications: String,
    /// Related decisions.
    pub related_decisions: String,
    /// Related requirements.
    pub related_requirements: String,
    /// Related artifacts.
    pub related_artifacts: String,
    /// Related principles.
    pub related_principles: String,
    /// Signed off by.
    pub signed_off_by: String,
    /// Signed off at.
    pub signed_off_at: Option<DateTimeWithTimeZone>,
    /// Author ID.
    pub author_id: Option<Uuid>,
    /// Organization ID.
    pub organization_id: Option<Uuid>,
}
/// Architecture decision records.
pub type ArchitectureDecisionRecords = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM architecture_decision_records WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM architecture_decision_records WHERE deleted_at IS NULL",
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
            "SELECT * FROM architecture_decision_records WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE architecture_decision_records SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE architecture_decision_record_positions SET deleted_at = \
            now(), updated_at = now() WHERE architecture_decision_record_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            architecture_decision_record_notes SET deleted_at = now(), updated_at = \
            now() WHERE architecture_decision_record_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
