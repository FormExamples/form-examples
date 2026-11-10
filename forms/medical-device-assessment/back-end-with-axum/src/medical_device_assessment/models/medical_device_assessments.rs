//! Medical device assessments module.

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
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// Device name.
    pub device_name: String,
    /// Model or catalogue number.
    pub model_or_catalogue_number: String,
    /// Unique device identifier.
    pub unique_device_identifier: String,
    /// Intended purpose.
    pub intended_purpose: String,
    /// Intended user.
    pub intended_user: String,
    /// Target jurisdiction.
    pub target_jurisdiction: String,
    /// Is in vitro diagnostic.
    pub is_in_vitro_diagnostic: String,
    /// Device kind.
    pub device_kind: String,
    /// Contact duration.
    pub contact_duration: String,
    /// Body site.
    pub body_site: String,
    /// Channels or stores body substances.
    pub channels_or_stores_body_substances: String,
    /// Connected to active device class iia or higher.
    pub connected_to_active_device_class_iia_or_higher: String,
    /// Reusable surgical instrument.
    pub reusable_surgical_instrument: String,
    /// Active therapeutic.
    pub active_therapeutic: String,
    /// Active diagnostic.
    pub active_diagnostic: String,
    /// Administers or exchanges energy.
    pub administers_or_exchanges_energy: String,
    /// Energy potentially hazardous.
    pub energy_potentially_hazardous: String,
    /// Administers or removes medicinal substances.
    pub administers_or_removes_medicinal_substances: String,
    /// Administration potentially hazardous.
    pub administration_potentially_hazardous: String,
    /// Monitors vital physiological parameters.
    pub monitors_vital_physiological_parameters: String,
    /// Closed loop therapy.
    pub closed_loop_therapy: String,
    /// Software purpose.
    pub software_purpose: String,
    /// Software worst case harm.
    pub software_worst_case_harm: String,
    /// Contains medicinal substance.
    pub contains_medicinal_substance: String,
    /// Contains human or animal tissue.
    pub contains_human_or_animal_tissue: String,
    /// Contains nanomaterial with high exposure potential.
    pub contains_nanomaterial_with_high_exposure_potential: String,
    /// Composed of absorbed substances.
    pub composed_of_absorbed_substances: String,
    /// Contraception or sti prevention.
    pub contraception_or_sti_prevention: String,
    /// Disinfects or cleans devices.
    pub disinfects_or_cleans_devices: String,
    /// Supplied sterile.
    pub supplied_sterile: String,
    /// Has measuring function.
    pub has_measuring_function: String,
    /// Clinical evidence status.
    pub clinical_evidence_status: String,
    /// Risk management file iso 14971.
    pub risk_management_file_iso_14971: String,
    /// Quality management system iso 13485.
    pub quality_management_system_iso_13485: String,
    /// Cybersecurity assessment done.
    pub cybersecurity_assessment_done: String,
    /// Post market surveillance plan.
    pub post_market_surveillance_plan: String,
    /// Unique device identifier assigned.
    pub unique_device_identifier_assigned: String,
    /// Assessor notes.
    pub assessor_notes: String,
    /// Manufacturer ID.
    pub manufacturer_id: Uuid,
    /// Assessor ID.
    pub assessor_id: Uuid,
}
/// Medical device assessments.
pub type MedicalDeviceAssessments = Model;

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
            "SELECT * FROM medical_device_assessments WHERE deleted_at IS NULL ORDER BY \
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
            "SELECT * FROM medical_device_assessments WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE medical_device_assessments SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE medical_device_assessment_grades SET deleted_at = now(), \
            updated_at = now() WHERE medical_device_assessment_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            medical_device_assessment_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child3 AS (UPDATE medical_device_assessment_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE \
            medical_device_assessment_grade_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
