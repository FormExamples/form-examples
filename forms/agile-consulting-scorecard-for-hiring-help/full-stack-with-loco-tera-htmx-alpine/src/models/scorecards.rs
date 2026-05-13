//! Custom helpers on top of the SeaORM `scorecards` entity.

use loco_rs::prelude::*;
use sea_orm::{ActiveValue, ColumnTrait, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder};
use uuid::Uuid;

use crate::scoring::grader::grade_scorecard;
use crate::scoring::types::AgileConsultingScorecardAssessment;
use crate::models::_entities::scorecards::{ActiveModel, Column, Entity, Model};

/// Insert a new scorecard: score the assessment, denormalise the headline
/// columns into the row, and return the persisted `Model`.
pub async fn create(
    db: &DatabaseConnection,
    data: &AgileConsultingScorecardAssessment,
) -> Result<Model> {
    let grade = grade_scorecard(data);
    let data_json = serde_json::to_value(data).map_err(|e| Error::wrap(e))?;
    let result_json = serde_json::to_value(&grade).map_err(|e| Error::wrap(e))?;

    let active = ActiveModel {
        id: ActiveValue::Set(Uuid::new_v4()),
        data: ActiveValue::Set(data_json),
        result: ActiveValue::Set(Some(result_json)),
        status: ActiveValue::Set("submitted".to_string()),
        organization_name: ActiveValue::Set(data.organization.organization_name.clone()),
        sector: ActiveValue::Set(data.organization.sector.clone()),
        size_band: ActiveValue::Set(data.organization.size_band.clone()),
        computed_band: ActiveValue::Set(grade.computed_band.as_str().to_string()),
        score_total: ActiveValue::Set(grade.score_total as i16),
        assessment_date: ActiveValue::Set(data.assessment.assessment_date.clone()),
        created_at: ActiveValue::NotSet,
        updated_at: ActiveValue::NotSet,
    };

    let saved = active.insert(db).await?;
    Ok(saved)
}

/// List all submitted scorecards, newest first.
pub async fn list(db: &DatabaseConnection) -> Result<Vec<Model>> {
    let rows = Entity::find()
        .order_by_desc(Column::CreatedAt)
        .all(db)
        .await?;
    Ok(rows)
}

/// Look up by id.
pub async fn find_by_id(db: &DatabaseConnection, id: Uuid) -> Result<Option<Model>> {
    Ok(Entity::find_by_id(id).one(db).await?)
}

/// Soft-delete by id (status → "cancelled"). Returns whether a row was
/// updated.
pub async fn cancel(db: &DatabaseConnection, id: Uuid) -> Result<bool> {
    let Some(model) = find_by_id(db, id).await? else {
        return Ok(false);
    };
    let mut active = model.into_active_model();
    active.status = ActiveValue::Set("cancelled".to_string());
    active.update(db).await?;
    Ok(true)
}

/// Re-parse the `data` JSON into an `AgileConsultingScorecardAssessment`.
pub fn assessment(model: &Model) -> Result<AgileConsultingScorecardAssessment> {
    serde_json::from_value(model.data.clone()).map_err(|e| Error::wrap(e))
}

/// Re-parse the `result` JSON into a `GradeResult`. Returns `None` when
/// the row was created with an empty grade (shouldn't happen in normal
/// flow because `create` always sets it).
pub fn grade(model: &Model) -> Result<Option<crate::scoring::types::GradeResult>> {
    let Some(value) = &model.result else {
        return Ok(None);
    };
    let g = serde_json::from_value(value.clone()).map_err(|e| Error::wrap(e))?;
    Ok(Some(g))
}

/// Helper used by tests to truncate the table between cases.
#[allow(dead_code)]
pub async fn truncate(db: &DatabaseConnection) -> Result<()> {
    Entity::delete_many()
        .filter(Column::Id.is_not_null())
        .exec(db)
        .await?;
    Ok(())
}

