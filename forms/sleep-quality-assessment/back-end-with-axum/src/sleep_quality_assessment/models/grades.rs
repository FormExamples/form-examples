//! grades model.

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
    pub psqi_global_score: Option<i32>,
    pub psqi_component1_subjective_quality: Option<i32>,
    pub psqi_component2_sleep_latency: Option<i32>,
    pub psqi_component3_sleep_duration: Option<i32>,
    pub psqi_component4_sleep_efficiency: Option<i32>,
    pub psqi_component5_sleep_disturbances: Option<i32>,
    pub psqi_component6_sleep_medication: Option<i32>,
    pub psqi_component7_daytime_dysfunction: Option<i32>,
    pub sleep_quality_category: String,
    pub graded_at: DateTimeWithTimeZone,
    pub assessment_id: Uuid,
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
            "SELECT * FROM grades WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM grades WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM grades WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE grades SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            grading_fired_rules SET deleted_at = now(), updated_at = now() WHERE \
            grade_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child2 AS (UPDATE grading_additional_flags SET deleted_at = now(), \
            updated_at = now() WHERE grade_id IN (SELECT id FROM target) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
