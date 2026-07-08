//! `SeaORM` entity for the `neurodiversity_adjustment_response_grade_rules` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Fired-rule audit-trail row model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "neurodiversity_adjustment_response_grade_rules")]
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
    /// Stable rule identifier (e.g. `R-LEGAL-DECLINE-NO-RATIONALE`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to.
    pub axis: String,
    /// Category or reason the rule relates to.
    pub category: String,
    /// Human-readable description of why the rule fired.
    pub description: String,
    /// Foreign key to the parent grade.
    pub neurodiversity_adjustment_response_grade_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent grade.
    #[sea_orm(
        belongs_to = "super::neurodiversity_adjustment_response_grades::Entity",
        from = "Column::NeurodiversityAdjustmentResponseGradeId",
        to = "super::neurodiversity_adjustment_response_grades::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    NeurodiversityAdjustmentResponseGrades,
}

impl Related<super::neurodiversity_adjustment_response_grades::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentResponseGrades.def()
    }
}
