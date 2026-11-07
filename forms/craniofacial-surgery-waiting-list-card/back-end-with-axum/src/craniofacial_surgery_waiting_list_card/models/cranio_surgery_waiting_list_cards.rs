//! cranio_surgery_waiting_list_cards model.

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
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM cranio_surgery_waiting_list_cards WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM cranio_surgery_waiting_list_cards WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM cranio_surgery_waiting_list_cards WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "WITH target AS (UPDATE cranio_surgery_waiting_list_cards SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE cranio_surgery_waiting_list_card_appointments SET \
            deleted_at = now(), updated_at = now() WHERE \
            cranio_surgery_waiting_list_card_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            cranio_surgery_waiting_list_card_grades SET deleted_at = now(), updated_at = \
            now() WHERE cranio_surgery_waiting_list_card_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            cranio_surgery_waiting_list_card_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE cranio_surgery_waiting_list_card_grade_id IN \
            (SELECT id FROM child2) AND deleted_at IS NULL RETURNING id), child4 AS \
            (UPDATE cranio_surgery_waiting_list_card_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE cranio_surgery_waiting_list_card_grade_id IN \
            (SELECT id FROM child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
