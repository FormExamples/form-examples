//! clin_micro_waiting_list_cards model.

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
    pub entry_date: Option<Date>,
    pub entry_time: Option<String>,
    pub referral_source: String,
    pub referral_date: Option<Date>,
    pub referral_letter_reference: String,
    pub reason_for_referral: String,
    pub presenting_condition: String,
    pub icd_10_code: String,
    pub snomed_ct_code: String,
    pub suspected_cancer: String,
    pub list_name: String,
    pub specialty: String,
    pub sub_specialty: String,
    pub procedure_description: String,
    pub opcs_4_code: String,
    pub clinical_priority: String,
    pub rtt_clock_start_date: Option<Date>,
    pub expected_procedure_type: String,
    pub expected_wait_weeks: Option<i32>,
    pub consent_to_reminders: String,
    pub communication_notes: String,
    pub additional_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub practitioner_id: Uuid,
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
            "SELECT * FROM clin_micro_waiting_list_cards ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM clin_micro_waiting_list_cards")
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
        sqlx::query_as("SELECT * FROM clin_micro_waiting_list_cards WHERE id = $1")
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
        sqlx::query("DELETE FROM clin_micro_waiting_list_cards WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
