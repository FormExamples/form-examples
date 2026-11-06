//! sequential_organ_failure_assessments model.

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
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessor_registration_number: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_location: String,
    pub hours_since_admission: Option<i32>,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub admission_diagnosis: String,
    pub suspected_infection: String,
    pub baseline_sofa_total: Option<i32>,
    pub pao2: Option<f64>,
    pub fio2: Option<f64>,
    pub pao2_fio2_ratio: Option<f64>,
    pub respiratory_support: String,
    pub platelets: Option<f64>,
    pub bilirubin: Option<f64>,
    pub map: Option<f64>,
    pub vasopressor: String,
    pub vasopressor_dose: Option<f64>,
    pub glasgow_coma_scale: Option<i32>,
    pub sedated: bool,
    pub creatinine: Option<f64>,
    pub urine_output: Option<i32>,
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
            "SELECT * FROM sequential_organ_failure_assessments ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM sequential_organ_failure_assessments")
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
        sqlx::query_as("SELECT * FROM sequential_organ_failure_assessments WHERE id = $1")
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
        sqlx::query("DELETE FROM sequential_organ_failure_assessments WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
