//! United states divorce petition grades module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// United states divorce petition id.
    pub united_states_divorce_petition_id: Uuid,
    /// Readiness class.
    pub readiness_class: String,
    /// Property regime.
    pub property_regime: String,
    /// Earliest decree date.
    pub earliest_decree_date: Option<Date>,
    /// State rule known.
    pub state_rule_known: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}
/// United states divorce petition grades.
pub type UnitedStatesDivorcePetitionGrades = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_states_divorce_petition_grades WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM united_states_divorce_petition_grades WHERE id = $1 AND \
            deleted_at IS NULL")
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
        sqlx::query("WITH target AS (UPDATE united_states_divorce_petition_grades SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_divorce_petition_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_divorce_petition_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_divorce_petition_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE united_states_divorce_petition_grade_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
