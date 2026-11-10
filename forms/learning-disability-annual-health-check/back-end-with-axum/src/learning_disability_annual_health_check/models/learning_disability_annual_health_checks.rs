//! learning_disability_annual_health_checks model.

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
    pub clinician_name: String,
    pub clinician_role: String,
    pub checked_on: Option<Date>,
    pub practice_name: String,
    pub easy_read_invitation_sent: String,
    pub pre_check_done: String,
    pub person_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub ld_register_status: String,
    pub main_carer: String,
    pub communication_needs: String,
    pub reasonable_adjustments_recorded: String,
    pub health_passport: String,
    pub consent_capacity_note: String,
    pub weight_bmi_status: String,
    pub bmi: Option<f64>,
    pub blood_pressure_status: String,
    pub epilepsy_status: String,
    pub constipation_status: String,
    pub dysphagia_status: String,
    pub continence_status: String,
    pub mobility_falls_status: String,
    pub dental_status: String,
    pub vision_status: String,
    pub hearing_status: String,
    pub foot_health_status: String,
    pub skin_status: String,
    pub physical_health_actions: String,
    pub cancer_screening_status: String,
    pub other_screening_status: String,
    pub immunisation_status: String,
    pub medication_reconciled: String,
    pub psychotropic_prescribed: String,
    pub psychotropic_indication: String,
    pub psychotropic_last_reviewed: Option<Date>,
    pub stomp_discussed: String,
    pub medication_side_effects: String,
    pub mental_health_status: String,
    pub behaviour_status: String,
    pub behaviour_triggers: String,
    pub syndrome_specific_status: String,
    pub carer_needs_status: String,
    pub social_circumstances: String,
    pub health_action_plan_produced: String,
    pub health_action_plan_shared: String,
    pub health_action_plan_actions: String,
    pub clinician_note: String,
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
            "SELECT * FROM learning_disability_annual_health_checks WHERE deleted_at IS \
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
            "SELECT * FROM learning_disability_annual_health_checks WHERE id = $1 AND \
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
            "WITH target AS (UPDATE learning_disability_annual_health_checks SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            learning_disability_annual_health_check_grades SET deleted_at = now(), \
            updated_at = now() WHERE learning_disability_annual_health_check_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE learning_disability_annual_health_check_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE \
            learning_disability_annual_health_check_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            learning_disability_annual_health_check_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE learning_disability_annual_health_check_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
