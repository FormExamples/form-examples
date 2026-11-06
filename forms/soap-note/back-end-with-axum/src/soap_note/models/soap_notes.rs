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
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM soap_notes ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM soap_notes")
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
        sqlx::query_as("SELECT * FROM soap_notes WHERE id = $1")
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
        sqlx::query("DELETE FROM soap_notes WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
