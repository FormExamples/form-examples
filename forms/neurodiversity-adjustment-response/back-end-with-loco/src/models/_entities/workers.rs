//! `SeaORM` entity for the `workers` table.

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Worker (neurodivergent employee) model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "workers")]
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
    /// Employer-assigned employee / payroll reference (unique).
    pub employee_reference: Option<String>,
    /// Job title / role of the worker.
    pub job_title: String,
    /// Department / team the worker belongs to.
    pub department: String,
    /// Employment type.
    pub employment_type: String,
    /// Working pattern.
    pub work_pattern: String,
    /// Primary work location.
    pub work_location: String,
    /// Date the worker started employment.
    pub employment_start_date: Option<Date>,
}

/// Relations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Reasonable-adjustments responses authored for this worker.
    #[sea_orm(has_many = "super::neurodiversity_adjustment_responses::Entity")]
    NeurodiversityAdjustmentResponses,
}

impl Related<super::neurodiversity_adjustment_responses::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::NeurodiversityAdjustmentResponses.def()
    }
}
