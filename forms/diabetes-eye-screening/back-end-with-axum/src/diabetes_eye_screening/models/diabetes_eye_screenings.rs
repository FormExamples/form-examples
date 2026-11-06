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
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows =
            sqlx::query_as("SELECT * FROM diabetes_eye_screenings ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM diabetes_eye_screenings")
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
        sqlx::query_as("SELECT * FROM diabetes_eye_screenings WHERE id = $1")
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
        sqlx::query("DELETE FROM diabetes_eye_screenings WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
