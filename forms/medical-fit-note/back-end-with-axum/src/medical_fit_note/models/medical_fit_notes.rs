//! Medical fit notes module.

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
    /// Status.
    pub status: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// Assessment method.
    pub assessment_method: String,
    /// Diagnosis primary.
    pub diagnosis_primary: String,
    /// Diagnosis additional.
    pub diagnosis_additional: String,
    /// Fitness advice.
    pub fitness_advice: String,
    /// Period from.
    pub period_from: Option<Date>,
    /// Period to.
    pub period_to: Option<Date>,
    /// Period duration days.
    pub period_duration_days: Option<i32>,
    /// Reassessment required.
    pub reassessment_required: String,
    /// Adjustment phased return.
    pub adjustment_phased_return: String,
    /// Adjustment altered hours.
    pub adjustment_altered_hours: String,
    /// Adjustment amended duties.
    pub adjustment_amended_duties: String,
    /// Adjustment workplace adaptations.
    pub adjustment_workplace_adaptations: String,
    /// Functional effects.
    pub functional_effects: String,
    /// Comments.
    pub comments: String,
    /// Employee consent to share.
    pub employee_consent_to_share: String,
    /// Clinician declaration.
    pub clinician_declaration: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Employee ID.
    pub employee_id: Uuid,
    /// Clinician ID.
    pub clinician_id: Uuid,
}
/// Medical fit notes.
pub type MedicalFitNotes = Model;

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
            "SELECT * FROM medical_fit_notes WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
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
        sqlx::query_as("SELECT * FROM medical_fit_notes WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE medical_fit_notes SET deleted_at = now(), updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS \
            (UPDATE medical_fit_note_grades SET deleted_at = now(), updated_at = now() \
            WHERE medical_fit_note_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE medical_fit_note_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            medical_fit_note_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE medical_fit_note_grade_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
