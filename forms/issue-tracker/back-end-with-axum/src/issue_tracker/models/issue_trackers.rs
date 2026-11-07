//! issue_trackers model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub status: String,
    pub reported_at: DateTimeWithTimeZone,
    pub discovered_at: Option<DateTimeWithTimeZone>,
    pub started_at: Option<DateTimeWithTimeZone>,
    pub resolved_at: Option<DateTimeWithTimeZone>,
    pub issue_category: String,
    pub environment: String,
    pub system_name: String,
    pub component: String,
    pub customer_or_project_tag: String,
    pub external_reference: String,
    pub cc_summary: String,
    pub cc_long_description: String,
    pub cc_reported_by_name: String,
    pub cc_reported_via: String,
    pub pt_discoverer_name: String,
    pub pt_affected_users_count: Option<i32>,
    pub pt_affected_user_groups: String,
    pub pt_assignees: String,
    pub pt_stakeholders_to_inform: String,
    pub pt_observers: String,
    pub sx_external_signals: String,
    pub sx_alert_ids: String,
    pub sx_error_messages: String,
    pub sx_screenshots_url: String,
    pub sx_logs_url: String,
    pub sx_first_observed_at: Option<DateTimeWithTimeZone>,
    pub fx_broken_components: String,
    pub fx_failed_services: String,
    pub fx_stuck_processes: String,
    pub fx_hardware_faults: String,
    pub fx_data_corruption: String,
    pub hx_related_issues: String,
    pub hx_prior_occurrences: Option<i32>,
    pub hx_recent_change_url: String,
    pub hx_references: String,
    pub hx_timeline: String,
    pub ix_hypotheses: String,
    pub ix_repro_steps: String,
    pub ix_diagnostic_queries: String,
    pub ix_tests_run: String,
    pub ix_blocking_unknowns: String,
    pub dx_root_cause: String,
    pub dx_contributing_causes: String,
    pub dx_scope: String,
    pub dx_confirmed: String,
    pub tx_mitigation_steps: String,
    pub tx_fix_plan: String,
    pub tx_workaround: String,
    pub tx_rollback_plan: String,
    pub tx_communication_plan: String,
    pub px_expected_resolution_at: Option<DateTimeWithTimeZone>,
    pub px_residual_risk: String,
    pub px_monitoring_plan: String,
    pub px_recurrence_likelihood: String,
    pub px_lessons_learned: String,
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<i32>,
    pub score_by_magnitude_of_damage: Option<i32>,
    pub score_by_harm_grade: Option<i32>,
    pub score_by_failure_condition: String,
    pub score_by_moscow_requirement: Option<i32>,
    pub score_by_frequency_percent: Option<f64>,
    pub reporter_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM issue_trackers WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM issue_trackers WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM issue_trackers WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE issue_trackers SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            issue_tracker_grades SET deleted_at = now(), updated_at = now() WHERE \
            issue_tracker_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE issue_tracker_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE issue_tracker_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            issue_tracker_grade_flags SET deleted_at = now(), updated_at = now() WHERE \
            issue_tracker_grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
