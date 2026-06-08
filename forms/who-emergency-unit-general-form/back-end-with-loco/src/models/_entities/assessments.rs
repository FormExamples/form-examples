//! SeaORM entity for the `assessments` table (generated).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "assessments")]
pub struct Model {
    /// ID.
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    /// Data.
    #[sea_orm(column_type = "JsonBinary")]
    pub data: serde_json::Value,
    /// Result.
    #[sea_orm(column_type = "JsonBinary", nullable)]
    pub result: Option<serde_json::Value>,
    /// Status.
    pub status: String,
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
}

/// Relation.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
