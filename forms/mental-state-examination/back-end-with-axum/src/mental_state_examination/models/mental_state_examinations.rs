//! mental_state_examinations model.

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
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub assessment_reason: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub appearance_grooming: String,
    pub appearance_eye_contact: String,
    pub appearance_rapport: String,
    pub appearance_psychomotor: String,
    pub appearance_abnormal_movements: String,
    pub appearance_notes: String,
    pub speech_rate: String,
    pub speech_volume: String,
    pub speech_quantity: String,
    pub speech_fluency: String,
    pub speech_notes: String,
    pub mood_subjective: String,
    pub mood_descriptor: String,
    pub affect_range: String,
    pub affect_congruence: String,
    pub affect_reactivity: String,
    pub emotion_notes: String,
    pub hallucinations_present: String,
    pub command_hallucinations: String,
    pub illusions: String,
    pub depersonalisation: String,
    pub derealisation: String,
    pub perception_notes: String,
    pub thought_form: String,
    pub delusions: String,
    pub obsessions: String,
    pub suicidal_ideation: String,
    pub homicidal_ideation: String,
    pub self_harm_thoughts: String,
    pub thought_notes: String,
    pub insight_level: String,
    pub treatment_understanding: String,
    pub judgement: String,
    pub insight_notes: String,
    pub orientation: String,
    pub attention: String,
    pub memory: String,
    pub cognitive_impression: String,
    pub cognition_notes: String,
    pub clinical_formulation: String,
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
            "SELECT * FROM mental_state_examinations WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM mental_state_examinations WHERE deleted_at IS NULL",
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
            "SELECT * FROM mental_state_examinations WHERE id = $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE mental_state_examinations SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE mental_state_examination_grades SET deleted_at = now(), \
            updated_at = now() WHERE mental_state_examination_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            mental_state_examination_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE mental_state_examination_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            mental_state_examination_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE mental_state_examination_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
