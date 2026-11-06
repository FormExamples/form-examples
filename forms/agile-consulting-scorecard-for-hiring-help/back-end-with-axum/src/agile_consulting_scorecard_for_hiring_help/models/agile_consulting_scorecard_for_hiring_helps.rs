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
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM agile_consulting_scorecard_for_hiring_helps ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM agile_consulting_scorecard_for_hiring_helps")
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
        sqlx::query_as("SELECT * FROM agile_consulting_scorecard_for_hiring_helps WHERE id = $1")
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
        sqlx::query("DELETE FROM agile_consulting_scorecard_for_hiring_helps WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
