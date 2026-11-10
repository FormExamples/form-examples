//! soap_notes model.

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
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub encountered_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub encounter_type: String,
    pub clinician_role: String,
    pub patient_identifier: String,
    pub presenting_complaint: String,
    pub history_of_presenting_complaint: String,
    pub patient_reported_symptoms: String,
    pub relevant_history: String,
    pub red_flag_symptoms: String,
    pub examination_findings: String,
    pub vital_signs: String,
    pub abnormal_vitals_present: String,
    pub investigation_results: String,
    pub primary_diagnosis: String,
    pub problem_list: String,
    pub differential: String,
    pub clinical_impression: String,
    pub investigations_plan: String,
    pub treatment_plan: String,
    pub referrals: String,
    pub follow_up: String,
    pub safety_netting: String,
    pub managed_at_home: String,
    pub clinical_note: String,
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
            "SELECT * FROM soap_notes WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
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
        sqlx::query_as("SELECT * FROM soap_notes WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE soap_notes SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            soap_note_grades SET deleted_at = now(), updated_at = now() WHERE \
            soap_note_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE soap_note_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE soap_note_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE soap_note_grade_flags \
            SET deleted_at = now(), updated_at = now() WHERE soap_note_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
