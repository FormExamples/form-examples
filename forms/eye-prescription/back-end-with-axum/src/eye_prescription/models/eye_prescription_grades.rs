//! Eye prescription grades module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Right eye sphere class.
    pub right_eye_sphere_class: String,
    /// Right eye cylinder class.
    pub right_eye_cylinder_class: String,
    /// Left eye sphere class.
    pub left_eye_sphere_class: String,
    /// Left eye cylinder class.
    pub left_eye_cylinder_class: String,
    /// Presbyopia class.
    pub presbyopia_class: String,
    /// Anisometropia diopters.
    pub anisometropia_diopters: Option<f64>,
    /// Anisometropia significant.
    pub anisometropia_significant: bool,
    /// Prism present.
    pub prism_present: bool,
    /// Computed complexity.
    pub computed_complexity: String,
    /// Final complexity.
    pub final_complexity: String,
    /// Override reason.
    pub override_reason: String,
    /// Follow up interval months.
    pub follow_up_interval_months: Option<i32>,
    /// Prescriber notes.
    pub prescriber_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}
/// Eye prescription grades.
pub type EyePrescriptionGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM eye_prescription_grades WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM eye_prescription_grades WHERE deleted_at IS NULL",
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
        sqlx::query_as("SELECT * FROM eye_prescription_grades WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE eye_prescription_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE eye_prescription_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE eye_prescription_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            eye_prescription_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE eye_prescription_grade_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
