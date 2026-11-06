//! confusion_assessment_methods model.

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
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub ward_unit: String,
    pub cam_variant: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub cognitive_baseline: String,
    pub collateral_source: String,
    pub feature_acute_onset_fluctuating: String,
    pub onset_timing: String,
    pub feature_inattention: String,
    pub attention_test: String,
    pub feature_disorganised_thinking: String,
    pub feature_altered_consciousness: String,
    pub consciousness_level: String,
    pub rass_score: Option<i32>,
    pub motoric_subtype: String,
    pub hallucinations: bool,
    pub delusions: bool,
    pub sleep_wake_disturbance: bool,
    pub deliriogenic_medication: bool,
    pub deliriogenic_medication_detail: String,
    pub suspected_precipitants: String,
    pub recommended_actions: String,
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
        let rows = sqlx::query_as(
            "SELECT * FROM confusion_assessment_methods ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM confusion_assessment_methods")
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
        sqlx::query_as("SELECT * FROM confusion_assessment_methods WHERE id = $1")
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
        sqlx::query("DELETE FROM confusion_assessment_methods WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
