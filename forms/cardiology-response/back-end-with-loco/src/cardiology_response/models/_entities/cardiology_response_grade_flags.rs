//! `SeaORM` entity for the `cardiology_response_grade_flags` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Safety-critical flag row model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "cardiology_response_grade_flags")]
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
    /// Stable flag identifier (e.g. `F-CRITICAL-FINDING-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: String,
    /// Priority: low, medium, high.
    pub priority: String,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested clinical action.
    pub suggested_action: String,
    /// Foreign key to the parent grade.
    pub cardiology_response_grade_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent grade.
    #[sea_orm(
        belongs_to = "super::cardiology_response_grades::Entity",
        from = "Column::CardiologyResponseGradeId",
        to = "super::cardiology_response_grades::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    CardiologyResponseGrades,
}

impl Related<super::cardiology_response_grades::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponseGrades.def()
    }
}
