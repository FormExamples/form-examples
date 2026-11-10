//! agile_consulting_scorecard_for_hiring_helps model.

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
    pub status: String,
    pub assessment_date: Date,
    pub submitted_at: Option<DateTimeWithTimeZone>,
    pub finalized_at: Option<DateTimeWithTimeZone>,
    pub m1_done: Option<bool>,
    pub m1_evidence: String,
    pub m2_done: Option<bool>,
    pub m2_evidence: String,
    pub m3_done: Option<bool>,
    pub m3_evidence: String,
    pub m4_done: Option<bool>,
    pub m4_evidence: String,
    pub p1_done: Option<bool>,
    pub p1_evidence: String,
    pub p2_done: Option<bool>,
    pub p2_evidence: String,
    pub p3_done: Option<bool>,
    pub p3_evidence: String,
    pub p4_done: Option<bool>,
    pub p4_evidence: String,
    pub p5_done: Option<bool>,
    pub p5_evidence: String,
    pub p6_done: Option<bool>,
    pub p6_evidence: String,
    pub p7_done: Option<bool>,
    pub p7_evidence: String,
    pub p8_done: Option<bool>,
    pub p8_evidence: String,
    pub p9_done: Option<bool>,
    pub p9_evidence: String,
    pub p10_done: Option<bool>,
    pub p10_evidence: String,
    pub p11_done: Option<bool>,
    pub p11_evidence: String,
    pub p12_done: Option<bool>,
    pub p12_evidence: String,
    pub organization_id: Uuid,
    pub respondent_id: Uuid,
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
            "SELECT * FROM agile_consulting_scorecard_for_hiring_helps WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2",
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
        sqlx::query_as(
            "SELECT * FROM agile_consulting_scorecard_for_hiring_helps WHERE id = $1 AND \
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
            "WITH target AS (UPDATE agile_consulting_scorecard_for_hiring_helps SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_help_grades SET deleted_at = now(), \
            updated_at = now() WHERE agile_consulting_scorecard_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE agile_consulting_scorecard_for_hiring_help_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            agile_consulting_scorecard_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_help_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE agile_consulting_scorecard_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
