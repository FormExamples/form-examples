//! united_states_last_will_and_testaments model.

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
    pub state: String,
    pub testator_name: String,
    pub testator_date_of_birth: Option<Date>,
    pub sound_mind: String,
    pub undue_influence_concern: String,
    pub marital_status: String,
    pub spouse_name: String,
    pub spouse_inheritance_value: Option<f64>,
    pub spouse_waived_elective_share: String,
    pub has_minor_children: String,
    pub guardian_for_minors_name: String,
    pub disinherits_child: String,
    pub disinherited_child_named: String,
    pub estimated_estate_value: Option<f64>,
    pub specific_bequests_total: Option<f64>,
    pub specific_bequests_summary: String,
    pub residuary_clause_present: String,
    pub residuary_1_name: String,
    pub residuary_1_percent: Option<f64>,
    pub residuary_2_name: String,
    pub residuary_2_percent: Option<f64>,
    pub residuary_3_name: String,
    pub residuary_3_percent: Option<f64>,
    pub contingent_beneficiary_named: String,
    pub personal_representative_name: String,
    pub successor_personal_representative_name: String,
    pub bond_waived: String,
    pub revokes_prior_wills_clause: String,
    pub no_contest_clause: String,
    pub digital_assets_clause: String,
    pub estate_tax_reviewed: String,
    pub original_will_location: String,
    pub drafter_note: String,
    pub execution_form: String,
    pub execution_date: Option<Date>,
    pub signed_at_end: String,
    pub signed_in_witness_presence: String,
    pub witnesses_signed_in_testator_presence: String,
    pub holographic_entirely_handwritten: String,
    pub witness_1_name: String,
    pub witness_1_beneficiary: String,
    pub witness_2_name: String,
    pub witness_2_beneficiary: String,
    pub witness_3_name: String,
    pub witness_3_beneficiary: String,
    pub self_proving_affidavit: String,
    pub notary_name: String,
    pub notary_acknowledged: String,
    pub testator_id: Uuid,
    pub attorney_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(
        db: &PgPool,
        page: &axa::cursor_pagination::CursorPage,
    ) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM united_states_last_will_and_testaments WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM united_states_last_will_and_testaments WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "WITH target AS (UPDATE united_states_last_will_and_testaments SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE united_states_last_will_and_testament_grades SET deleted_at = \
            now(), updated_at = now() WHERE united_states_last_will_and_testament_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_last_will_and_testament_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_last_will_and_testament_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_states_last_will_and_testament_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE united_states_last_will_and_testament_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
