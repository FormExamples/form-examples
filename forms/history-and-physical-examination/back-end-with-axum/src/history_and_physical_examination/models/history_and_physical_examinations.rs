//! history_and_physical_examinations model.

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
    pub clerked_at: Option<DateTimeWithTimeZone>,
    pub clinician_role: String,
    pub registration_number: String,
    pub care_setting: String,
    pub admission_source: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub presenting_complaint: String,
    pub history_of_presenting_complaint: String,
    pub past_medical_surgical_history: String,
    pub drug_history: String,
    pub allergy_status: String,
    pub allergy_detail: String,
    pub family_history: String,
    pub social_history: String,
    pub systems_review: String,
    pub temperature: Option<f64>,
    pub heart_rate: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub systolic_blood_pressure: Option<i32>,
    pub oxygen_saturation: Option<i32>,
    pub consciousness_level: String,
    pub exam_cardiovascular: String,
    pub exam_respiratory: String,
    pub exam_abdominal: String,
    pub exam_neurological: String,
    pub exam_other: String,
    pub investigations: String,
    pub impression: String,
    pub red_flag_findings: String,
    pub management_plan: String,
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
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM history_and_physical_examinations WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM history_and_physical_examinations WHERE deleted_at IS \
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
            "SELECT * FROM history_and_physical_examinations WHERE id = $1 AND deleted_at \
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
            "WITH target AS (UPDATE history_and_physical_examinations SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE history_and_physical_examination_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            history_and_physical_examination_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            history_and_physical_examination_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE history_and_physical_examination_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE history_and_physical_examination_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE history_and_physical_examination_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
