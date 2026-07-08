//! `SeaORM` entity for the `cardiology_response_grades` table (four-axis grade).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Computed four-axis interpretation grade model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "cardiology_response_grades")]
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
    /// Axis A — overall classification.
    pub response_classification: String,
    /// Axis B — condition severity.
    pub severity: String,
    /// Axis B — structured-finding category label.
    pub severity_category: String,
    /// Axis C — response completeness percent (0-100).
    pub completeness_percent: Option<i32>,
    /// Axis D — follow-up urgency.
    pub follow_up_urgency: String,
    /// Axis D — target timeframe.
    pub target_timeframe: String,
    /// Axis D — concise recommended action.
    pub recommended_action: String,
    /// Overall recommendation.
    pub recommendation: String,
    /// Free-text interpretation / sign-off notes.
    #[sea_orm(column_type = "Text")]
    pub clinician_notes: String,
    /// Timestamp of the responding clinician electronic signature.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Timestamp when the engine last computed the grade.
    pub graded_at: DateTimeWithTimeZone,
    /// Foreign key to the parent response (unique, 1:1).
    pub cardiology_response_id: Uuid,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Parent response.
    #[sea_orm(
        belongs_to = "super::cardiology_responses::Entity",
        from = "Column::CardiologyResponseId",
        to = "super::cardiology_responses::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    CardiologyResponses,
    /// Fired-rule audit trail.
    #[sea_orm(has_many = "super::cardiology_response_grade_rules::Entity")]
    CardiologyResponseGradeRules,
    /// Safety flags.
    #[sea_orm(has_many = "super::cardiology_response_grade_flags::Entity")]
    CardiologyResponseGradeFlags,
}

impl Related<super::cardiology_responses::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponses.def()
    }
}

impl Related<super::cardiology_response_grade_rules::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponseGradeRules.def()
    }
}

impl Related<super::cardiology_response_grade_flags::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponseGradeFlags.def()
    }
}
