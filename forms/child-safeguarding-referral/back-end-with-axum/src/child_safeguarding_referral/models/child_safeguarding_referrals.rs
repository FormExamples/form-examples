//! child_safeguarding_referrals model.

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
    pub referrer_organisation: String,
    pub referred_at: Option<DateTimeWithTimeZone>,
    pub relationship_to_child: String,
    pub child_age: Option<f64>,
    pub child_setting: String,
    pub child_reference: String,
    pub child_ethnicity: String,
    pub child_first_language: String,
    pub child_disability: String,
    pub carers: String,
    pub household_members: String,
    pub other_children: String,
    pub professionals_involved: String,
    pub concern_description: String,
    pub concern_onset: String,
    pub child_disclosed: String,
    pub referrer_observations: String,
    pub primary_category: String,
    pub additional_categories: String,
    pub presenting_evidence: String,
    pub immediate_danger: String,
    pub child_whereabouts: String,
    pub who_with_child: String,
    pub alleged_person_in_contact: String,
    pub other_children_at_risk: String,
    pub consent_sought: String,
    pub consent_status: String,
    pub sharing_basis_without_consent: String,
    pub family_aware: String,
    pub unsafe_to_inform_reason: String,
    pub agencies_contacted: String,
    pub strategy_discussion_held: String,
    pub previous_safeguarding_history: String,
    pub requested_action: String,
    pub referrer_declaration: String,
    pub notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM child_safeguarding_referrals WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as(
            "SELECT * FROM child_safeguarding_referrals WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE child_safeguarding_referrals SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE child_safeguarding_referral_grades SET deleted_at = now(), \
            updated_at = now() WHERE child_safeguarding_referral_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            child_safeguarding_referral_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE child_safeguarding_referral_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            child_safeguarding_referral_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE child_safeguarding_referral_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
