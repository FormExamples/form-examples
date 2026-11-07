//! mental_health_act_assessments model.

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
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub location: String,
    pub referral_source: String,
    pub reason_for_assessment: String,
    pub person_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub first_language: String,
    pub amhp_name: String,
    pub amhp_approved: String,
    pub doctor1_name: String,
    pub doctor1_gmc_number: String,
    pub doctor1_section12_approved: String,
    pub doctor1_examined_at: Option<DateTimeWithTimeZone>,
    pub doctor2_name: String,
    pub doctor2_gmc_number: String,
    pub doctor2_section12_approved: String,
    pub doctor2_examined_at: Option<DateTimeWithTimeZone>,
    pub prior_acquaintance: String,
    pub mental_disorder_present: String,
    pub mental_disorder_evidence: String,
    pub risk_to_own_health: String,
    pub risk_to_own_safety: String,
    pub risk_to_others: String,
    pub risk_evidence: String,
    pub risk_imminence: String,
    pub least_restrictive_met: String,
    pub alternatives_considered: String,
    pub appropriate_treatment_available: String,
    pub treatment_plan_summary: String,
    pub nearest_relative_identified: String,
    pub nearest_relative_consulted: String,
    pub nearest_relative_objection: String,
    pub consultation_record: String,
    pub recommended_section: String,
    pub outcome: String,
    pub bed_identified: String,
    pub conveyance: String,
    pub clinical_legal_note: String,
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
            "SELECT * FROM mental_health_act_assessments WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM mental_health_act_assessments WHERE deleted_at IS NULL",
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
            "SELECT * FROM mental_health_act_assessments WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE mental_health_act_assessments SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE mental_health_act_assessment_grades SET deleted_at = \
            now(), updated_at = now() WHERE mental_health_act_assessment_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            mental_health_act_assessment_grade_rules SET deleted_at = now(), updated_at \
            = now() WHERE mental_health_act_assessment_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            mental_health_act_assessment_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE mental_health_act_assessment_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
