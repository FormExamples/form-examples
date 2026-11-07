//! Medical operation notes module.

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
    /// Status.
    pub status: String,
    /// Hospital name.
    pub hospital_name: String,
    /// Theatre number.
    pub theatre_number: String,
    /// List type.
    pub list_type: String,
    /// Case start at.
    pub case_start_at: Option<DateTimeWithTimeZone>,
    /// Anaesthesia start at.
    pub anaesthesia_start_at: Option<DateTimeWithTimeZone>,
    /// Knife to skin at.
    pub knife_to_skin_at: Option<DateTimeWithTimeZone>,
    /// End of surgery at.
    pub end_of_surgery_at: Option<DateTimeWithTimeZone>,
    /// Case end at.
    pub case_end_at: Option<DateTimeWithTimeZone>,
    /// Consent status.
    pub consent_status: String,
    /// Side marked.
    pub side_marked: String,
    /// Sign in completed.
    pub sign_in_completed: String,
    /// Asa physical status.
    pub asa_physical_status: String,
    /// Pre operative diagnosis.
    pub pre_operative_diagnosis: String,
    /// Post operative diagnosis.
    pub post_operative_diagnosis: String,
    /// Indication.
    pub indication: String,
    /// Urgency.
    pub urgency: String,
    /// Laterality.
    pub laterality: String,
    /// Anaesthesia type.
    pub anaesthesia_type: String,
    /// Airway management.
    pub airway_management: String,
    /// Induction agent.
    pub induction_agent: String,
    /// Maintenance agent.
    pub maintenance_agent: String,
    /// Neuromuscular blockade.
    pub neuromuscular_blockade: String,
    /// Regional block description.
    pub regional_block_description: String,
    /// Invasive monitoring.
    pub invasive_monitoring: String,
    /// Intraop crystalloid ml.
    pub intraop_crystalloid_ml: Option<i32>,
    /// Intraop colloid ml.
    pub intraop_colloid_ml: Option<i32>,
    /// Intraop blood ml.
    pub intraop_blood_ml: Option<i32>,
    /// Intraop urine ml.
    pub intraop_urine_ml: Option<i32>,
    /// Anaesthetic event.
    pub anaesthetic_event: String,
    /// Anaesthetic event description.
    pub anaesthetic_event_description: String,
    /// Patient position.
    pub patient_position: String,
    /// Pressure area protection notes.
    pub pressure_area_protection_notes: String,
    /// Prep solution.
    pub prep_solution: String,
    /// Drape type.
    pub drape_type: String,
    /// Surgical approach.
    pub surgical_approach: String,
    /// Incision type.
    pub incision_type: String,
    /// Incision length cm.
    pub incision_length_cm: Option<f64>,
    /// Table tilt.
    pub table_tilt: String,
    /// Tourniquet used.
    pub tourniquet_used: String,
    /// Tourniquet site.
    pub tourniquet_site: String,
    /// Tourniquet pressure mmhg.
    pub tourniquet_pressure_mmhg: Option<i32>,
    /// Tourniquet on at.
    pub tourniquet_on_at: Option<DateTimeWithTimeZone>,
    /// Tourniquet off at.
    pub tourniquet_off_at: Option<DateTimeWithTimeZone>,
    /// Converted to open.
    pub converted_to_open: String,
    /// Conversion reason.
    pub conversion_reason: String,
    /// Operative findings summary.
    pub operative_findings_summary: String,
    /// Pathology found.
    pub pathology_found: String,
    /// Anatomical anomalies.
    pub anatomical_anomalies: String,
    /// Intraop photographs taken.
    pub intraop_photographs_taken: String,
    /// Frozen section requested.
    pub frozen_section_requested: String,
    /// Swab count first agreed.
    pub swab_count_first_agreed: String,
    /// Swab count final agreed.
    pub swab_count_final_agreed: String,
    /// Needle count first agreed.
    pub needle_count_first_agreed: String,
    /// Needle count final agreed.
    pub needle_count_final_agreed: String,
    /// Instrument count first agreed.
    pub instrument_count_first_agreed: String,
    /// Instrument count final agreed.
    pub instrument_count_final_agreed: String,
    /// Count discrepancy resolution.
    pub count_discrepancy_resolution: String,
    /// Estimated blood loss ml.
    pub estimated_blood_loss_ml: Option<i32>,
    /// Transfusion given.
    pub transfusion_given: String,
    /// Prbc units.
    pub prbc_units: Option<i32>,
    /// Ffp units.
    pub ffp_units: Option<i32>,
    /// Platelet units.
    pub platelet_units: Option<i32>,
    /// Cryoprecipitate units.
    pub cryoprecipitate_units: Option<i32>,
    /// Cell salvage ml.
    pub cell_salvage_ml: Option<i32>,
    /// Massive haemorrhage protocol activated.
    pub massive_haemorrhage_protocol_activated: String,
    /// Never event flagged.
    pub never_event_flagged: String,
    /// Never event description.
    pub never_event_description: String,
    /// Equipment problem.
    pub equipment_problem: String,
    /// Equipment problem description.
    pub equipment_problem_description: String,
    /// Recovery destination.
    pub recovery_destination: String,
    /// Monitoring frequency.
    pub monitoring_frequency: String,
    /// IV fluids plan.
    pub iv_fluids_plan: String,
    /// Analgesia plan.
    pub analgesia_plan: String,
    /// Antibiotic plan.
    pub antibiotic_plan: String,
    /// Vte prophylaxis plan.
    pub vte_prophylaxis_plan: String,
    /// Diet plan.
    pub diet_plan: String,
    /// Mobilisation plan.
    pub mobilisation_plan: String,
    /// Wound care plan.
    pub wound_care_plan: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Special instructions.
    pub special_instructions: String,
    /// Sign out completed.
    pub sign_out_completed: String,
    /// Debrief completed.
    pub debrief_completed: String,
    /// Surgeon override grade.
    pub surgeon_override_grade: String,
    /// Surgeon override reason.
    pub surgeon_override_reason: String,
    /// Attestation text.
    pub attestation_text: String,
    /// Electronic signature.
    pub electronic_signature: String,
    /// Dictated at.
    pub dictated_at: Option<DateTimeWithTimeZone>,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Patient ID.
    pub patient_id: Uuid,
    /// Lead surgeon ID.
    pub lead_surgeon_id: Uuid,
}
/// Medical operation notes.
pub type MedicalOperationNotes = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM medical_operation_notes WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM medical_operation_notes WHERE deleted_at IS NULL",
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
        sqlx::query_as("SELECT * FROM medical_operation_notes WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE medical_operation_notes SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE medical_operation_note_team_members SET deleted_at = \
            now(), updated_at = now() WHERE medical_operation_note_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            medical_operation_note_procedures SET deleted_at = now(), updated_at = now() \
            WHERE medical_operation_note_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child3 AS (UPDATE medical_operation_note_steps SET \
            deleted_at = now(), updated_at = now() WHERE medical_operation_note_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child4 AS \
            (UPDATE medical_operation_note_implants SET deleted_at = now(), updated_at = \
            now() WHERE medical_operation_note_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child5 AS (UPDATE \
            medical_operation_note_drains SET deleted_at = now(), updated_at = now() \
            WHERE medical_operation_note_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child6 AS (UPDATE medical_operation_note_specimens SET \
            deleted_at = now(), updated_at = now() WHERE medical_operation_note_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child7 AS \
            (UPDATE medical_operation_note_complications SET deleted_at = now(), \
            updated_at = now() WHERE medical_operation_note_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            medical_operation_note_grades SET deleted_at = now(), updated_at = now() \
            WHERE medical_operation_note_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child9 AS (UPDATE medical_operation_note_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE medical_operation_note_grade_id \
            IN (SELECT id FROM child8) AND deleted_at IS NULL RETURNING id), child10 AS \
            (UPDATE medical_operation_note_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE medical_operation_note_grade_id IN (SELECT id FROM \
            child8) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
