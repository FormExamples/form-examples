//! cervical_screenings model.

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
    pub care_setting: String,
    pub sample_taker_role: String,
    pub sample_taken_at: Option<DateTimeWithTimeZone>,
    pub patient_identifier: String,
    pub age: Option<i32>,
    pub recall_interval: String,
    pub screen_due_date: Option<Date>,
    pub last_screen_date: Option<Date>,
    pub overdue: String,
    pub previously_ceased: String,
    pub consent_given: String,
    pub symptomatic: String,
    pub symptom_detail: String,
    pub sample_adequacy: String,
    pub inadequate_reason: String,
    pub hpv_result: String,
    pub cytology_grade: String,
    pub clinical_context: String,
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
        let rows =
            sqlx::query_as("SELECT * FROM cervical_screenings ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM cervical_screenings")
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
        sqlx::query_as("SELECT * FROM cervical_screenings WHERE id = $1")
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
        sqlx::query("DELETE FROM cervical_screenings WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
