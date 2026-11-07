//! Inpatient clinical notes module.

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
    /// Note type.
    pub note_type: String,
    /// Hospital name.
    pub hospital_name: String,
    /// Ward name.
    pub ward_name: String,
    /// Bed number.
    pub bed_number: String,
    /// Note at.
    pub note_at: Option<DateTimeWithTimeZone>,
    /// Author name.
    pub author_name: String,
    /// Author grade.
    pub author_grade: String,
    /// Author registration number.
    pub author_registration_number: String,
    /// Parent specialty.
    pub parent_specialty: String,
    /// Responsible consultant name.
    pub responsible_consultant_name: String,
    /// Consult question.
    pub consult_question: String,
    /// Consult requesting team.
    pub consult_requesting_team: String,
    /// Procedure performed.
    pub procedure_performed: String,
    /// Procedure detail.
    pub procedure_detail: String,
    /// Procedure consent.
    pub procedure_consent: String,
    /// Procedure complications.
    pub procedure_complications: String,
    /// Transfer from ward.
    pub transfer_from_ward: String,
    /// Transfer to ward.
    pub transfer_to_ward: String,
    /// Transfer reason.
    pub transfer_reason: String,
    /// Admission at.
    pub admission_at: Option<DateTimeWithTimeZone>,
    /// Admitting specialty.
    pub admitting_specialty: String,
    /// Admission method.
    pub admission_method: String,
    /// Admission reason.
    pub admission_reason: String,
    /// Interval history.
    pub interval_history: String,
    /// No interval events.
    pub no_interval_events: String,
    /// Overnight events.
    pub overnight_events: String,
    /// Patient reported symptoms.
    pub patient_reported_symptoms: String,
    /// Nursing concerns.
    pub nursing_concerns: String,
    /// Pain score.
    pub pain_score: Option<i32>,
    /// Sleep quality.
    pub sleep_quality: String,
    /// Oral intake.
    pub oral_intake: String,
    /// Bowels last opened.
    pub bowels_last_opened: Option<Date>,
    /// Mobility status.
    pub mobility_status: String,
    /// Observed at.
    pub observed_at: Option<DateTimeWithTimeZone>,
    /// Respiratory rate.
    pub respiratory_rate: Option<i32>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<i32>,
    /// Spo2 scale.
    pub spo2_scale: String,
    /// Oxygen delivery.
    pub oxygen_delivery: String,
    /// Oxygen flow litres per minute.
    pub oxygen_flow_litres_per_minute: Option<Decimal>,
    /// Systolic blood pressure.
    pub systolic_blood_pressure: Option<i32>,
    /// Diastolic blood pressure.
    pub diastolic_blood_pressure: Option<i32>,
    /// Pulse rate.
    pub pulse_rate: Option<i32>,
    /// Acvpu.
    pub acvpu: String,
    /// Temperature celsius.
    pub temperature_celsius: Option<Decimal>,
    /// News2 total.
    pub news2_total: Option<i32>,
    /// News2 derived total.
    pub news2_derived_total: Option<i32>,
    /// News2 trend.
    pub news2_trend: String,
    /// News2 applicable.
    pub news2_applicable: String,
    /// News2 not applicable reason.
    pub news2_not_applicable_reason: String,
    /// Examination general.
    pub examination_general: String,
    /// Examination cardiovascular.
    pub examination_cardiovascular: String,
    /// Examination respiratory.
    pub examination_respiratory: String,
    /// Examination abdominal.
    pub examination_abdominal: String,
    /// Examination neurological.
    pub examination_neurological: String,
    /// Examination musculoskeletal.
    pub examination_musculoskeletal: String,
    /// Examination skin and wounds.
    pub examination_skin_and_wounds: String,
    /// Examination lines and drains.
    pub examination_lines_and_drains: String,
    /// Examination other.
    pub examination_other: String,
    /// No investigations reviewed.
    pub no_investigations_reviewed: String,
    /// No medication changes.
    pub no_medication_changes: String,
    /// Allergy checked.
    pub allergy_checked: String,
    /// Medicines reconciliation status.
    pub medicines_reconciliation_status: String,
    /// Antimicrobial review status.
    pub antimicrobial_review_status: String,
    /// Antimicrobial review at.
    pub antimicrobial_review_at: Option<DateTimeWithTimeZone>,
    /// Vte status.
    pub vte_status: String,
    /// Vte prophylaxis.
    pub vte_prophylaxis: String,
    /// Vte assessed at.
    pub vte_assessed_at: Option<DateTimeWithTimeZone>,
    /// Vte notes.
    pub vte_notes: String,
    /// Falls risk.
    pub falls_risk: String,
    /// Falls interventions.
    pub falls_interventions: String,
    /// Pressure ulcer risk.
    pub pressure_ulcer_risk: String,
    /// Skin integrity.
    pub skin_integrity: String,
    /// Pressure ulcer grade.
    pub pressure_ulcer_grade: String,
    /// Pressure ulcer sites.
    pub pressure_ulcer_sites: String,
    /// Delirium screen.
    pub delirium_screen: String,
    /// Delirium 4at score.
    pub delirium_4at_score: Option<i32>,
    /// Delirium notes.
    pub delirium_notes: String,
    /// Nutrition screen.
    pub nutrition_screen: String,
    /// Must score.
    pub must_score: Option<i32>,
    /// Nutrition plan.
    pub nutrition_plan: String,
    /// Infection status.
    pub infection_status: String,
    /// Isolation status.
    pub isolation_status: String,
    /// Organism.
    pub organism: String,
    /// Infection precautions.
    pub infection_precautions: String,
    /// Safeguarding concern.
    pub safeguarding_concern: String,
    /// Safeguarding notes.
    pub safeguarding_notes: String,
    /// Safeguarding referral made.
    pub safeguarding_referral_made: String,
    /// Clinical impression.
    pub clinical_impression: String,
    /// Differential diagnosis.
    pub differential_diagnosis: String,
    /// Response to treatment.
    pub response_to_treatment: String,
    /// New oxygen requirement.
    pub new_oxygen_requirement: String,
    /// New confusion.
    pub new_confusion: String,
    /// Sepsis screen.
    pub sepsis_screen: String,
    /// Arrest call.
    pub arrest_call: String,
    /// Critical care referral.
    pub critical_care_referral: String,
    /// New organ support.
    pub new_organ_support: String,
    /// Plan.
    pub plan: String,
    /// Escalation status.
    pub escalation_status: String,
    /// Escalation action.
    pub escalation_action: String,
    /// Ceiling of care.
    pub ceiling_of_care: String,
    /// Respect status.
    pub respect_status: String,
    /// Dnacpr status.
    pub dnacpr_status: String,
    /// Senior review needed.
    pub senior_review_needed: String,
    /// Senior review by.
    pub senior_review_by: String,
    /// Senior review at.
    pub senior_review_at: Option<DateTimeWithTimeZone>,
    /// Estimated discharge date.
    pub estimated_discharge_date: Option<Date>,
    /// Discharge planning notes.
    pub discharge_planning_notes: String,
    /// Family communication.
    pub family_communication: String,
    /// Patient communication.
    pub patient_communication: String,
    /// Team handover.
    pub team_handover: String,
    /// Consent status.
    pub consent_status: String,
    /// Capacity assessed.
    pub capacity_assessed: String,
    /// Capacity notes.
    pub capacity_notes: String,
    /// Author override acuity.
    pub author_override_acuity: String,
    /// Author override reason.
    pub author_override_reason: String,
    /// Attestation text.
    pub attestation_text: String,
    /// Electronic signature.
    pub electronic_signature: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Patient ID.
    pub patient_id: Uuid,
    /// Author ID.
    pub author_id: Uuid,
    /// Responsible consultant ID.
    pub responsible_consultant_id: Option<Uuid>,
}
/// Inpatient clinical notes.
pub type InpatientClinicalNotes = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM inpatient_clinical_notes WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM inpatient_clinical_notes WHERE deleted_at IS NULL",
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
            "SELECT * FROM inpatient_clinical_notes WHERE id = $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE inpatient_clinical_notes SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE inpatient_clinical_note_problems SET deleted_at = now(), \
            updated_at = now() WHERE inpatient_clinical_note_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            inpatient_clinical_note_medication_changes SET deleted_at = now(), \
            updated_at = now() WHERE inpatient_clinical_note_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            inpatient_clinical_note_investigations SET deleted_at = now(), updated_at = \
            now() WHERE inpatient_clinical_note_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            inpatient_clinical_note_jobs SET deleted_at = now(), updated_at = now() \
            WHERE inpatient_clinical_note_id IN (SELECT id FROM target) AND deleted_at \
            IS NULL RETURNING id), child5 AS (UPDATE inpatient_clinical_note_grades SET \
            deleted_at = now(), updated_at = now() WHERE inpatient_clinical_note_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child6 AS \
            (UPDATE inpatient_clinical_note_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE inpatient_clinical_note_grade_id IN (SELECT id FROM \
            child5) AND deleted_at IS NULL RETURNING id), child7 AS (UPDATE \
            inpatient_clinical_note_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE inpatient_clinical_note_grade_id IN (SELECT id FROM child5) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
