//! `SeaORM` entity for the `neurodiversity_adjustment_reviews` table (source of truth).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Neurodiversity reasonable-adjustments review (periodic effectiveness review) model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "neurodiversity_adjustment_reviews")]
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
    /// Review lifecycle status.
    pub review_status: String,
    /// Reference to the originating response / confirmation being reviewed.
    pub response_reference: String,
    /// How the review was conducted.
    pub review_method: String,
    /// Date the review took place.
    pub review_date: Option<Date>,
    /// Date of the next scheduled review.
    pub next_review_date: Option<Date>,
    /// Effectiveness of working-environment adjustments.
    pub effectiveness_working_environment: String,
    /// Effectiveness of equipment / technology adjustments.
    pub effectiveness_equipment_technology: String,
    /// Effectiveness of working-arrangements adjustments.
    pub effectiveness_working_arrangements: String,
    /// Effectiveness of communication adjustments.
    pub effectiveness_communication: String,
    /// Effectiveness of support / mentoring adjustments.
    pub effectiveness_support_mentoring: String,
    /// Effectiveness of recruitment-process adjustments.
    pub effectiveness_recruitment_process: String,
    /// Effectiveness of policy / dress-code adjustments.
    pub effectiveness_policy_dress: String,
    /// Effectiveness of any other adjustment.
    pub effectiveness_other: String,
    /// The worker's own feedback on how the adjustments are working.
    pub worker_feedback: String,
    /// Whether the worker is satisfied the adjustments meet their needs.
    pub worker_satisfied: String,
    /// Change in the worker's wellbeing / ability to work since the adjustments.
    pub wellbeing_change: String,
    /// Any remaining barriers or difficulties the worker still experiences.
    pub barriers_detail: String,
    /// Whether changes to the adjustments are needed as a result of the review.
    pub changes_needed: bool,
    /// Detail of the changes needed.
    pub changes_detail: String,
    /// Detail of the updated / newly agreed adjustments arising from the review.
    pub updated_adjustments_detail: String,
    /// Whether an occupational-health re-referral has been made.
    pub occupational_health_rereferral: bool,
    /// Whether the matter has been escalated.
    pub escalated: bool,
    /// Free-text detail of any escalation.
    pub escalation_detail: String,
    /// Free-text notes accompanying the review.
    pub notes: String,
    /// Foreign key to the worker.
    pub worker_id: Uuid,
    /// Foreign key to the manager / HR contact conducting the review.
    pub manager_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent worker.
    #[sea_orm(
        belongs_to = "super::workers::Entity",
        from = "Column::WorkerId",
        to = "super::workers::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Workers,
    /// Parent manager / HR contact.
    #[sea_orm(
        belongs_to = "super::managers::Entity",
        from = "Column::ManagerId",
        to = "super::managers::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Managers,
    /// The computed grade (1:1).
    #[sea_orm(has_many = "super::neurodiversity_adjustment_review_grades::Entity")]
    NeurodiversityAdjustmentReviewGrades,
}

impl Related<super::workers::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Workers.def()
    }
}

impl Related<super::managers::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Managers.def()
    }
}

impl Related<super::neurodiversity_adjustment_review_grades::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentReviewGrades.def()
    }
}
