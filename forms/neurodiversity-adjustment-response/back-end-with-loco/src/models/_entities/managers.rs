//! `SeaORM` entity for the `managers` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Manager / HR contact (decision-maker) model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "managers")]
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
    /// Name.
    #[sea_orm(column_type = "Text")]
    pub name: String,
    /// Email address.
    pub email: Option<String>,
    /// Phone number.
    pub phone: Option<String>,
    /// Postal address as full text.
    pub postal_address_as_full_text: Option<String>,
    /// Country as ISO 3166-1 alpha-2.
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    /// Postcode.
    pub postcode: Option<String>,
    /// Manager role handling the request.
    #[sea_orm(column_type = "Text")]
    pub role: String,
    /// Job title of the manager / HR contact.
    #[sea_orm(column_type = "Text")]
    pub job_title: String,
    /// Department the manager / HR contact belongs to.
    #[sea_orm(column_type = "Text")]
    pub department: String,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Reasonable-adjustments responses authored by this manager / HR contact.
    #[sea_orm(has_many = "super::neurodiversity_adjustment_responses::Entity")]
    NeurodiversityAdjustmentResponses,
}

impl Related<super::neurodiversity_adjustment_responses::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentResponses.def()
    }
}
