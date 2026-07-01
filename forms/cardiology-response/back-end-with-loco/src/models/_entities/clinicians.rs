//! `SeaORM` entity for the `clinicians` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Responding cardiology clinician model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "clinicians")]
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
    /// Clinician role.
    #[sea_orm(column_type = "Text")]
    pub role: String,
    /// Registration body.
    #[sea_orm(column_type = "Text")]
    pub registration_body: String,
    /// Registration number.
    #[sea_orm(column_type = "Text")]
    pub registration_number: String,
    /// United Kingdom NHS number (unique).
    pub united_kingdom_nhs_number: Option<String>,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Cardiology responses authored by this clinician.
    #[sea_orm(has_many = "super::cardiology_responses::Entity")]
    CardiologyResponses,
}

impl Related<super::cardiology_responses::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CardiologyResponses.def()
    }
}
