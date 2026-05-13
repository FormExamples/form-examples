use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "scorecards")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    #[sea_orm(column_type = "JsonBinary")]
    pub data: Json,
    #[sea_orm(column_type = "JsonBinary", nullable)]
    pub result: Option<Json>,
    pub status: String,
    pub organization_name: String,
    pub sector: String,
    pub size_band: String,
    pub computed_band: String,
    pub score_total: i16,
    pub assessment_date: String,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
