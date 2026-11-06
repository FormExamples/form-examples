//! Inpatient clinical note grades module.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Status.
    pub status: String,
    /// Completeness percent.
    pub completeness_percent: Option<i32>,
    /// Required component count.
    pub required_component_count: Option<i32>,
    /// Documented component count.
    pub documented_component_count: Option<i32>,
    /// Acuity band.
    pub acuity_band: String,
    /// Computed acuity band.
    pub computed_acuity_band: String,
    /// News2 total.
    pub news2_total: Option<i32>,
    /// Header documented.
    pub header_documented: String,
    /// Interval history documented.
    pub interval_history_documented: String,
    /// Observations documented.
    pub observations_documented: String,
    /// Examination documented.
    pub examination_documented: String,
    /// Investigations documented.
    pub investigations_documented: String,
    /// Problems documented.
    pub problems_documented: String,
    /// Medications documented.
    pub medications_documented: String,
    /// Risk assessments documented.
    pub risk_assessments_documented: String,
    /// Impression documented.
    pub impression_documented: String,
    /// Plan documented.
    pub plan_documented: String,
    /// Escalation documented.
    pub escalation_documented: String,
    /// Communication documented.
    pub communication_documented: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}
/// Inpatient clinical note grades.
pub type InpatientClinicalNoteGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM inpatient_clinical_note_grades ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM inpatient_clinical_note_grades")
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
        sqlx::query_as("SELECT * FROM inpatient_clinical_note_grades WHERE id = $1")
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
        sqlx::query("DELETE FROM inpatient_clinical_note_grades WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
