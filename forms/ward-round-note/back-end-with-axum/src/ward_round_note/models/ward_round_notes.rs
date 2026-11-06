//! ward_round_notes model.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub clinician_name: String,
    pub clinician_grade: String,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub ward: String,
    pub patient_identifier: String,
    pub admission_date: Option<Date>,
    pub primary_diagnosis: String,
    pub overnight_events: String,
    pub no_overnight_events: String,
    pub problem_list: String,
    pub examination_summary: String,
    pub news2_total: Option<i32>,
    pub news2_single_param_three: String,
    pub observation_trend: String,
    pub investigations_reviewed: String,
    pub no_investigations_outstanding: String,
    pub abnormal_result_flagged: String,
    pub abnormal_result_actioned: String,
    pub vte_status: String,
    pub vte_prophylaxis_in_place: String,
    pub medication_changes: String,
    pub no_medication_changes: String,
    pub plan_and_jobs: String,
    pub escalation_status: String,
    pub senior_review_present: String,
    pub estimated_discharge_date: Option<Date>,
    pub discharge_not_estimable: String,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM ward_round_notes ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM ward_round_notes")
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
        sqlx::query_as("SELECT * FROM ward_round_notes WHERE id = $1")
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
        sqlx::query("DELETE FROM ward_round_notes WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
