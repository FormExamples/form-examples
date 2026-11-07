//! ottawa_knee_rules model.

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
    pub patient_identifier: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub injury_mechanism: String,
    pub hours_since_injury: Option<f64>,
    pub sex: String,
    pub injured_side: String,
    pub age_years: Option<i32>,
    pub patellar_tenderness: String,
    pub other_bony_tenderness: String,
    pub fibular_head_tenderness: String,
    pub unable_to_flex_90: String,
    pub unable_to_bear_weight: String,
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
            "SELECT * FROM ottawa_knee_rules WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM ottawa_knee_rules WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM ottawa_knee_rules WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE ottawa_knee_rules SET deleted_at = now(), updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS \
            (UPDATE ottawa_knee_rule_grades SET deleted_at = now(), updated_at = now() \
            WHERE ottawa_knee_rule_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE ottawa_knee_rule_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE ottawa_knee_rule_grade_id IN (SELECT id \
            FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            ottawa_knee_rule_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE ottawa_knee_rule_grade_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
