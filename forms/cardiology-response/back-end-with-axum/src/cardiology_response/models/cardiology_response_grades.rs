//! Cardiology-response-grades domain model: transactional persist of the grade.

use serde::{Deserialize, Serialize};

use super::{cardiology_response_grade_flags, cardiology_response_grade_rules};
use crate::engine::types::GradingResult;
use crate::support::prelude::*;
use chrono::Utc;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at (soft-delete).
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Axis A — overall classification.
    pub response_classification: String,
    /// Axis B — condition severity.
    pub severity: String,
    /// Axis B — structured-finding category label.
    pub severity_category: String,
    /// Axis C — response completeness percent (0-100).
    pub completeness_percent: Option<i32>,
    /// Axis D — follow-up urgency.
    pub follow_up_urgency: String,
    /// Axis D — target timeframe.
    pub target_timeframe: String,
    /// Axis D — concise recommended action.
    pub recommended_action: String,
    /// Overall recommendation.
    pub recommendation: String,
    /// Free-text interpretation / sign-off notes.
    pub clinician_notes: String,
    /// Timestamp of the responding clinician electronic signature.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Timestamp when the engine last computed the grade.
    pub graded_at: DateTimeWithTimeZone,
    /// Foreign key to the parent response (unique, 1:1).
    pub cardiology_response_id: Uuid,
}
/// Cardiology response grades entity alias.
pub type CardiologyResponseGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM cardiology_response_grades WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM cardiology_response_grades WHERE deleted_at IS NULL",
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
            "SELECT * FROM cardiology_response_grades WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE cardiology_response_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE cardiology_response_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE cardiology_response_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            cardiology_response_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE cardiology_response_grade_id IN (SELECT id FROM target) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

impl Model {
    /// Transactionally persist a [`GradingResult`] for the given response.
    ///
    /// Idempotent: any pre-existing grade (and, via `ON DELETE CASCADE`, its
    /// rule and flag rows) for the response is deleted first, then a fresh
    /// grade row plus one row per fired rule and one row per flag are inserted
    /// inside a single transaction. Returns the persisted grade row.
    ///
    /// # Errors
    /// Returns a database error if any step of the transaction fails.
    pub async fn persist_grade(
        db: &PgPool,
        cardiology_response_id: Uuid,
        grade: &GradingResult,
    ) -> sqlx::Result<Model> {
        let mut txn = db.begin().await?;

        // Idempotency: remove any prior grade for this response (cascade drops
        // its rule and flag rows).
        sqlx::query(
            "WITH target AS (UPDATE cardiology_response_grades SET deleted_at = now(), \
            updated_at = now() WHERE cardiology_response_id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE cardiology_response_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE cardiology_response_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE cardiology_response_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE cardiology_response_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(cardiology_response_id)
        .execute(&mut *txn)
        .await?;

        let now = Utc::now();

        let grade_row = sqlx::query_as::<_, Model>(
            "INSERT INTO cardiology_response_grades (created_at, updated_at, \
        cardiology_response_id, response_classification, severity, severity_category, \
        completeness_percent, follow_up_urgency, target_timeframe, recommended_action, \
        recommendation, clinician_notes, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
        $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(cardiology_response_id)
        .bind(grade.response_classification.clone())
        .bind(grade.severity.clone())
        .bind(grade.severity_category.clone())
        .bind(Some(grade.completeness_percent))
        .bind(grade.follow_up_urgency.clone())
        .bind(grade.target_timeframe.clone())
        .bind(grade.recommended_action.clone())
        .bind(grade.recommendation.clone())
        .bind(String::new())
        .bind(now)
        .fetch_one(&mut *txn)
        .await?;

        let grade_id = grade_row.id;

        // One row per fired rule (audit trail).
        for rule in &grade.fired_rules {
            sqlx::query_as::<_, cardiology_response_grade_rules::Model>(
                "INSERT INTO cardiology_response_grade_rules (created_at, updated_at, \
        cardiology_response_grade_id, rule_id, axis, category, description) VALUES ($1, \
        $2, $3, $4, $5, $6, $7) RETURNING *",
            )
            .bind(now)
            .bind(now)
            .bind(grade_id)
            .bind(rule.rule_id.clone())
            .bind(rule.axis.clone())
            .bind(rule.category.clone())
            .bind(rule.description.clone())
            .fetch_one(&mut *txn)
            .await?;
        }

        // One row per safety flag.
        for flag in &grade.flags {
            sqlx::query_as::<_, cardiology_response_grade_flags::Model>(
                "INSERT INTO cardiology_response_grade_flags (created_at, updated_at, \
        cardiology_response_grade_id, flag_id, category, priority, description, \
        suggested_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            )
            .bind(now)
            .bind(now)
            .bind(grade_id)
            .bind(flag.flag_id.clone())
            .bind(flag.category.clone())
            .bind(flag.priority.clone())
            .bind(flag.description.clone())
            .bind(flag.suggested_action.clone())
            .fetch_one(&mut *txn)
            .await?;
        }

        txn.commit().await?;
        Ok(grade_row)
    }
}

/// Find the grade for a response, if one has been computed.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_for_response(
    db: &PgPool,
    cardiology_response_id: Uuid,
) -> sqlx::Result<Option<Model>> {
    sqlx::query_as::<_, Model>(
        "SELECT * FROM cardiology_response_grades WHERE cardiology_response_id = $1 \
            AND deleted_at IS NULL",
    )
    .bind(cardiology_response_id)
    .fetch_optional(db)
    .await
}
