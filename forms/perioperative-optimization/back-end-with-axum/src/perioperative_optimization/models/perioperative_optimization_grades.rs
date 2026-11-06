//! perioperative_optimization_grades model.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub weeks_to_surgery: Option<i32>,
    pub gating_applied: bool,
    pub must_score: Option<i32>,
    pub must_risk: String,
    pub audit_c_score: Option<i32>,
    pub stop_bang_score: Option<i32>,
    pub duke_activity_status_index: Option<f64>,
    pub clinical_frailty_scale: Option<i32>,
    pub fried_phenotype_score: Option<i32>,
    pub fried_frailty_category: String,
    pub domains_optimized: Option<i32>,
    pub domains_in_progress: Option<i32>,
    pub domains_action_required: Option<i32>,
    pub domains_insufficient_time: Option<i32>,
    pub computed_readiness: String,
    pub final_readiness: String,
    pub override_reason: String,
    pub gate_decision: String,
    pub recommended_earliest_surgery_date: Option<Date>,
    pub clinician_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
    pub perioperative_optimization_id: Uuid,
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
            "SELECT * FROM perioperative_optimization_grades ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM perioperative_optimization_grades")
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
        sqlx::query_as("SELECT * FROM perioperative_optimization_grades WHERE id = $1")
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
        sqlx::query("DELETE FROM perioperative_optimization_grades WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
