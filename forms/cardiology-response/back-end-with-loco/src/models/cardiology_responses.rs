//! Cardiology-responses domain model: constructors, mappers, query helpers.

use chrono::Utc;
use sea_orm::{entity::prelude::*, ActiveValue, QueryOrder};

pub use super::_entities::cardiology_responses::{ActiveModel, Column, Entity, Model};
use crate::engine::types::CardiologyResponse;

/// Cardiology responses entity alias.
pub type CardiologyResponses = Entity;

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn before_save<C>(self, _db: &C, insert: bool) -> std::result::Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if !insert && self.updated_at.is_unchanged() {
            let mut this = self;
            this.updated_at = sea_orm::ActiveValue::Set(chrono::Utc::now().into());
            Ok(this)
        } else {
            Ok(self)
        }
    }
}

/// Parse an ISO-8601 `YYYY-MM-DD` string into a `Date`, or `None` if empty / invalid.
fn parse_date(s: &str) -> Option<Date> {
    if s.is_empty() {
        return None;
    }
    chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").ok()
}

impl ActiveModel {
    /// Build an `ActiveModel` for a new response from an engine payload plus
    /// the patient and clinician foreign keys. A fresh draft uses
    /// `CardiologyResponse::default()`.
    #[must_use]
    pub fn from_payload(
        patient_id: Uuid,
        clinician_id: Uuid,
        payload: &CardiologyResponse,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: ActiveValue::NotSet,
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            patient_id: ActiveValue::Set(patient_id),
            clinician_id: ActiveValue::Set(clinician_id),
            originating_request_reference: ActiveValue::Set(
                payload.originating_request_reference.clone(),
            ),
            response_status: ActiveValue::Set(payload.response_status.clone()),
            consultation_type: ActiveValue::Set(payload.consultation_type.clone()),
            assessed_date: ActiveValue::Set(parse_date(&payload.assessed_date)),
            responded_date: ActiveValue::Set(parse_date(&payload.responded_date)),
            clinical_summary: ActiveValue::Set(payload.clinical_summary.clone()),
            examination_findings: ActiveValue::Set(payload.examination_findings.clone()),
            investigations_performed: ActiveValue::Set(payload.investigations_performed.clone()),
            ischaemia_or_cad: ActiveValue::Set(payload.ischaemia_or_cad),
            significant_arrhythmia: ActiveValue::Set(payload.significant_arrhythmia),
            reduced_ejection_fraction: ActiveValue::Set(payload.reduced_ejection_fraction),
            significant_valve_disease: ActiveValue::Set(payload.significant_valve_disease),
            structural_abnormality: ActiveValue::Set(payload.structural_abnormality),
            uncontrolled_hypertension: ActiveValue::Set(payload.uncontrolled_hypertension),
            non_cardiac_cause: ActiveValue::Set(payload.non_cardiac_cause),
            primary_diagnosis_category: ActiveValue::Set(payload.primary_diagnosis_category.clone()),
            diagnosis_narrative: ActiveValue::Set(payload.diagnosis_narrative.clone()),
            lv_ejection_fraction_percent: ActiveValue::Set(payload.lv_ejection_fraction_percent),
            management_plan: ActiveValue::Set(payload.management_plan.clone()),
            medication_changes: ActiveValue::Set(payload.medication_changes.clone()),
            recommended_follow_up: ActiveValue::Set(payload.recommended_follow_up.clone()),
            critical_result: ActiveValue::Set(payload.critical_result),
            critical_result_communicated: ActiveValue::Set(payload.critical_result_communicated),
            reported_to: ActiveValue::Set(payload.reported_to.clone()),
        }
    }
}

impl Model {
    /// Project this row into the engine's [`CardiologyResponse`] payload so the
    /// four-axis grader can run over it.
    #[must_use]
    pub fn to_payload(&self) -> CardiologyResponse {
        CardiologyResponse {
            responding_clinician: String::new(),
            originating_request_reference: self.originating_request_reference.clone(),
            response_status: self.response_status.clone(),
            consultation_type: self.consultation_type.clone(),
            assessed_date: self.assessed_date.map(|d| d.to_string()).unwrap_or_default(),
            responded_date: self
                .responded_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            patient_name: String::new(),
            patient_nhs_number: String::new(),
            patient_birth_date: String::new(),
            clinical_summary: self.clinical_summary.clone(),
            examination_findings: self.examination_findings.clone(),
            investigations_performed: self.investigations_performed.clone(),
            ischaemia_or_cad: self.ischaemia_or_cad,
            significant_arrhythmia: self.significant_arrhythmia,
            reduced_ejection_fraction: self.reduced_ejection_fraction,
            significant_valve_disease: self.significant_valve_disease,
            structural_abnormality: self.structural_abnormality,
            uncontrolled_hypertension: self.uncontrolled_hypertension,
            non_cardiac_cause: self.non_cardiac_cause,
            primary_diagnosis_category: self.primary_diagnosis_category.clone(),
            diagnosis_narrative: self.diagnosis_narrative.clone(),
            lv_ejection_fraction_percent: self.lv_ejection_fraction_percent,
            management_plan: self.management_plan.clone(),
            medication_changes: self.medication_changes.clone(),
            recommended_follow_up: self.recommended_follow_up.clone(),
            critical_result: self.critical_result,
            critical_result_communicated: self.critical_result_communicated,
            reported_to: self.reported_to.clone(),
            clinician_notes: String::new(),
            signed: false,
        }
    }
}

/// Find a response by its UUID.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_by_id(db: &DatabaseConnection, id: Uuid) -> Result<Option<Model>, DbErr> {
    Entity::find_by_id(id).one(db).await
}

/// List all responses, newest first.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn list_all(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Entity::find()
        .order_by_desc(Column::CreatedAt)
        .all(db)
        .await
}
