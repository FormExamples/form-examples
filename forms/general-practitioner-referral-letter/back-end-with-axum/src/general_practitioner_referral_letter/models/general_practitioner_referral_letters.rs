//! general_practitioner_referral_letters model.

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
    pub patient_identifier: String,
    pub referrer_role: String,
    pub referring_practice: String,
    pub referral_date: Option<Date>,
    pub access_needs: String,
    pub referral_specialty: String,
    pub named_clinician: String,
    pub receiving_organisation: String,
    pub urgency: String,
    pub urgency_reason: String,
    pub suspected_cancer_criterion: String,
    pub suspected_cancer_pathway: String,
    pub reason_for_referral: String,
    pub relevant_history: String,
    pub presenting_problem: String,
    pub symptom_duration: String,
    pub red_flag_symptoms: String,
    pub examination_findings: String,
    pub investigation_results: String,
    pub current_medications: String,
    pub allergies: String,
    pub patient_expectations: String,
    pub consent_to_share: String,
    pub safety_netting: String,
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
        let rows = sqlx::query_as(
            "SELECT * FROM general_practitioner_referral_letters WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM general_practitioner_referral_letters WHERE deleted_at \
            IS NULL",
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
            "SELECT * FROM general_practitioner_referral_letters WHERE id = $1 AND \
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
            "WITH target AS (UPDATE general_practitioner_referral_letters SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE general_practitioner_referral_letter_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            general_practitioner_referral_letter_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            general_practitioner_referral_letter_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE general_practitioner_referral_letter_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE general_practitioner_referral_letter_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            general_practitioner_referral_letter_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
