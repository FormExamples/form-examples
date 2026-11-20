//! United states divorce petitions module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Petitioner id.
    pub petitioner_id: Uuid,
    /// Attorney id.
    pub attorney_id: Option<Uuid>,
    /// State.
    pub state: String,
    /// County.
    pub county: String,
    /// Filing date.
    pub filing_date: Option<Date>,
    /// Case type.
    pub case_type: String,
    /// Ground type.
    pub ground_type: String,
    /// Fault ground.
    pub fault_ground: String,
    /// Petitioner name.
    pub petitioner_name: String,
    /// Respondent name.
    pub respondent_name: String,
    /// Marriage date.
    pub marriage_date: Option<Date>,
    /// Marriage place.
    pub marriage_place: String,
    /// Separation date.
    pub separation_date: Option<Date>,
    /// Petitioner residency months.
    pub petitioner_residency_months: Option<i32>,
    /// County residency days.
    pub county_residency_days: Option<i32>,
    /// Married or lived in state.
    pub married_or_lived_in_state: String,
    /// Respondent military.
    pub respondent_military: String,
    /// Has minor children.
    pub has_minor_children: String,
    /// Children count.
    pub children_count: Option<i32>,
    /// Children home state months.
    pub children_home_state_months: Option<i32>,
    /// Pregnant.
    pub pregnant: String,
    /// Custody plan documented.
    pub custody_plan_documented: String,
    /// Child support worksheet completed.
    pub child_support_worksheet_completed: String,
    /// Child support monthly amount.
    pub child_support_monthly_amount: Option<f64>,
    /// Property division approach.
    pub property_division_approach: String,
    /// Settlement agreement signed.
    pub settlement_agreement_signed: String,
    /// Financial disclosure filed.
    pub financial_disclosure_filed: String,
    /// Spousal support requested.
    pub spousal_support_requested: String,
    /// Service method.
    pub service_method: String,
    /// Service date.
    pub service_date: Option<Date>,
    /// Respondent responded.
    pub respondent_responded: String,
    /// Decree entered.
    pub decree_entered: String,
    /// Decree date.
    pub decree_date: Option<Date>,
    /// Name restoration requested.
    pub name_restoration_requested: String,
    /// Name to restore.
    pub name_to_restore: String,
    /// Certificate requested.
    pub certificate_requested: String,
}
/// United states divorce petitions.
pub type UnitedStatesDivorcePetitions = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_states_divorce_petitions WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM united_states_divorce_petitions WHERE id = $1 AND deleted_at \
            IS NULL")
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
        sqlx::query("WITH target AS (UPDATE united_states_divorce_petitions SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_divorce_petition_grades SET deleted_at \
            = now(), updated_at = now() WHERE united_states_divorce_petition_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE united_states_divorce_petition_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_divorce_petition_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_states_divorce_petition_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE united_states_divorce_petition_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
