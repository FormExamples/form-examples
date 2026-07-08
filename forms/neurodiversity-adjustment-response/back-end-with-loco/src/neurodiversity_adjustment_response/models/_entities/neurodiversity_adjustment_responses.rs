//! `SeaORM` entity for the `neurodiversity_adjustment_responses` table (source of truth).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Neurodiversity reasonable-adjustments response (employer decision, confirmation, and review) model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "neurodiversity_adjustment_responses")]
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
    /// Response lifecycle status.
    pub response_status: String,
    /// Reference to the originating reasonable-adjustments request.
    pub request_reference: String,
    /// How the request was handled.
    pub handling_method: String,
    /// Date the request was assessed / discussed with the worker.
    pub assessed_date: Option<Date>,
    /// Date the response was issued to the worker.
    pub responded_date: Option<Date>,
    /// Date the agreed adjustments take effect.
    pub effective_date: Option<Date>,
    /// Overall decision.
    pub overall_decision: String,
    /// Rationale for the decision (including the reasonableness justification).
    pub decision_rationale: String,
    /// Reasonableness category where any adjustment is declined.
    pub decline_reason_category: String,
    /// Agreed adjustment: physical working environment.
    pub agreed_working_environment: bool,
    /// Agreed adjustment: equipment or assistive technology.
    pub agreed_equipment_technology: bool,
    /// Agreed adjustment: working arrangements.
    pub agreed_working_arrangements: bool,
    /// Agreed adjustment: communication.
    pub agreed_communication: bool,
    /// Agreed adjustment: additional support / mentoring.
    pub agreed_support_mentoring: bool,
    /// Agreed adjustment: recruitment / assessment process.
    pub agreed_recruitment_process: bool,
    /// Agreed adjustment: policies (dress code / uniform, absence policy).
    pub agreed_policy_dress: bool,
    /// Agreed adjustment: another adjustment not separately listed.
    pub agreed_other: bool,
    /// Free-text detail of the specific adjustments agreed.
    pub agreed_adjustments_detail: String,
    /// Free-text detail of any alternative adjustments offered.
    pub alternative_adjustments_detail: String,
    /// Whether the adjustments are being tried for a trial period.
    pub trial_period: bool,
    /// Length of the trial period in weeks, if a trial applies (0–104).
    pub trial_period_weeks: Option<i32>,
    /// Whether a review of the adjustments has been scheduled.
    pub review_scheduled: bool,
    /// Date the adjustments will be reviewed.
    pub review_date: Option<Date>,
    /// Whether the worker has been referred to occupational health.
    pub occupational_health_referred: bool,
    /// Whether the worker has been signposted / referred to Access to Work.
    pub access_to_work_referred: bool,
    /// Free-text detail of support resources allocated.
    pub support_resources_detail: String,
    /// Free-text detail of who is responsible for implementing each adjustment.
    pub responsibilities_detail: String,
    /// Named point of contact for the worker.
    pub point_of_contact: String,
    /// Whether the matter has been escalated (dispute, grievance, appeal).
    pub escalated: bool,
    /// Free-text detail of any escalation, dispute, or appeal.
    pub escalation_detail: String,
    /// Free-text notes accompanying the response.
    pub notes: String,
    /// Foreign key to the worker.
    pub worker_id: Uuid,
    /// Foreign key to the manager / HR contact authoring the response.
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
    #[sea_orm(has_many = "super::neurodiversity_adjustment_response_grades::Entity")]
    NeurodiversityAdjustmentResponseGrades,
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

impl Related<super::neurodiversity_adjustment_response_grades::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentResponseGrades.def()
    }
}
