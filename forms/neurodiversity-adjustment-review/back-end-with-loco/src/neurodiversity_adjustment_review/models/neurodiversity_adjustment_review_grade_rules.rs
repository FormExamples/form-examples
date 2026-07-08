//! Neurodiversity-adjustment-review-grade-rules domain model.

use sea_orm::entity::prelude::*;

pub use super::_entities::neurodiversity_adjustment_review_grade_rules::{ActiveModel, Column, Entity, Model};

/// Neurodiversity adjustment review grade rules entity alias.
pub type NeurodiversityAdjustmentReviewGradeRules = Entity;

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

/// List the fired-rule rows for a grade, oldest first.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn list_for_grade(
    db: &DatabaseConnection,
    grade_id: Uuid,
) -> Result<Vec<Model>, DbErr> {
    Entity::find()
        .filter(Column::NeurodiversityAdjustmentReviewGradeId.eq(grade_id))
        .all(db)
        .await
}
