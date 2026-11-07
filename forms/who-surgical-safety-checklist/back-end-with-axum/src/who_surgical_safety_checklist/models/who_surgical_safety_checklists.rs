//! Who surgical safety checklists module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Status.
    pub status: String,
    /// Site name.
    pub site_name: String,
    /// Operating room.
    pub operating_room: String,
    /// Case date.
    pub case_date: Option<Date>,
    /// Case start at.
    pub case_start_at: Option<DateTimeWithTimeZone>,
    /// Case end at.
    pub case_end_at: Option<DateTimeWithTimeZone>,
    /// Planned procedure.
    pub planned_procedure: String,
    /// Surgical specialty.
    pub surgical_specialty: String,
    /// Urgency.
    pub urgency: String,
    /// Laterality.
    pub laterality: String,
    /// Is paediatric.
    pub is_paediatric: String,
    /// Abandoned reason.
    pub abandoned_reason: String,
    /// Sign in identity site procedure consent.
    pub sign_in_identity_site_procedure_consent: String,
    /// Sign in site marked.
    pub sign_in_site_marked: String,
    /// Sign in anaesthesia check complete.
    pub sign_in_anaesthesia_check_complete: String,
    /// Sign in pulse oximeter on patient.
    pub sign_in_pulse_oximeter_on_patient: String,
    /// Sign in known allergy.
    pub sign_in_known_allergy: String,
    /// Sign in known allergy detail.
    pub sign_in_known_allergy_detail: String,
    /// Sign in difficult airway aspiration risk.
    pub sign_in_difficult_airway_aspiration_risk: String,
    /// Sign in blood loss risk.
    pub sign_in_blood_loss_risk: String,
    /// Sign in completed at.
    pub sign_in_completed_at: Option<DateTimeWithTimeZone>,
    /// Time out team introductions confirmed.
    pub time_out_team_introductions_confirmed: String,
    /// Time out patient procedure incision confirmed.
    pub time_out_patient_procedure_incision_confirmed: String,
    /// Time out antibiotic prophylaxis within 60min.
    pub time_out_antibiotic_prophylaxis_within_60min: String,
    /// Time out surgeon critical steps.
    pub time_out_surgeon_critical_steps: String,
    /// Time out surgeon case duration minutes.
    pub time_out_surgeon_case_duration_minutes: Option<i32>,
    /// Time out surgeon anticipated blood loss ml.
    pub time_out_surgeon_anticipated_blood_loss_ml: Option<i32>,
    /// Time out anaesthetist patient concerns.
    pub time_out_anaesthetist_patient_concerns: String,
    /// Time out nursing sterility confirmed.
    pub time_out_nursing_sterility_confirmed: String,
    /// Time out nursing equipment concerns.
    pub time_out_nursing_equipment_concerns: String,
    /// Time out essential imaging displayed.
    pub time_out_essential_imaging_displayed: String,
    /// Time out completed at.
    pub time_out_completed_at: Option<DateTimeWithTimeZone>,
    /// Sign out procedure name confirmed.
    pub sign_out_procedure_name_confirmed: String,
    /// Sign out counts confirmed.
    pub sign_out_counts_confirmed: String,
    /// Sign out specimens labelled.
    pub sign_out_specimens_labelled: String,
    /// Sign out equipment problems.
    pub sign_out_equipment_problems: String,
    /// Sign out recovery concerns.
    pub sign_out_recovery_concerns: String,
    /// Sign out completed at.
    pub sign_out_completed_at: Option<DateTimeWithTimeZone>,
    /// Patient id.
    pub patient_id: Uuid,
    /// Surgeon id.
    pub surgeon_id: Option<Uuid>,
    /// Anaesthetist id.
    pub anaesthetist_id: Option<Uuid>,
    /// Lead nurse id.
    pub lead_nurse_id: Option<Uuid>,
    /// Sign in coordinator id.
    pub sign_in_coordinator_id: Option<Uuid>,
    /// Time out coordinator id.
    pub time_out_coordinator_id: Option<Uuid>,
    /// Sign out coordinator id.
    pub sign_out_coordinator_id: Option<Uuid>,
}
/// Who surgical safety checklists.
pub type WhoSurgicalSafetyChecklists = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM who_surgical_safety_checklists WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM who_surgical_safety_checklists WHERE deleted_at IS NULL",
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
            "SELECT * FROM who_surgical_safety_checklists WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE who_surgical_safety_checklists SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE team_members SET deleted_at = now(), updated_at = \
            now() WHERE checklist_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
