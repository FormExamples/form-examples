//! SeaORM entity for the `scorecards` table (generated).

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "scorecards")]
pub struct Model {
    /// ID.
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    /// Data.
    #[sea_orm(column_type = "JsonBinary")]
    pub data: Json,
    /// Result.
    #[sea_orm(column_type = "JsonBinary", nullable)]
    pub result: Option<Json>,
    /// Status.
    pub status: String,
    /// Organization name.
    pub organization_name: String,
    /// Sector.
    pub sector: String,
    /// Size band.
    pub size_band: String,
    /// Computed band.
    pub computed_band: String,
    /// Score total.
    pub score_total: i16,
    /// Assessment date.
    pub assessment_date: String,
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
}

/// Relation.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
