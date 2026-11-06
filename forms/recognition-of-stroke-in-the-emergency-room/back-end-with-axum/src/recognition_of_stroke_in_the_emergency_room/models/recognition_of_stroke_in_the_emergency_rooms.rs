//! recognition_of_stroke_in_the_emergency_rooms model.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub symptom_onset_at: Option<DateTimeWithTimeZone>,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub blood_glucose: Option<f64>,
    pub hypoglycaemia_corrected: String,
    pub loss_of_consciousness: String,
    pub seizure_activity: String,
    pub facial_weakness: String,
    pub arm_weakness: String,
    pub leg_weakness: String,
    pub speech_disturbance: String,
    pub visual_field_defect: String,
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
        let rows = sqlx::query_as("SELECT * FROM recognition_of_stroke_in_the_emergency_rooms ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM recognition_of_stroke_in_the_emergency_rooms")
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
        sqlx::query_as("SELECT * FROM recognition_of_stroke_in_the_emergency_rooms WHERE id = $1")
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
        sqlx::query("DELETE FROM recognition_of_stroke_in_the_emergency_rooms WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
