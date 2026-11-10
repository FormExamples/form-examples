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
    #[serde(skip)]
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
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM assessments WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
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
        sqlx::query_as("SELECT * FROM assessments WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE assessments SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            assessment_drug_allergies SET deleted_at = now(), updated_at = now() WHERE \
            assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE assessment_food_allergies SET deleted_at = now(), \
            updated_at = now() WHERE assessment_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            assessment_anaphylaxis_histories SET deleted_at = now(), updated_at = now() \
            WHERE assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child4 AS (UPDATE assessment_testing_results SET deleted_at = \
            now(), updated_at = now() WHERE assessment_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child5 AS (UPDATE \
            assessment_current_managements SET deleted_at = now(), updated_at = now() \
            WHERE assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child6 AS (UPDATE grades SET deleted_at = now(), updated_at = \
            now() WHERE assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child7 AS (UPDATE assessment_drug_allergy_items SET \
            deleted_at = now(), updated_at = now() WHERE drug_allergies_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child8 AS \
            (UPDATE assessment_food_allergy_items SET deleted_at = now(), updated_at = \
            now() WHERE food_allergies_id IN (SELECT id FROM child2) AND deleted_at IS \
            NULL RETURNING id), child9 AS (UPDATE assessment_anaphylaxis_episodes SET \
            deleted_at = now(), updated_at = now() WHERE anaphylaxis_history_id IN \
            (SELECT id FROM child3) AND deleted_at IS NULL RETURNING id), child10 AS \
            (UPDATE assessment_test_result_items SET deleted_at = now(), updated_at = \
            now() WHERE testing_results_id IN (SELECT id FROM child4) AND deleted_at IS \
            NULL RETURNING id), child11 AS (UPDATE assessment_other_medications SET \
            deleted_at = now(), updated_at = now() WHERE current_management_id IN \
            (SELECT id FROM child5) AND deleted_at IS NULL RETURNING id), child12 AS \
            (UPDATE grading_fired_rules SET deleted_at = now(), updated_at = now() WHERE \
            grade_id IN (SELECT id FROM child6) AND deleted_at IS NULL RETURNING id), \
            child13 AS (UPDATE grading_additional_flags SET deleted_at = now(), \
            updated_at = now() WHERE grade_id IN (SELECT id FROM child6) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
