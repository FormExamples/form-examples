//! lumbar_puncture_test_requests model.

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
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub procedure_intent: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub suspected_raised_intracranial_pressure: bool,
    pub focal_neurological_signs: bool,
    pub reduced_consciousness: bool,
    pub ct_head_status: String,
    pub taking_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub taking_antiplatelet: bool,
    pub antiplatelet_agent: String,
    pub inr: Option<f64>,
    pub platelet_count: Option<f64>,
    pub bleeding_disorder: bool,
    pub local_skin_infection: bool,
    pub opening_pressure_required: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
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
            "SELECT * FROM lumbar_puncture_test_requests WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM lumbar_puncture_test_requests WHERE deleted_at IS NULL",
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
            "SELECT * FROM lumbar_puncture_test_requests WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE lumbar_puncture_test_requests SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE lumbar_puncture_test_request_grades SET deleted_at = \
            now(), updated_at = now() WHERE lumbar_puncture_test_request_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            lumbar_puncture_test_request_grade_rules SET deleted_at = now(), updated_at \
            = now() WHERE lumbar_puncture_test_request_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            lumbar_puncture_test_request_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE lumbar_puncture_test_request_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
