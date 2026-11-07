//! pregnancy_ultrasound_test_requests model.

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
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub last_menstrual_period_date: Option<Date>,
    pub last_menstrual_period_reliability: String,
    pub estimated_due_date: Option<Date>,
    pub estimated_due_date_method: String,
    pub gestational_age_weeks: Option<i32>,
    pub gestational_age_days: Option<i32>,
    pub gravida: Option<i32>,
    pub para: Option<i32>,
    pub plurality: String,
    pub chorionicity: String,
    pub conception_method: String,
    pub rhesus_status: String,
    pub body_mass_index: Option<f64>,
    pub requested_scan_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub previous_scan_finding: String,
    pub previous_scan_date: Option<Date>,
    pub vaginal_bleeding: String,
    pub abdominal_pain: String,
    pub reduced_fetal_movements: bool,
    pub suspected_ectopic: bool,
    pub haemodynamically_unstable: bool,
    pub hypertension: bool,
    pub diabetes: bool,
    pub previous_growth_restriction: bool,
    pub previous_preterm_birth: bool,
    pub previous_caesarean: bool,
    pub smoker: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub interpreter_required: bool,
    pub notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
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
            "SELECT * FROM pregnancy_ultrasound_test_requests WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM pregnancy_ultrasound_test_requests WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM pregnancy_ultrasound_test_requests WHERE id = $1 AND \
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
            "WITH target AS (UPDATE pregnancy_ultrasound_test_requests SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE pregnancy_ultrasound_test_request_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            pregnancy_ultrasound_test_request_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            pregnancy_ultrasound_test_request_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE pregnancy_ultrasound_test_request_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE pregnancy_ultrasound_test_request_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE pregnancy_ultrasound_test_request_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
