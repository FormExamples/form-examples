use chrono::Utc;
use sea_orm::{ActiveValue, QueryOrder, QuerySelect, entity::prelude::*};
use uuid::Uuid;

use super::_entities::assessments::{ActiveModel, Column, Entity, Model};
use crate::engine::fp92a_rules::ELIGIBLE_CONDITION_CODES;
use crate::engine::types::{ApplicationData, GradeResult, QualifyingCondition};

impl ActiveModel {
    /// Create a new in-progress FP92A application, pre-seeded with one
    /// `QualifyingCondition` per NHSBSA-recognised code so the wizard can
    /// render a checkbox for each condition.
    pub fn new_draft() -> Result<Self, serde_json::Error> {
        let now = Utc::now().into();
        let mut data = ApplicationData::default();
        for code in ELIGIBLE_CONDITION_CODES.iter() {
            data.conditions.push(QualifyingCondition {
                code: (*code).to_string(),
                ..Default::default()
            });
        }
        Ok(Self {
            id: ActiveValue::Set(Uuid::new_v4()),
            data: ActiveValue::Set(serde_json::to_value(data)?),
            result: ActiveValue::Set(None),
            status: ActiveValue::Set("in_progress".to_string()),
            created_at: ActiveValue::Set(now),
            updated_at: ActiveValue::Set(now),
        })
    }
}

impl Model {
    /// Deserialize the JSONB `data` column into ApplicationData.
    pub fn application_data(&self) -> Result<ApplicationData, serde_json::Error> {
        serde_json::from_value(self.data.clone())
    }

    /// Deserialize the JSONB `result` column into GradeResult.
    pub fn grade(&self) -> Result<Option<GradeResult>, serde_json::Error> {
        match &self.result {
            Some(v) => serde_json::from_value(v.clone()).map(Some),
            None => Ok(None),
        }
    }
}

/// Find an application by its UUID.
pub async fn find_by_id(db: &DatabaseConnection, id: Uuid) -> Result<Option<Model>, DbErr> {
    Entity::find_by_id(id).one(db).await
}

/// List all completed applications (those with a grading result).
pub async fn list_completed(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Entity::find()
        .filter(Column::Status.eq("completed"))
        .order_by_desc(Column::CreatedAt)
        .all(db)
        .await
}

/// List applications with pagination (page is 0-indexed, per_page items each).
pub async fn list_paginated(
    db: &DatabaseConnection,
    page: u64,
    per_page: u64,
) -> Result<Vec<Model>, DbErr> {
    Entity::find()
        .order_by_desc(Column::CreatedAt)
        .offset(page * per_page)
        .limit(per_page)
        .all(db)
        .await
}
