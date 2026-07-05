//! `SeaORM` entity for the `neurodiversity_adjustment_review_grade_flags` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Safety-critical flag row model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "neurodiversity_adjustment_review_grade_flags")]
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
    /// Stable flag identifier (e.g. `F-ADJUSTMENTS-NOT-WORKING-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: String,
    /// Priority: low, medium, high.
    pub priority: String,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
    /// Foreign key to the parent grade.
    pub neurodiversity_adjustment_review_grade_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent grade.
    #[sea_orm(
        belongs_to = "super::neurodiversity_adjustment_review_grades::Entity",
        from = "Column::NeurodiversityAdjustmentReviewGradeId",
        to = "super::neurodiversity_adjustment_review_grades::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    NeurodiversityAdjustmentReviewGrades,
}

impl Related<super::neurodiversity_adjustment_review_grades::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentReviewGrades.def()
    }
}
