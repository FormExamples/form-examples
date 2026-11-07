//! Medical operation note grades module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Computed composite risk.
    pub computed_composite_risk: String,
    /// Final composite risk.
    pub final_composite_risk: String,
    /// Override reason.
    pub override_reason: String,
    /// Worst clavien dindo grade.
    pub worst_clavien_dindo_grade: String,
    /// Asa physical status.
    pub asa_physical_status: String,
    /// Blood loss band.
    pub blood_loss_band: String,
    /// Counts agreed.
    pub counts_agreed: String,
    /// Never event suspected.
    pub never_event_suspected: String,
    /// Recommendation.
    pub recommendation: String,
    /// Surgeon notes.
    pub surgeon_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
}
/// Medical operation note grades.
pub type MedicalOperationNoteGrades = Model;

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
            "SELECT * FROM medical_operation_note_grades WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM medical_operation_note_grades WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE medical_operation_note_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE medical_operation_note_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE medical_operation_note_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            medical_operation_note_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE medical_operation_note_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
