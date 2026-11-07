//! Neurodiversity-adjustment-review-grades domain model: transactional persist of the grade.

use serde::{Deserialize, Serialize};

use super::{
    neurodiversity_adjustment_review_grade_flags, neurodiversity_adjustment_review_grade_rules,
};
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
    /// Axis A — overall effectiveness band.
    pub effectiveness_band: String,
    /// Axis B — wellbeing risk band.
    pub wellbeing_risk_band: String,
    /// Axis C — review completeness percent (0–100).
    pub completeness_percent: Option<i32>,
    /// Axis D — next-step urgency.
    pub next_step_urgency: String,
    /// Axis D — target timeframe for the next step.
    pub target_timeframe: String,
    /// Overall recommendation.
    pub recommendation: String,
    /// Free-text sign-off notes from the manager or HR contact.
    pub manager_notes: String,
    /// Timestamp of the manager / HR electronic signature.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Timestamp when the engine last computed the grade.
    pub graded_at: DateTimeWithTimeZone,
    /// Foreign key to the parent review (unique, 1:1).
    pub neurodiversity_adjustment_review_id: Uuid,
}
/// Neurodiversity adjustment review grades entity alias.
pub type NeurodiversityAdjustmentReviewGrades = Model;

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
            "SELECT * FROM neurodiversity_adjustment_review_grades WHERE deleted_at IS \
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
            "SELECT * FROM neurodiversity_adjustment_review_grades WHERE id = $1 AND \
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
            "WITH target AS (UPDATE neurodiversity_adjustment_review_grades SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            neurodiversity_adjustment_review_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE neurodiversity_adjustment_review_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

impl Model {
    /// Transactionally persist a [`GradingResult`] for the given review.
    ///
    /// Idempotent: any pre-existing grade (and, via `ON DELETE CASCADE`, its
    /// rule and flag rows) for the review is deleted first, then a fresh grade
    /// row plus one row per fired rule and one row per flag are inserted inside
    /// a single transaction. Returns the persisted grade row.
    ///
    /// # Errors
    /// Returns a database error if any step of the transaction fails.
    pub async fn persist_grade(
        db: &PgPool,
        neurodiversity_adjustment_review_id: Uuid,
        grade: &GradingResult,
    ) -> sqlx::Result<Model> {
        let mut txn = db.begin().await?;

        // Idempotency: remove any prior grade for this review (cascade drops its
        // rule and flag rows).
        sqlx::query(
            "WITH target AS (UPDATE neurodiversity_adjustment_review_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_review_id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE neurodiversity_adjustment_review_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_review_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            neurodiversity_adjustment_review_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(neurodiversity_adjustment_review_id)
        .execute(&mut *txn)
        .await?;

        let now = Utc::now();

        let grade_row = sqlx::query_as::<_, Model>(
            "INSERT INTO neurodiversity_adjustment_review_grades (created_at, updated_at, \
        neurodiversity_adjustment_review_id, effectiveness_band, wellbeing_risk_band, \
        completeness_percent, next_step_urgency, target_timeframe, recommendation, \
        manager_notes, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
        RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(neurodiversity_adjustment_review_id)
        .bind(grade.effectiveness_band.clone())
        .bind(grade.wellbeing_risk_band.clone())
        .bind(Some(grade.completeness_percent))
        .bind(grade.next_step_urgency.clone())
        .bind(grade.target_timeframe.clone())
        .bind(grade.recommendation.clone())
        .bind(String::new())
        .bind(now)
        .fetch_one(&mut *txn)
        .await?;

        let grade_id = grade_row.id;

        // One row per fired rule (audit trail).
        for rule in &grade.fired_rules {
            sqlx::query_as::<_, neurodiversity_adjustment_review_grade_rules::Model>(
                "INSERT INTO neurodiversity_adjustment_review_grade_rules (created_at, updated_at, \
        neurodiversity_adjustment_review_grade_id, rule_id, axis, category, description) \
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
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

        // One row per compliance / risk flag.
        for flag in &grade.flags {
            sqlx::query_as::<_, neurodiversity_adjustment_review_grade_flags::Model>(
                "INSERT INTO neurodiversity_adjustment_review_grade_flags (created_at, updated_at, \
        neurodiversity_adjustment_review_grade_id, flag_id, category, priority, \
        description, suggested_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING \
        *",
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

/// Find the grade for a review, if one has been computed.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_for_review(
    db: &PgPool,
    neurodiversity_adjustment_review_id: Uuid,
) -> sqlx::Result<Option<Model>> {
    sqlx::query_as::<_, Model>(
        "SELECT * FROM neurodiversity_adjustment_review_grades WHERE \
            neurodiversity_adjustment_review_id = $1 AND deleted_at IS NULL",
    )
    .bind(neurodiversity_adjustment_review_id)
    .fetch_optional(db)
    .await
}
