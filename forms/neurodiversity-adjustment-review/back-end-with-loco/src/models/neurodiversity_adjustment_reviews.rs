//! Neurodiversity-adjustment-reviews domain model: constructors, mappers, query helpers.

use chrono::Utc;
use sea_orm::{entity::prelude::*, ActiveValue, QueryOrder};

pub use super::_entities::neurodiversity_adjustment_reviews::{ActiveModel, Column, Entity, Model};
use crate::engine::types::NeurodiversityAdjustmentReview;

/// Neurodiversity adjustment reviews entity alias.
pub type NeurodiversityAdjustmentReviews = Entity;

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
    /// Build an `ActiveModel` for a new review from an engine payload plus the
    /// worker and manager foreign keys. A fresh draft uses
    /// `NeurodiversityAdjustmentReview::default()`.
    #[must_use]
    pub fn from_payload(
        worker_id: Uuid,
        manager_id: Uuid,
        payload: &NeurodiversityAdjustmentReview,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: ActiveValue::NotSet,
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            worker_id: ActiveValue::Set(worker_id),
            manager_id: ActiveValue::Set(manager_id),
            review_status: ActiveValue::Set(payload.review_status.clone()),
            response_reference: ActiveValue::Set(payload.response_reference.clone()),
            review_method: ActiveValue::Set(payload.review_method.clone()),
            review_date: ActiveValue::Set(parse_date(&payload.review_date)),
            next_review_date: ActiveValue::Set(parse_date(&payload.next_review_date)),
            effectiveness_working_environment: ActiveValue::Set(
                payload.effectiveness_working_environment.clone(),
            ),
            effectiveness_equipment_technology: ActiveValue::Set(
                payload.effectiveness_equipment_technology.clone(),
            ),
            effectiveness_working_arrangements: ActiveValue::Set(
                payload.effectiveness_working_arrangements.clone(),
            ),
            effectiveness_communication: ActiveValue::Set(
                payload.effectiveness_communication.clone(),
            ),
            effectiveness_support_mentoring: ActiveValue::Set(
                payload.effectiveness_support_mentoring.clone(),
            ),
            effectiveness_recruitment_process: ActiveValue::Set(
                payload.effectiveness_recruitment_process.clone(),
            ),
            effectiveness_policy_dress: ActiveValue::Set(payload.effectiveness_policy_dress.clone()),
            effectiveness_other: ActiveValue::Set(payload.effectiveness_other.clone()),
            worker_feedback: ActiveValue::Set(payload.worker_feedback.clone()),
            worker_satisfied: ActiveValue::Set(payload.worker_satisfied.clone()),
            wellbeing_change: ActiveValue::Set(payload.wellbeing_change.clone()),
            barriers_detail: ActiveValue::Set(payload.barriers_detail.clone()),
            changes_needed: ActiveValue::Set(payload.changes_needed),
            changes_detail: ActiveValue::Set(payload.changes_detail.clone()),
            updated_adjustments_detail: ActiveValue::Set(payload.updated_adjustments_detail.clone()),
            occupational_health_rereferral: ActiveValue::Set(payload.occupational_health_rereferral),
            escalated: ActiveValue::Set(payload.escalated),
            escalation_detail: ActiveValue::Set(payload.escalation_detail.clone()),
            notes: ActiveValue::Set(payload.notes.clone()),
        }
    }
}

impl Model {
    /// Project this row into the engine's [`NeurodiversityAdjustmentReview`]
    /// payload so the four-axis grader can run over it. The `worker*` /
    /// `manager*` identity fields live in their own tables and are left empty
    /// here; the completeness axis treats them as absent on the DB path.
    #[must_use]
    pub fn to_payload(&self) -> NeurodiversityAdjustmentReview {
        NeurodiversityAdjustmentReview {
            worker_name: String::new(),
            worker_job_title: String::new(),
            worker_department: String::new(),
            worker_employee_reference: String::new(),
            manager_name: String::new(),
            manager_role: String::new(),
            review_status: self.review_status.clone(),
            response_reference: self.response_reference.clone(),
            review_method: self.review_method.clone(),
            review_date: self.review_date.map(|d| d.to_string()).unwrap_or_default(),
            next_review_date: self
                .next_review_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            effectiveness_working_environment: self.effectiveness_working_environment.clone(),
            effectiveness_equipment_technology: self.effectiveness_equipment_technology.clone(),
            effectiveness_working_arrangements: self.effectiveness_working_arrangements.clone(),
            effectiveness_communication: self.effectiveness_communication.clone(),
            effectiveness_support_mentoring: self.effectiveness_support_mentoring.clone(),
            effectiveness_recruitment_process: self.effectiveness_recruitment_process.clone(),
            effectiveness_policy_dress: self.effectiveness_policy_dress.clone(),
            effectiveness_other: self.effectiveness_other.clone(),
            worker_feedback: self.worker_feedback.clone(),
            worker_satisfied: self.worker_satisfied.clone(),
            wellbeing_change: self.wellbeing_change.clone(),
            barriers_detail: self.barriers_detail.clone(),
            changes_needed: self.changes_needed,
            changes_detail: self.changes_detail.clone(),
            updated_adjustments_detail: self.updated_adjustments_detail.clone(),
            occupational_health_rereferral: self.occupational_health_rereferral,
            escalated: self.escalated,
            escalation_detail: self.escalation_detail.clone(),
            notes: self.notes.clone(),
        }
    }
}

/// Find a review by its UUID.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_by_id(db: &DatabaseConnection, id: Uuid) -> Result<Option<Model>, DbErr> {
    Entity::find_by_id(id).one(db).await
}

/// List all reviews, newest first.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn list_all(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Entity::find()
        .order_by_desc(Column::CreatedAt)
        .all(db)
        .await
}
