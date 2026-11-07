//! chronic_obstructive_pulmonary_disease_reviews model.

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
    pub clinician_name: String,
    pub clinician_role: String,
    pub reviewed_at: Option<Date>,
    pub review_type: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub diagnosis_year: Option<i32>,
    pub spirometry_confirmed: String,
    pub exposure_notes: String,
    pub fev1_litres: Option<f64>,
    pub fev1_percent_predicted: Option<f64>,
    pub fvc_litres: Option<f64>,
    pub fev1_fvc_ratio: Option<f64>,
    pub spirometry_date: Option<Date>,
    pub mrc_grade: Option<i32>,
    pub mmrc_grade: Option<i32>,
    pub cat_score: Option<i32>,
    pub exacerbations_last_12m: Option<i32>,
    pub hospitalisations_last_12m: Option<i32>,
    pub last_exacerbation_date: Option<Date>,
    pub rescue_pack_courses: Option<i32>,
    pub smoking_status: String,
    pub pack_years: Option<f64>,
    pub cessation_support_offered: String,
    pub inhaled_therapy: String,
    pub device_type: String,
    pub inhaler_technique_checked: String,
    pub inhaler_technique_adequate: String,
    pub adherence: String,
    pub influenza_vaccine: String,
    pub pneumococcal_vaccine: String,
    pub covid_vaccine: String,
    pub pulmonary_rehab_status: String,
    pub oxygen_use: String,
    pub resting_spo2: Option<i32>,
    pub comorbidities: String,
    pub self_management_plan: String,
    pub rescue_pack_supplied: String,
    pub next_review_interval: String,
    pub clinician_note: String,
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
            "SELECT * FROM chronic_obstructive_pulmonary_disease_reviews WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM chronic_obstructive_pulmonary_disease_reviews WHERE \
            deleted_at IS NULL",
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
        sqlx::query_as(
            "SELECT * FROM chronic_obstructive_pulmonary_disease_reviews WHERE id = $1 \
            AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE chronic_obstructive_pulmonary_disease_reviews SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            chronic_obstructive_pulmonary_disease_review_grades SET deleted_at = now(), \
            updated_at = now() WHERE chronic_obstructive_pulmonary_disease_review_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE chronic_obstructive_pulmonary_disease_review_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            chronic_obstructive_pulmonary_disease_review_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            chronic_obstructive_pulmonary_disease_review_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            chronic_obstructive_pulmonary_disease_review_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
