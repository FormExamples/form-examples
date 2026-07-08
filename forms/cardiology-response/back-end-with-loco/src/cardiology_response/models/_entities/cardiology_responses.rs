//! `SeaORM` entity for the `cardiology_responses` table (source of truth).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Cardiology response (consult reply) model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "cardiology_responses")]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    /// Deleted at (soft-delete).
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Free-text reference back to the originating referral request.
    pub originating_request_reference: String,
    /// Response lifecycle status.
    pub response_status: String,
    /// Type of cardiology consultation.
    pub consultation_type: String,
    /// Date the patient was assessed / reviewed.
    pub assessed_date: Option<Date>,
    /// Date the response was authored / signed.
    pub responded_date: Option<Date>,
    /// Narrative clinical summary of the assessment.
    pub clinical_summary: String,
    /// Cardiovascular examination findings.
    pub examination_findings: String,
    /// Investigations performed or reviewed and their findings.
    pub investigations_performed: String,
    /// Structured finding: ischaemia or coronary artery disease.
    pub ischaemia_or_cad: bool,
    /// Structured finding: significant arrhythmia.
    pub significant_arrhythmia: bool,
    /// Structured finding: reduced left-ventricular ejection fraction.
    pub reduced_ejection_fraction: bool,
    /// Structured finding: significant valve disease.
    pub significant_valve_disease: bool,
    /// Structured finding: structural cardiac abnormality.
    pub structural_abnormality: bool,
    /// Structured finding: uncontrolled hypertension.
    pub uncontrolled_hypertension: bool,
    /// Structured finding: a non-cardiac cause was identified.
    pub non_cardiac_cause: bool,
    /// Primary diagnosis category.
    pub primary_diagnosis_category: String,
    /// Narrative diagnosis answering the referral clinical question.
    pub diagnosis_narrative: String,
    /// Left-ventricular ejection fraction percentage (0-100).
    pub lv_ejection_fraction_percent: Option<f64>,
    /// Management plan including investigations and treatment.
    pub management_plan: String,
    /// Medication changes recommended or made.
    pub medication_changes: String,
    /// Recommended follow-up.
    pub recommended_follow_up: String,
    /// Whether a critical / unexpected significant cardiac result is present.
    pub critical_result: bool,
    /// Whether the critical result was communicated to the referrer.
    pub critical_result_communicated: bool,
    /// Who the critical / urgent result was communicated to.
    pub reported_to: String,
    /// Foreign key to the patient.
    pub patient_id: Uuid,
    /// Foreign key to the responding clinician.
    pub clinician_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent patient.
    #[sea_orm(
        belongs_to = "super::patients::Entity",
        from = "Column::PatientId",
        to = "super::patients::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Patients,
    /// Parent clinician.
    #[sea_orm(
        belongs_to = "super::clinicians::Entity",
        from = "Column::ClinicianId",
        to = "super::clinicians::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Clinicians,
    /// The computed grade (1:1).
    #[sea_orm(has_many = "super::cardiology_response_grades::Entity")]
    CardiologyResponseGrades,
}

impl Related<super::patients::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Patients.def()
    }
}

impl Related<super::clinicians::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Clinicians.def()
    }
}

impl Related<super::cardiology_response_grades::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponseGrades.def()
    }
}
