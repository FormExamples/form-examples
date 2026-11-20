//! United kingdom last will and testaments module.

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
    /// Testator id.
    pub testator_id: Uuid,
    /// Testator name.
    pub testator_name: String,
    /// Date of birth.
    pub date_of_birth: Option<Date>,
    /// Testator address.
    pub testator_address: String,
    /// Domicile.
    pub domicile: String,
    /// Marital status.
    pub marital_status: String,
    /// Marriage expected.
    pub marriage_expected: String,
    /// Contemplation of marriage clause.
    pub contemplation_of_marriage_clause: String,
    /// Has mental capacity.
    pub has_mental_capacity: String,
    /// Made voluntarily.
    pub made_voluntarily: String,
    /// Previous will.
    pub previous_will: String,
    /// Revocation clause.
    pub revocation_clause: String,
    /// Estate value band.
    pub estate_value_band: String,
    /// Owns home.
    pub owns_home: String,
    /// Home to direct descendants.
    pub home_to_direct_descendants: String,
    /// Charity gift percent.
    pub charity_gift_percent: Option<f64>,
    /// Estate other jurisdictions.
    pub estate_other_jurisdictions: String,
    /// Other jurisdictions detail.
    pub other_jurisdictions_detail: String,
    /// Specific gifts notes.
    pub specific_gifts_notes: String,
    /// Executor first name.
    pub executor_first_name: String,
    /// Executor first relationship.
    pub executor_first_relationship: String,
    /// Executor second name.
    pub executor_second_name: String,
    /// Executor second relationship.
    pub executor_second_relationship: String,
    /// Executors adult confirmed.
    pub executors_adult_confirmed: String,
    /// Beneficiary first name.
    pub beneficiary_first_name: String,
    /// Beneficiary first relationship.
    pub beneficiary_first_relationship: String,
    /// Beneficiary first share percent.
    pub beneficiary_first_share_percent: Option<f64>,
    /// Beneficiary first is minor.
    pub beneficiary_first_is_minor: String,
    /// Beneficiary first has trustee.
    pub beneficiary_first_has_trustee: String,
    /// Beneficiary second name.
    pub beneficiary_second_name: String,
    /// Beneficiary second relationship.
    pub beneficiary_second_relationship: String,
    /// Beneficiary second share percent.
    pub beneficiary_second_share_percent: Option<f64>,
    /// Beneficiary second is minor.
    pub beneficiary_second_is_minor: String,
    /// Beneficiary second has trustee.
    pub beneficiary_second_has_trustee: String,
    /// Beneficiary third name.
    pub beneficiary_third_name: String,
    /// Beneficiary third relationship.
    pub beneficiary_third_relationship: String,
    /// Beneficiary third share percent.
    pub beneficiary_third_share_percent: Option<f64>,
    /// Beneficiary third is minor.
    pub beneficiary_third_is_minor: String,
    /// Beneficiary third has trustee.
    pub beneficiary_third_has_trustee: String,
    /// Beneficiary fourth name.
    pub beneficiary_fourth_name: String,
    /// Beneficiary fourth relationship.
    pub beneficiary_fourth_relationship: String,
    /// Beneficiary fourth share percent.
    pub beneficiary_fourth_share_percent: Option<f64>,
    /// Beneficiary fourth is minor.
    pub beneficiary_fourth_is_minor: String,
    /// Beneficiary fourth has trustee.
    pub beneficiary_fourth_has_trustee: String,
    /// Residuary clause.
    pub residuary_clause: String,
    /// Dependants considered.
    pub dependants_considered: String,
    /// Has children under 18.
    pub has_children_under_18: String,
    /// Guardian name.
    pub guardian_name: String,
    /// Funeral wishes.
    pub funeral_wishes: String,
    /// Funeral wishes note.
    pub funeral_wishes_note: String,
    /// Execution status.
    pub execution_status: String,
    /// Date of will.
    pub date_of_will: Option<Date>,
    /// Will in writing.
    pub will_in_writing: String,
    /// Testator signed.
    pub testator_signed: String,
    /// Witnesses present together.
    pub witnesses_present_together: String,
    /// Witnesses signed.
    pub witnesses_signed: String,
    /// Witness first name.
    pub witness_first_name: String,
    /// Witness first over 18.
    pub witness_first_over_18: String,
    /// Witness first is beneficiary or spouse.
    pub witness_first_is_beneficiary_or_spouse: String,
    /// Witness second name.
    pub witness_second_name: String,
    /// Witness second over 18.
    pub witness_second_over_18: String,
    /// Witness second is beneficiary or spouse.
    pub witness_second_is_beneficiary_or_spouse: String,
    /// Drafter note.
    pub drafter_note: String,
}
/// United kingdom last will and testaments.
pub type UnitedKingdomLastWillAndTestaments = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_kingdom_last_will_and_testaments WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM united_kingdom_last_will_and_testaments WHERE id = $1 AND \
            deleted_at IS NULL")
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
        sqlx::query("WITH target AS (UPDATE united_kingdom_last_will_and_testaments SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            united_kingdom_last_will_and_testament_grades SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_last_will_and_testament_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE united_kingdom_last_will_and_testament_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_last_will_and_testament_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_kingdom_last_will_and_testament_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_last_will_and_testament_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
