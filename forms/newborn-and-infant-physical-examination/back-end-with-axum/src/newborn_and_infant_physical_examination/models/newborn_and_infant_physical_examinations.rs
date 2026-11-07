//! newborn_and_infant_physical_examinations model.

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
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub practitioner_name: String,
    pub practitioner_role: String,
    pub examined_at: Option<DateTimeWithTimeZone>,
    pub examination_context: String,
    pub care_setting: String,
    pub baby_identifier: String,
    pub baby_name: String,
    pub date_of_birth: Option<Date>,
    pub sex: String,
    pub gestational_age_weeks: Option<f64>,
    pub birth_weight_grams: Option<f64>,
    pub breech_presentation: String,
    pub family_history_hip_problems: String,
    pub antenatal_concerns: String,
    pub eyes_red_reflex_right: String,
    pub eyes_red_reflex_left: String,
    pub eyes_appearance: String,
    pub heart_murmur: String,
    pub femoral_pulses_right: String,
    pub femoral_pulses_left: String,
    pub central_cyanosis: String,
    pub oxygen_saturation_preductal: Option<f64>,
    pub oxygen_saturation_postductal: Option<f64>,
    pub barlow_test: String,
    pub ortolani_test: String,
    pub hip_abduction: String,
    pub testis_right: String,
    pub testis_left: String,
    pub general_appearance: String,
    pub skin: String,
    pub head_and_fontanelles: String,
    pub face_and_palate: String,
    pub neck_and_clavicles: String,
    pub chest_and_lungs: String,
    pub abdomen: String,
    pub genitalia: String,
    pub anus_and_spine: String,
    pub limbs_and_digits: String,
    pub feet: String,
    pub tone_and_movement: String,
    pub weight_grams: Option<f64>,
    pub head_circumference_cm: Option<f64>,
    pub length_cm: Option<f64>,
    pub eyes_result_recorded: String,
    pub heart_result_recorded: String,
    pub hips_result_recorded: String,
    pub testes_result_recorded: String,
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
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM newborn_and_infant_physical_examinations WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM newborn_and_infant_physical_examinations WHERE \
            deleted_at IS NULL",
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
            "SELECT * FROM newborn_and_infant_physical_examinations WHERE id = $1 AND \
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
            "WITH target AS (UPDATE newborn_and_infant_physical_examinations SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            newborn_and_infant_physical_examination_grades SET deleted_at = now(), \
            updated_at = now() WHERE newborn_and_infant_physical_examination_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE newborn_and_infant_physical_examination_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE \
            newborn_and_infant_physical_examination_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            newborn_and_infant_physical_examination_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE newborn_and_infant_physical_examination_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
