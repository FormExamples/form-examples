//! assessment_polypharmacy_reviews model.

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
    pub total_regular_medications: Option<i32>,
    pub total_prn_medications: Option<i32>,
    pub polypharmacy_flag: String,
    pub medication_review_date: Option<Date>,
    pub falls_risk_medications: String,
    pub falls_risk_medication_details: String,
    pub anticholinergic_burden: String,
    pub drug_interactions_identified: String,
    pub drug_interaction_details: String,
    pub adherence_concerns: String,
    pub adherence_details: String,
    pub stopp_start_review_done: String,
    pub deprescribing_opportunities: String,
    pub polypharmacy_notes: String,
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
            "SELECT * FROM assessment_polypharmacy_reviews ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM assessment_polypharmacy_reviews")
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
        sqlx::query_as("SELECT * FROM assessment_polypharmacy_reviews WHERE id = $1")
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
        sqlx::query("DELETE FROM assessment_polypharmacy_reviews WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
