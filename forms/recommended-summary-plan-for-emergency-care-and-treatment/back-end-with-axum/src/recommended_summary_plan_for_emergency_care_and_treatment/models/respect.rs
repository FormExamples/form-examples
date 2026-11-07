//! respect model.

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
    pub person_name: String,
    pub date_of_birth: Option<Date>,
    pub identifier: String,
    pub address: String,
    pub key_contact: String,
    pub health_summary: String,
    pub diagnoses: String,
    pub existing_documents: String,
    pub what_matters: String,
    pub care_preferences: String,
    pub priority_balance: String,
    pub recommended_interventions: String,
    pub not_recommended_interventions: String,
    pub cpr_recommendation: String,
    pub cpr_rationale: String,
    pub cpr_discussed: String,
    pub hospital_transfer: String,
    pub critical_care_admission: String,
    pub treatment_ceilings: String,
    pub has_capacity: String,
    pub capacity_assessment: String,
    pub involvement: String,
    pub proxy_details: String,
    pub clinician_name: String,
    pub clinician_role: String,
    pub clinician_registration: String,
    pub signature: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub senior_endorsement: String,
    pub emergency_contacts: String,
    pub review_date: Option<Date>,
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
            "SELECT * FROM respect WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET \
            $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM respect WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM respect WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE respect SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            respect_grades SET deleted_at = now(), updated_at = now() WHERE respect_id \
            IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE respect_grade_rules SET deleted_at = now(), updated_at = now() WHERE \
            respect_grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING \
            id), child3 AS (UPDATE respect_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE respect_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
