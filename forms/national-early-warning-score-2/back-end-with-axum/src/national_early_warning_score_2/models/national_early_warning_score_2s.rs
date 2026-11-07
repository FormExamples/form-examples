//! national_early_warning_score_2s model.

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
    pub status: String,
    pub observation_at: Option<DateTimeWithTimeZone>,
    pub ward_or_location: String,
    pub spo2_scale: String,
    pub spo2_scale2_endorsed: String,
    pub respiratory_rate: Option<i32>,
    pub spo2: Option<i32>,
    pub on_oxygen: String,
    pub oxygen_device: String,
    pub oxygen_flow_rate_l_min: Option<f64>,
    pub inspired_oxygen_fraction_percent: Option<i32>,
    pub systolic_blood_pressure: Option<i32>,
    pub pulse: Option<i32>,
    pub consciousness_acvpu: String,
    pub temperature: Option<f64>,
    pub is_under_16: String,
    pub is_pregnant: String,
    pub has_spinal_cord_injury: String,
    pub clinical_notes: String,
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
            "SELECT * FROM national_early_warning_score_2s WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM national_early_warning_score_2s WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM national_early_warning_score_2s WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "WITH target AS (UPDATE national_early_warning_score_2s SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE national_early_warning_score_2_grades SET deleted_at \
            = now(), updated_at = now() WHERE national_early_warning_score_2_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE national_early_warning_score_2_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE national_early_warning_score_2_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            national_early_warning_score_2_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE national_early_warning_score_2_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
