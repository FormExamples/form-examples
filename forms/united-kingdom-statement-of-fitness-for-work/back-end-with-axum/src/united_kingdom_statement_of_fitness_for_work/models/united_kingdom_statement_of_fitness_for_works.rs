//! united_kingdom_statement_of_fitness_for_works model.

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
    pub assessment_date: Option<Date>,
    pub assessment_method: String,
    pub general_fitness_considered: String,
    pub diagnosis_text: String,
    pub diagnosis_snomed_code: String,
    pub diagnosis_snomed_display: String,
    pub diagnosis_category: String,
    pub condition_first_recorded_date: Option<Date>,
    pub is_automatic_disability: String,
    pub is_non_medical: String,
    pub fitness_for_work: String,
    pub adaptation_phased_return: String,
    pub adaptation_altered_hours: String,
    pub adaptation_amended_duties: String,
    pub adaptation_workplace_adaptations: String,
    pub comments: String,
    pub period_type: String,
    pub period_duration_value: Option<i32>,
    pub period_duration_unit: String,
    pub period_from: Option<Date>,
    pub period_to: Option<Date>,
    pub will_assess_again: String,
    pub planned_review_date: Option<Date>,
    pub issued_at: Option<DateTimeWithTimeZone>,
    pub issued_via: String,
    pub issue_setting: String,
    pub safeguarding_concern: String,
    pub safeguarding_notes: String,
    pub clinician_signature_svg: String,
    pub clinician_signed_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub medical_practice_id: Uuid,
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
            "SELECT * FROM united_kingdom_statement_of_fitness_for_works WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM united_kingdom_statement_of_fitness_for_works WHERE \
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
            "SELECT * FROM united_kingdom_statement_of_fitness_for_works WHERE id = $1 \
            AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE united_kingdom_statement_of_fitness_for_works SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            united_kingdom_statement_of_fitness_for_work_grades SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_statement_of_fitness_for_work_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE united_kingdom_statement_of_fitness_for_work_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_statement_of_fitness_for_work_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_kingdom_statement_of_fitness_for_work_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_statement_of_fitness_for_work_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
