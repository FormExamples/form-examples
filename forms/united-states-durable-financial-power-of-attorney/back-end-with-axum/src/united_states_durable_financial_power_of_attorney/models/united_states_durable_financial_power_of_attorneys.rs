//! united_states_durable_financial_power_of_attorneys model.

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
    pub principal_id: Uuid,
    pub agent_id: Option<Uuid>,
    pub principal_name: String,
    pub date_of_birth: Option<Date>,
    pub state: String,
    pub principal_address: String,
    pub capacity_confirmed: String,
    pub durable_statement: String,
    pub effectiveness: String,
    pub springing_trigger: String,
    pub statutory_notice_included: String,
    pub agent_name: String,
    pub agent_relationship: String,
    pub agent_is_adult: String,
    pub agent_signed_acknowledgment: String,
    pub successor_agent_name: String,
    pub co_agents_mode: String,
    pub compensation: String,
    pub compensation_amount: Option<f64>,
    pub grant_banking: String,
    pub grant_real_estate: String,
    pub grant_investments: String,
    pub grant_business: String,
    pub grant_insurance: String,
    pub grant_tax_matters: String,
    pub grant_benefits: String,
    pub grant_retirement: String,
    pub grant_claims: String,
    pub grant_personal_property: String,
    pub hot_create_trust: String,
    pub hot_gift: String,
    pub hot_survivorship: String,
    pub hot_beneficiary: String,
    pub hot_delegate: String,
    pub hot_annuity_waiver: String,
    pub hot_disclaim: String,
    pub hot_powers_initialed: String,
    pub gift_limit_type: String,
    pub gift_limit_amount: Option<f64>,
    pub self_gifting_allowed: String,
    pub notary_arranged: String,
    pub witness_count: Option<i32>,
    pub witness_is_agent: String,
    pub used_for_real_estate: String,
    pub bank_form_completed: String,
    pub form2848_status: String,
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
            "SELECT * FROM united_states_durable_financial_power_of_attorneys WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM united_states_durable_financial_power_of_attorneys WHERE id = $1 AND \
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
            "WITH target AS (UPDATE united_states_durable_financial_power_of_attorneys SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_durable_financial_power_of_attorney_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_durable_financial_power_of_attorney_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_durable_financial_power_of_attorney_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_durable_financial_power_of_attorney_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_states_durable_financial_power_of_attorney_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_states_durable_financial_power_of_attorney_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
