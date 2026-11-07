//! zarit_burden_interviews model.

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
    pub practitioner_name: String,
    pub practitioner_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub instrument_form: String,
    pub carer_identifier: String,
    pub carer_relationship: String,
    pub carer_co_resident: String,
    pub care_hours_per_week: Option<f64>,
    pub recipient_identifier: String,
    pub recipient_condition: String,
    pub item_1: Option<i32>,
    pub item_2: Option<i32>,
    pub item_3: Option<i32>,
    pub item_4: Option<i32>,
    pub item_5: Option<i32>,
    pub item_6: Option<i32>,
    pub item_7: Option<i32>,
    pub item_8: Option<i32>,
    pub item_9: Option<i32>,
    pub item_10: Option<i32>,
    pub item_11: Option<i32>,
    pub item_12: Option<i32>,
    pub item_13: Option<i32>,
    pub item_14: Option<i32>,
    pub item_15: Option<i32>,
    pub item_16: Option<i32>,
    pub item_17: Option<i32>,
    pub item_18: Option<i32>,
    pub item_19: Option<i32>,
    pub item_20: Option<i32>,
    pub item_21: Option<i32>,
    pub item_22: Option<i32>,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM zarit_burden_interviews WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM zarit_burden_interviews WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE zarit_burden_interviews SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE zarit_burden_interview_grades SET deleted_at = now(), \
            updated_at = now() WHERE zarit_burden_interview_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            zarit_burden_interview_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE zarit_burden_interview_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            zarit_burden_interview_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE zarit_burden_interview_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
