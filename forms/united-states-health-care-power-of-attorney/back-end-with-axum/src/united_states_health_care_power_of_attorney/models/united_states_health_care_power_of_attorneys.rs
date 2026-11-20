//! united_states_health_care_power_of_attorneys model.

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
    pub principal_id: Uuid,
    pub reviewer_id: Option<Uuid>,
    pub principal_name: String,
    pub birth_date: Option<Date>,
    pub agent_name: String,
    pub state_code: String,
    pub phone: String,
    pub capacity_confirmed: String,
    pub signed_voluntarily: String,
    pub agent_relationship: String,
    pub agent_age: Option<i32>,
    pub agent_phone: String,
    pub agent_is_health_care_provider: String,
    pub agent_is_facility_employee: String,
    pub agent_related_to_principal: String,
    pub agent_accepted: String,
    pub successor1_name: String,
    pub successor1_phone: String,
    pub successor2_name: String,
    pub effective_when: String,
    pub incapacity_determined_by: String,
    pub hipaa_release: String,
    pub mental_health_authority: String,
    pub organ_donation: String,
    pub prior_directive_status: String,
    pub life_sustaining_treatment: String,
    pub cpr: String,
    pub ventilator: String,
    pub artificial_nutrition: String,
    pub comfort_care_first: String,
    pub serious_illness: String,
    pub polst_status: String,
    pub wishes_note: String,
    pub signature_date: Option<Date>,
    pub execution_method: String,
    pub witnesses_present: String,
    pub witness1_name: String,
    pub witness1_is_relative: String,
    pub witness1_is_heir: String,
    pub witness1_is_agent: String,
    pub witness1_is_provider: String,
    pub witness2_name: String,
    pub witness2_is_relative: String,
    pub witness2_is_heir: String,
    pub witness2_is_agent: String,
    pub witness2_is_provider: String,
    pub notary_name: String,
    pub principal_in_skilled_nursing_facility: String,
    pub ombudsman_signed: String,
    pub copy_to_agent: String,
    pub copy_to_physician: String,
    pub copy_to_successor: String,
    pub copy_to_facility: String,
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
            "SELECT * FROM united_states_health_care_power_of_attorneys WHERE deleted_at IS \
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
            "SELECT * FROM united_states_health_care_power_of_attorneys WHERE id = $1 AND \
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
            "WITH target AS (UPDATE united_states_health_care_power_of_attorneys SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_health_care_power_of_attorney_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_health_care_power_of_attorney_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_health_care_power_of_attorney_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_health_care_power_of_attorney_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_states_health_care_power_of_attorney_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_states_health_care_power_of_attorney_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
