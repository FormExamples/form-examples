//! diabetes_podiatry_assessments model.

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
    pub assessed_at: Option<Date>,
    pub assessment_setting: String,
    pub diabetes_type: String,
    pub years_since_diagnosis: Option<f64>,
    pub on_renal_replacement_therapy: String,
    pub visual_acuity_impairment: String,
    pub self_care_ability: String,
    pub footwear_appropriate: String,
    pub right_neuropathy_status: String,
    pub right_pulses_status: String,
    pub right_deformity: String,
    pub right_callus: String,
    pub right_skin_breakdown: String,
    pub right_active_ulcer: String,
    pub right_ulcer_severity: String,
    pub right_previous_ulcer: String,
    pub right_previous_amputation: String,
    pub right_suspected_charcot: String,
    pub left_neuropathy_status: String,
    pub left_pulses_status: String,
    pub left_deformity: String,
    pub left_callus: String,
    pub left_skin_breakdown: String,
    pub left_active_ulcer: String,
    pub left_ulcer_severity: String,
    pub left_previous_ulcer: String,
    pub left_previous_amputation: String,
    pub left_suspected_charcot: String,
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
        let rows = sqlx::query_as(
            "SELECT * FROM diabetes_podiatry_assessments ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM diabetes_podiatry_assessments")
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
        sqlx::query_as("SELECT * FROM diabetes_podiatry_assessments WHERE id = $1")
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
        sqlx::query("DELETE FROM diabetes_podiatry_assessments WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
