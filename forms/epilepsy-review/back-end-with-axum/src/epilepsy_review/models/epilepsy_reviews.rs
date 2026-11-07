//! epilepsy_reviews model.

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
    pub reviewer_name: String,
    pub reviewer_role: String,
    pub reviewed_at: Option<Date>,
    pub care_setting: String,
    pub review_type: String,
    pub months_since_last_review: Option<f64>,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub epilepsy_type: String,
    pub age_at_onset: Option<f64>,
    pub years_since_diagnosis: Option<f64>,
    pub learning_disability: String,
    pub seizure_types: String,
    pub seizure_frequency: String,
    pub last_seizure_date: Option<Date>,
    pub seizure_free_months: Option<f64>,
    pub seizure_trend: String,
    pub current_asms: String,
    pub asm_adherence: String,
    pub asm_side_effects: String,
    pub drug_level: Option<f64>,
    pub triggers: String,
    pub sudep_discussed: String,
    pub status_epilepticus: String,
    pub seizure_injury: String,
    pub dvla_eligible: String,
    pub currently_driving: String,
    pub bathing_advice_given: String,
    pub woman_of_childbearing_potential: String,
    pub on_valproate: String,
    pub pregnancy_prevention_programme: String,
    pub folic_acid: String,
    pub contraception_interaction_reviewed: String,
    pub mental_health_concern: String,
    pub specialist_review_needed: String,
    pub next_review_due: Option<Date>,
    pub care_plan: String,
    pub review_context: String,
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
            "SELECT * FROM epilepsy_reviews WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM epilepsy_reviews WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM epilepsy_reviews WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE epilepsy_reviews SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            epilepsy_review_grades SET deleted_at = now(), updated_at = now() WHERE \
            epilepsy_review_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE epilepsy_review_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE epilepsy_review_grade_id IN (SELECT id \
            FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            epilepsy_review_grade_flags SET deleted_at = now(), updated_at = now() WHERE \
            epilepsy_review_grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
