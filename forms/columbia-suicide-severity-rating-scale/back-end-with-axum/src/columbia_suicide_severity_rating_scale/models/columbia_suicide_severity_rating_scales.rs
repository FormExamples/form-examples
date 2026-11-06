//! columbia_suicide_severity_rating_scales model.

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
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub scale_version: String,
    pub reason_for_assessment: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub wish_to_be_dead: String,
    pub non_specific_active_thoughts: String,
    pub active_ideation_methods: String,
    pub active_ideation_intent: String,
    pub active_ideation_plan: String,
    pub ideation_timeframe: String,
    pub ideation_frequency: Option<i32>,
    pub ideation_duration: Option<i32>,
    pub ideation_controllability: Option<i32>,
    pub ideation_deterrents: Option<i32>,
    pub ideation_reasons: Option<i32>,
    pub actual_attempt: String,
    pub interrupted_attempt: String,
    pub aborted_attempt: String,
    pub preparatory_acts: String,
    pub non_suicidal_self_injury: String,
    pub behaviour_recency: String,
    pub lifetime_attempt_count: Option<i32>,
    pub most_recent_attempt_date: Option<Date>,
    pub actual_lethality: Option<i32>,
    pub potential_lethality: Option<i32>,
    pub access_to_lethal_means: String,
    pub protective_factors: String,
    pub clinical_note: String,
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
            "SELECT * FROM columbia_suicide_severity_rating_scales ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM columbia_suicide_severity_rating_scales")
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
        sqlx::query_as("SELECT * FROM columbia_suicide_severity_rating_scales WHERE id = $1")
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
        sqlx::query("DELETE FROM columbia_suicide_severity_rating_scales WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
