use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patients",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::String),
            ("birth_date", ColType::Date),
            ("sex", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("united_kingdom_nhs_number", ColType::StringUniq),
            ("job_title", ColType::StringWithDefault(String::new())),
            ("role_description", ColType::TextWithDefault(String::new())),
            ("contracted_hours_per_week", ColType::DoubleNull),
            ("shift_pattern", ColType::StringWithDefault(String::new())),
            ("safety_critical_role", ColType::StringWithDefault(String::new())),
            ("dvla_group_1_licence_held", ColType::StringWithDefault(String::new())),
            ("dvla_group_2_licence_held", ColType::StringWithDefault(String::new())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patients").await
    }
}
