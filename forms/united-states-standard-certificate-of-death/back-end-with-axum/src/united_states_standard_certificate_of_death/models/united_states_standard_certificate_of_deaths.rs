//! united_states_standard_certificate_of_deaths model.

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
    pub certifier_name: String,
    pub certifier_type: String,
    pub certifier_license_number: String,
    pub disposition_place: String,
    pub certification_date: Option<Date>,
    pub attended_deceased: String,
    pub last_seen_alive_date: Option<Date>,
    pub decedent_name: String,
    pub sex: String,
    pub date_of_birth: Option<Date>,
    pub age_years: Option<i32>,
    pub marital_status: String,
    pub date_of_death: Option<Date>,
    pub time_of_death: Option<String>,
    pub place_of_death_facility: String,
    pub place_of_death_type: String,
    pub cause_ia_condition: String,
    pub cause_ia_interval: String,
    pub cause_ib_condition: String,
    pub cause_ib_interval: String,
    pub cause_ic_condition: String,
    pub cause_ic_interval: String,
    pub part_ii_conditions: String,
    pub injury_description: String,
    pub referred_to_medical_examiner: String,
    pub referral_reason: String,
    pub manner_of_death: String,
    pub certifier_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub state: String,
    pub veteran_status: String,
    pub state_of_residence: String,
    pub cause_id_condition: String,
    pub cause_id_interval: String,
    pub autopsy_performed: String,
    pub autopsy_findings_available: String,
    pub tobacco_use_contributed: String,
    pub pregnancy_status: String,
    pub injury_date: Option<Date>,
    pub injury_time: Option<Time>,
    pub injury_place: String,
    pub injury_at_work: String,
    pub injury_location: String,
    pub transportation_injury_role: String,
    pub funeral_director_name: String,
    pub funeral_director_license_number: String,
    pub disposition_method: String,
    pub disposition_date: Option<Date>,
    pub filed_date: Option<Date>,
    pub certified_copies_requested: Option<i32>,
    pub requester_relationship: String,
    pub requester_identity_verified: String,
    pub fee_paid_in_usd: Option<f64>,
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
            "SELECT * FROM united_states_standard_certificate_of_deaths WHERE deleted_at IS \
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
            "SELECT * FROM united_states_standard_certificate_of_deaths WHERE id = $1 AND \
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
            "WITH target AS (UPDATE united_states_standard_certificate_of_deaths SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_standard_certificate_of_death_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_standard_certificate_of_death_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_standard_certificate_of_death_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_standard_certificate_of_death_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_states_standard_certificate_of_death_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_states_standard_certificate_of_death_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
