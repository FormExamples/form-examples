//! hypertension_reviews model.

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
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub clinician_role: String,
    pub reviewed_at: Option<Date>,
    pub practice_site: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub ethnicity: String,
    pub diagnosis_date: Option<Date>,
    pub type2_diabetes: String,
    pub chronic_kidney_disease: String,
    pub established_cvd: String,
    pub atrial_fibrillation: String,
    pub clinic_systolic: Option<i32>,
    pub clinic_diastolic: Option<i32>,
    pub home_systolic: Option<i32>,
    pub home_diastolic: Option<i32>,
    pub monitoring_method: String,
    pub postural_drop: String,
    pub antihypertensive_agents: Option<i32>,
    pub adherence: String,
    pub side_effects: String,
    pub qrisk_percent: Option<f64>,
    pub smoking_status: String,
    pub statin_therapy: String,
    pub bmi: Option<f64>,
    pub lifestyle_advice: String,
    pub serum_creatinine: Option<f64>,
    pub egfr: Option<f64>,
    pub serum_potassium: Option<f64>,
    pub hba1c: Option<f64>,
    pub total_cholesterol: Option<f64>,
    pub hdl_cholesterol: Option<f64>,
    pub urine_acr: Option<f64>,
    pub complications: String,
    pub review_context: String,
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
            "SELECT * FROM hypertension_reviews WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM hypertension_reviews WHERE deleted_at IS NULL",
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
        sqlx::query_as("SELECT * FROM hypertension_reviews WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE hypertension_reviews SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE hypertension_review_grades SET deleted_at = now(), \
            updated_at = now() WHERE hypertension_review_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            hypertension_review_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE hypertension_review_grade_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child3 AS (UPDATE hypertension_review_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE hypertension_review_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
