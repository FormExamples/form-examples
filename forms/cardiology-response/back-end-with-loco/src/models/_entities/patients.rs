//! `SeaORM` entity for the `patients` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Patient demographics model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "patients")]
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
    pub name: String,
    /// Birth date.
    pub birth_date: Date,
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
    /// United Kingdom NHS number (unique).
    pub united_kingdom_nhs_number: Option<String>,
    /// Waist circumference in cm.
    pub waist_as_cm: Option<f64>,
    /// Height in cm.
    pub height_as_cm: Option<f64>,
    /// Weight in kg.
    pub weight_as_kg: Option<f64>,
    /// Body mass index.
    pub body_mass_index: Option<f64>,
    /// Waist-height ratio.
    pub waist_height_ratio: Option<f64>,
    /// VO2 max.
    pub vo2_max: Option<f64>,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Cardiology responses authored for this patient.
    #[sea_orm(has_many = "super::cardiology_responses::Entity")]
    CardiologyResponses,
}

impl Related<super::cardiology_responses::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponses.def()
    }
}
