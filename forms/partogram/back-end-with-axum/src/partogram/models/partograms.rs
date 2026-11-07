//! partograms model.

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
    pub care_setting: String,
    pub active_phase_start_at: Option<DateTimeWithTimeZone>,
    pub patient_identifier: String,
    pub age_band: String,
    pub parity: String,
    pub gestation_weeks: Option<f64>,
    pub membranes_on_admission: String,
    pub risk_factors: String,
    pub planned_care: String,
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
            "SELECT * FROM partograms WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM partograms WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM partograms WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE partograms SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            partogram_observations SET deleted_at = now(), updated_at = now() WHERE \
            partogram_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE partogram_grades SET deleted_at = now(), updated_at = \
            now() WHERE partogram_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child3 AS (UPDATE partogram_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE partogram_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            partogram_grade_flags SET deleted_at = now(), updated_at = now() WHERE \
            partogram_grade_id IN (SELECT id FROM child2) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
