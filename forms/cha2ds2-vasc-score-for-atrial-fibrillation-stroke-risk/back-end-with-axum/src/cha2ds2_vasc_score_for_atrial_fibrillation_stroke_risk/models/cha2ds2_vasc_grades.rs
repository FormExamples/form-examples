//! cha2ds2_vasc_grades model.

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
    pub congestive_heart_failure_points: Option<i32>,
    pub hypertension_points: Option<i32>,
    pub age_points: Option<i32>,
    pub diabetes_points: Option<i32>,
    pub stroke_points: Option<i32>,
    pub vascular_disease_points: Option<i32>,
    pub sex_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub annual_stroke_risk_percent: Option<f64>,
    pub anticoagulation_recommendation: String,
    pub graded_at: DateTimeWithTimeZone,
    pub cha2ds2_vasc_id: Uuid,
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
            "SELECT * FROM cha2ds2_vasc_grades WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM cha2ds2_vasc_grades WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM cha2ds2_vasc_grades WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE cha2ds2_vasc_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE cha2ds2_vasc_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE cha2ds2_vasc_grade_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            cha2ds2_vasc_grade_flags SET deleted_at = now(), updated_at = now() WHERE \
            cha2ds2_vasc_grade_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
