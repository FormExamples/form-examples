//! agile_principles_assessments model.

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
    pub is_anonymous: bool,
    pub assessment_date: Option<Date>,
    pub assessment_period: String,
    pub p01_customer_satisfaction: Option<i32>,
    pub p01_comment: String,
    pub p01_weight: f64,
    pub p02_welcome_change: Option<i32>,
    pub p02_comment: String,
    pub p02_weight: f64,
    pub p03_deliver_frequently: Option<i32>,
    pub p03_comment: String,
    pub p03_weight: f64,
    pub p04_collaboration: Option<i32>,
    pub p04_comment: String,
    pub p04_weight: f64,
    pub p05_motivated_individuals: Option<i32>,
    pub p05_comment: String,
    pub p05_weight: f64,
    pub p06_face_to_face: Option<i32>,
    pub p06_comment: String,
    pub p06_weight: f64,
    pub p07_working_software: Option<i32>,
    pub p07_comment: String,
    pub p07_weight: f64,
    pub p08_sustainable_development: Option<i32>,
    pub p08_comment: String,
    pub p08_weight: f64,
    pub p09_technical_excellence: Option<i32>,
    pub p09_comment: String,
    pub p09_weight: f64,
    pub p10_simplicity: Option<i32>,
    pub p10_comment: String,
    pub p10_weight: f64,
    pub p11_self_organising_teams: Option<i32>,
    pub p11_comment: String,
    pub p11_weight: f64,
    pub p12_regular_reflection: Option<i32>,
    pub p12_comment: String,
    pub p12_weight: f64,
    pub overall_notes: String,
    pub respondent_id: Uuid,
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
            "SELECT * FROM agile_principles_assessments WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM agile_principles_assessments WHERE deleted_at IS NULL",
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
            "SELECT * FROM agile_principles_assessments WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE agile_principles_assessments SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE agile_principles_assessment_grades SET deleted_at = now(), \
            updated_at = now() WHERE agile_principles_assessment_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            agile_principles_assessment_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE agile_principles_assessment_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            agile_principles_assessment_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE agile_principles_assessment_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
