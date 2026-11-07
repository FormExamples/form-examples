//! newborn_blood_spot_screenings model.

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
    pub sample_taker_role: String,
    pub care_setting: String,
    pub record_date: Option<Date>,
    pub time_of_birth: Option<String>,
    pub gestation_weeks: Option<f64>,
    pub previously_screened: String,
    pub consent_given: String,
    pub decline_reason: String,
    pub sample_date: Option<Date>,
    pub sample_time: Option<String>,
    pub age_at_sample_days: Option<i32>,
    pub sampling_site: String,
    pub sample_notes: String,
    pub sample_adequacy: String,
    pub spot_quality_issue: String,
    pub is_repeat: String,
    pub repeat_reason: String,
    pub scd_result: String,
    pub cf_result: String,
    pub cht_result: String,
    pub pku_result: String,
    pub mcadd_result: String,
    pub msud_result: String,
    pub iva_result: String,
    pub ga1_result: String,
    pub hcu_result: String,
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
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM newborn_blood_spot_screenings WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM newborn_blood_spot_screenings WHERE deleted_at IS NULL",
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
            "SELECT * FROM newborn_blood_spot_screenings WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE newborn_blood_spot_screenings SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE newborn_blood_spot_screening_grades SET deleted_at = \
            now(), updated_at = now() WHERE newborn_blood_spot_screening_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            newborn_blood_spot_screening_grade_rules SET deleted_at = now(), updated_at \
            = now() WHERE newborn_blood_spot_screening_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            newborn_blood_spot_screening_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE newborn_blood_spot_screening_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
