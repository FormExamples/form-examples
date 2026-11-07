//! emergency_department_triage_notes model.

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
    pub nurse_name: String,
    pub triaged_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub arrival_mode: String,
    pub arrived_at: Option<DateTimeWithTimeZone>,
    pub referral_source: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub presenting_complaint: String,
    pub brief_history: String,
    pub symptom_onset: String,
    pub respiratory_rate: Option<i32>,
    pub spo2: Option<i32>,
    pub on_oxygen: String,
    pub systolic_bp: Option<i32>,
    pub pulse: Option<i32>,
    pub consciousness_acvpu: String,
    pub temperature: Option<f64>,
    pub glasgow_coma_scale: Option<i32>,
    pub pain_score: Option<i32>,
    pub airway_threat: String,
    pub breathing_inadequate: String,
    pub circulation_shock: String,
    pub haemorrhage_major: String,
    pub consciousness_reduced: String,
    pub seizure_active: String,
    pub focal_neurology: String,
    pub sepsis_features: String,
    pub chest_pain_cardiac: String,
    pub stroke_features: String,
    pub paediatric_red_flag: String,
    pub clinical_notes: String,
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
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM emergency_department_triage_notes WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM emergency_department_triage_notes WHERE deleted_at IS \
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
            "SELECT * FROM emergency_department_triage_notes WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "WITH target AS (UPDATE emergency_department_triage_notes SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE emergency_department_triage_note_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            emergency_department_triage_note_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            emergency_department_triage_note_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE emergency_department_triage_note_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE emergency_department_triage_note_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE emergency_department_triage_note_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
