//! Neurodiversity-adjustment-response-grades domain model: transactional persist of the grade.

use chrono::Utc;
use sea_orm::{entity::prelude::*, ActiveValue, TransactionTrait};

pub use super::_entities::neurodiversity_adjustment_response_grades::{
    ActiveModel, Column, Entity, Model,
};
use super::_entities::{
    neurodiversity_adjustment_response_grade_flags, neurodiversity_adjustment_response_grade_rules,
};
use crate::engine::types::GradingResult;

/// Neurodiversity adjustment response grades entity alias.
pub type NeurodiversityAdjustmentResponseGrades = Entity;

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

impl Model {
    /// Transactionally persist a [`GradingResult`] for the given response.
    ///
    /// Idempotent: any pre-existing grade (and, via `ON DELETE CASCADE`, its
    /// rule and flag rows) for the response is deleted first, then a fresh
    /// grade row plus one row per fired rule and one row per flag are inserted
    /// inside a single transaction. Returns the persisted grade row.
    ///
    /// # Errors
    /// Returns a database error if any step of the transaction fails.
    pub async fn persist_grade(
        db: &DatabaseConnection,
        neurodiversity_adjustment_response_id: Uuid,
        grade: &GradingResult,
    ) -> Result<Model, DbErr> {
        let txn = db.begin().await?;

        // Idempotency: remove any prior grade for this response (cascade drops
        // its rule and flag rows).
        Entity::delete_many()
            .filter(Column::NeurodiversityAdjustmentResponseId.eq(neurodiversity_adjustment_response_id))
            .exec(&txn)
            .await?;

        let now = Utc::now();

        let grade_row = ActiveModel {
            id: ActiveValue::NotSet,
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            neurodiversity_adjustment_response_id: ActiveValue::Set(
                neurodiversity_adjustment_response_id,
            ),
            outcome_classification: ActiveValue::Set(grade.outcome_classification.clone()),
            legal_risk_band: ActiveValue::Set(grade.legal_risk_band.clone()),
            completeness_percent: ActiveValue::Set(Some(grade.completeness_percent)),
            follow_up_urgency: ActiveValue::Set(grade.follow_up_urgency.clone()),
            target_timeframe: ActiveValue::Set(grade.target_timeframe.clone()),
            recommendation: ActiveValue::Set(grade.recommendation.clone()),
            manager_notes: ActiveValue::Set(String::new()),
            signed_at: ActiveValue::Set(None),
            graded_at: ActiveValue::Set(now.into()),
        }
        .insert(&txn)
        .await?;

        let grade_id = grade_row.id;

        // One row per fired rule (audit trail).
        for rule in &grade.fired_rules {
            neurodiversity_adjustment_response_grade_rules::ActiveModel {
                id: ActiveValue::NotSet,
                created_at: ActiveValue::Set(now.into()),
                updated_at: ActiveValue::Set(now.into()),
                deleted_at: ActiveValue::Set(None),
                neurodiversity_adjustment_response_grade_id: ActiveValue::Set(grade_id),
                rule_id: ActiveValue::Set(rule.rule_id.clone()),
                axis: ActiveValue::Set(rule.axis.clone()),
                category: ActiveValue::Set(rule.category.clone()),
                description: ActiveValue::Set(rule.description.clone()),
            }
            .insert(&txn)
            .await?;
        }

        // One row per compliance / risk flag.
        for flag in &grade.flags {
            neurodiversity_adjustment_response_grade_flags::ActiveModel {
                id: ActiveValue::NotSet,
                created_at: ActiveValue::Set(now.into()),
                updated_at: ActiveValue::Set(now.into()),
                deleted_at: ActiveValue::Set(None),
                neurodiversity_adjustment_response_grade_id: ActiveValue::Set(grade_id),
                flag_id: ActiveValue::Set(flag.flag_id.clone()),
                category: ActiveValue::Set(flag.category.clone()),
                priority: ActiveValue::Set(flag.priority.clone()),
                description: ActiveValue::Set(flag.description.clone()),
                suggested_action: ActiveValue::Set(flag.suggested_action.clone()),
            }
            .insert(&txn)
            .await?;
        }

        txn.commit().await?;
        Ok(grade_row)
    }
}

/// Find the grade for a response, if one has been computed.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_for_response(
    db: &DatabaseConnection,
    neurodiversity_adjustment_response_id: Uuid,
) -> Result<Option<Model>, DbErr> {
    Entity::find()
        .filter(Column::NeurodiversityAdjustmentResponseId.eq(neurodiversity_adjustment_response_id))
        .one(db)
        .await
}
