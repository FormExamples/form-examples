//! Neurodiversity-adjustment-responses domain model: constructors, mappers, query helpers.

use chrono::Utc;
use sea_orm::{entity::prelude::*, ActiveValue, QueryOrder};

pub use super::_entities::neurodiversity_adjustment_responses::{ActiveModel, Column, Entity, Model};
use crate::engine::types::NeurodiversityAdjustmentResponse;

/// Neurodiversity adjustment responses entity alias.
pub type NeurodiversityAdjustmentResponses = Entity;

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
    /// Build an `ActiveModel` for a new response from an engine payload plus the
    /// worker and manager foreign keys. A fresh draft uses
    /// `NeurodiversityAdjustmentResponse::default()`.
    #[must_use]
    pub fn from_payload(
        worker_id: Uuid,
        manager_id: Uuid,
        payload: &NeurodiversityAdjustmentResponse,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: ActiveValue::NotSet,
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            worker_id: ActiveValue::Set(worker_id),
            manager_id: ActiveValue::Set(manager_id),
            response_status: ActiveValue::Set(payload.response_status.clone()),
            request_reference: ActiveValue::Set(payload.request_reference.clone()),
            handling_method: ActiveValue::Set(payload.handling_method.clone()),
            assessed_date: ActiveValue::Set(parse_date(&payload.assessed_date)),
            responded_date: ActiveValue::Set(parse_date(&payload.responded_date)),
            effective_date: ActiveValue::Set(parse_date(&payload.effective_date)),
            overall_decision: ActiveValue::Set(payload.overall_decision.clone()),
            decision_rationale: ActiveValue::Set(payload.decision_rationale.clone()),
            decline_reason_category: ActiveValue::Set(payload.decline_reason_category.clone()),
            agreed_working_environment: ActiveValue::Set(payload.agreed_working_environment),
            agreed_equipment_technology: ActiveValue::Set(payload.agreed_equipment_technology),
            agreed_working_arrangements: ActiveValue::Set(payload.agreed_working_arrangements),
            agreed_communication: ActiveValue::Set(payload.agreed_communication),
            agreed_support_mentoring: ActiveValue::Set(payload.agreed_support_mentoring),
            agreed_recruitment_process: ActiveValue::Set(payload.agreed_recruitment_process),
            agreed_policy_dress: ActiveValue::Set(payload.agreed_policy_dress),
            agreed_other: ActiveValue::Set(payload.agreed_other),
            agreed_adjustments_detail: ActiveValue::Set(payload.agreed_adjustments_detail.clone()),
            alternative_adjustments_detail: ActiveValue::Set(
                payload.alternative_adjustments_detail.clone(),
            ),
            trial_period: ActiveValue::Set(payload.trial_period),
            trial_period_weeks: ActiveValue::Set(payload.trial_period_weeks),
            review_scheduled: ActiveValue::Set(payload.review_scheduled),
            review_date: ActiveValue::Set(parse_date(&payload.review_date)),
            occupational_health_referred: ActiveValue::Set(payload.occupational_health_referred),
            access_to_work_referred: ActiveValue::Set(payload.access_to_work_referred),
            support_resources_detail: ActiveValue::Set(payload.support_resources_detail.clone()),
            responsibilities_detail: ActiveValue::Set(payload.responsibilities_detail.clone()),
            point_of_contact: ActiveValue::Set(payload.point_of_contact.clone()),
            escalated: ActiveValue::Set(payload.escalated),
            escalation_detail: ActiveValue::Set(payload.escalation_detail.clone()),
            notes: ActiveValue::Set(payload.notes.clone()),
        }
    }
}

impl Model {
    /// Project this row into the engine's [`NeurodiversityAdjustmentResponse`]
    /// payload so the four-axis grader can run over it. The `worker*` /
    /// `manager*` identity fields live in their own tables and are left empty
    /// here; the completeness axis treats them as absent on the DB path.
    #[must_use]
    pub fn to_payload(&self) -> NeurodiversityAdjustmentResponse {
        NeurodiversityAdjustmentResponse {
            worker_name: String::new(),
            worker_job_title: String::new(),
            worker_department: String::new(),
            worker_employee_reference: String::new(),
            manager_name: String::new(),
            manager_role: String::new(),
            response_status: self.response_status.clone(),
            request_reference: self.request_reference.clone(),
            handling_method: self.handling_method.clone(),
            assessed_date: self.assessed_date.map(|d| d.to_string()).unwrap_or_default(),
            responded_date: self
                .responded_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            effective_date: self
                .effective_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            overall_decision: self.overall_decision.clone(),
            decision_rationale: self.decision_rationale.clone(),
            decline_reason_category: self.decline_reason_category.clone(),
            agreed_working_environment: self.agreed_working_environment,
            agreed_equipment_technology: self.agreed_equipment_technology,
            agreed_working_arrangements: self.agreed_working_arrangements,
            agreed_communication: self.agreed_communication,
            agreed_support_mentoring: self.agreed_support_mentoring,
            agreed_recruitment_process: self.agreed_recruitment_process,
            agreed_policy_dress: self.agreed_policy_dress,
            agreed_other: self.agreed_other,
            agreed_adjustments_detail: self.agreed_adjustments_detail.clone(),
            alternative_adjustments_detail: self.alternative_adjustments_detail.clone(),
            trial_period: self.trial_period,
            trial_period_weeks: self.trial_period_weeks,
            review_scheduled: self.review_scheduled,
            review_date: self.review_date.map(|d| d.to_string()).unwrap_or_default(),
            occupational_health_referred: self.occupational_health_referred,
            access_to_work_referred: self.access_to_work_referred,
            support_resources_detail: self.support_resources_detail.clone(),
            responsibilities_detail: self.responsibilities_detail.clone(),
            point_of_contact: self.point_of_contact.clone(),
            escalated: self.escalated,
            escalation_detail: self.escalation_detail.clone(),
            notes: self.notes.clone(),
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
