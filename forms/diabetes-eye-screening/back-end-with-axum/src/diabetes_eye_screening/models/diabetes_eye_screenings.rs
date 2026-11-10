//! diabetes_eye_screenings model.

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
    pub grader_name: String,
    pub grader_role: String,
    pub graded_at: Option<Date>,
    pub image_captured_at: Option<Date>,
    pub imaging_media: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub diabetes_type: String,
    pub years_since_diagnosis: Option<f64>,
    pub previous_screen_date: Option<Date>,
    pub previous_screen_result: String,
    pub right_retinopathy_grade: String,
    pub right_maculopathy_grade: String,
    pub right_photocoagulation: String,
    pub right_ungradable: String,
    pub right_visual_acuity: String,
    pub left_retinopathy_grade: String,
    pub left_maculopathy_grade: String,
    pub left_photocoagulation: String,
    pub left_ungradable: String,
    pub left_visual_acuity: String,
    pub clinical_context: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

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
            "SELECT * FROM diabetes_eye_screenings WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
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
        sqlx::query_as("SELECT * FROM diabetes_eye_screenings WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE diabetes_eye_screenings SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE diabetes_eye_screening_grades SET deleted_at = now(), \
            updated_at = now() WHERE diabetes_eye_screening_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            diabetes_eye_screening_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE diabetes_eye_screening_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            diabetes_eye_screening_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE diabetes_eye_screening_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
