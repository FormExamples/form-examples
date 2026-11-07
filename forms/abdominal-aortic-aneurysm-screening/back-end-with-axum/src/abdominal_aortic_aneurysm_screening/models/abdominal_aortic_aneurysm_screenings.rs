//! abdominal_aortic_aneurysm_screenings model.

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
    pub technician_name: String,
    pub technician_role: String,
    pub clinic_site: String,
    pub scanned_at: Option<DateTimeWithTimeZone>,
    pub device_identifier: String,
    pub patient_identifier: String,
    pub age: Option<i32>,
    pub sex: String,
    pub eligibility_route: String,
    pub scan_type: String,
    pub consent_given: String,
    pub leaflet_provided: String,
    pub consent_note: String,
    pub aorta_visualised: String,
    pub max_aortic_diameter_cm: Option<f64>,
    pub prior_max_diameter_cm: Option<f64>,
    pub prior_scan_date: Option<Date>,
    pub symptomatic: String,
    pub incidental_findings: String,
    pub result_note: String,
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
            "SELECT * FROM abdominal_aortic_aneurysm_screenings WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM abdominal_aortic_aneurysm_screenings WHERE deleted_at \
            IS NULL",
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
            "SELECT * FROM abdominal_aortic_aneurysm_screenings WHERE id = $1 AND \
            deleted_at IS NULL",
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
            "WITH target AS (UPDATE abdominal_aortic_aneurysm_screenings SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE abdominal_aortic_aneurysm_screening_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            abdominal_aortic_aneurysm_screening_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            abdominal_aortic_aneurysm_screening_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE abdominal_aortic_aneurysm_screening_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE abdominal_aortic_aneurysm_screening_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE abdominal_aortic_aneurysm_screening_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
