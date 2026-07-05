//! `SeaORM` entity for the `neurodiversity_adjustment_review_grades` table (four-axis grade).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Computed four-axis grade model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "neurodiversity_adjustment_review_grades")]
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
    /// Axis A — overall effectiveness band.
    pub effectiveness_band: String,
    /// Axis B — wellbeing risk band.
    pub wellbeing_risk_band: String,
    /// Axis C — review completeness percent (0–100).
    pub completeness_percent: Option<i32>,
    /// Axis D — next-step urgency.
    pub next_step_urgency: String,
    /// Axis D — target timeframe for the next step.
    pub target_timeframe: String,
    /// Overall recommendation.
    pub recommendation: String,
    /// Free-text sign-off notes from the manager or HR contact.
    #[sea_orm(column_type = "Text")]
    pub manager_notes: String,
    /// Timestamp of the manager / HR electronic signature.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Timestamp when the engine last computed the grade.
    pub graded_at: DateTimeWithTimeZone,
    /// Foreign key to the parent review (unique, 1:1).
    pub neurodiversity_adjustment_review_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent review.
    #[sea_orm(
        belongs_to = "super::neurodiversity_adjustment_reviews::Entity",
        from = "Column::NeurodiversityAdjustmentReviewId",
        to = "super::neurodiversity_adjustment_reviews::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    NeurodiversityAdjustmentReviews,
    /// Fired-rule audit trail.
    #[sea_orm(has_many = "super::neurodiversity_adjustment_review_grade_rules::Entity")]
    NeurodiversityAdjustmentReviewGradeRules,
    /// Compliance / risk flags.
    #[sea_orm(has_many = "super::neurodiversity_adjustment_review_grade_flags::Entity")]
    NeurodiversityAdjustmentReviewGradeFlags,
}

impl Related<super::neurodiversity_adjustment_reviews::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentReviews.def()
    }
}

impl Related<super::neurodiversity_adjustment_review_grade_rules::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentReviewGradeRules.def()
    }
}

impl Related<super::neurodiversity_adjustment_review_grade_flags::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentReviewGradeFlags.def()
    }
}
