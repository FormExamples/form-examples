//! assessments model.

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
    pub status: String,
    pub age_of_onset: Option<i32>,
    pub known_allergens: String,
    pub family_history_of_atopy: String,
    pub family_atopy_details: String,
    pub family_history_of_allergy: String,
    pub family_allergy_details: String,
    pub pollen_allergy: String,
    pub dust_mite_allergy: String,
    pub mould_allergy: String,
    pub animal_dander_allergy: String,
    pub latex_allergy: String,
    pub insect_sting_allergy: String,
    pub insect_sting_severity: String,
    pub seasonal_pattern: String,
    pub other_environmental_allergens: String,
    pub asthma: String,
    pub asthma_severity: String,
    pub eczema: String,
    pub eczema_severity: String,
    pub rhinitis: String,
    pub rhinitis_severity: String,
    pub eosinophilic_oesophagitis: String,
    pub mast_cell_disorders: String,
    pub mast_cell_details: String,
    pub mental_health_impact: String,
    pub mental_health_details: String,
    pub quality_of_life_score: Option<i32>,
    pub school_work_impact: String,
    pub school_work_impact_details: String,
    pub emergency_action_plan_status: String,
    pub training_provided: String,
    pub training_details: String,
    pub follow_up_schedule: String,
    pub patient_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM assessments ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM assessments")
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
        sqlx::query_as("SELECT * FROM assessments WHERE id = $1")
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
        sqlx::query("DELETE FROM assessments WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
