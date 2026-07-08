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
            ("name", ColType::Text),
            ("birth_date", ColType::DateNull),
            ("sex_at_birth", ColType::String),
            ("nationality_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("passport_number", ColType::Text),
            ("united_kingdom_nhs_number", ColType::StringUniq),
            ("national_health_id", ColType::Text),
            ("email", ColType::Text),
            ("phone", ColType::Text),
            ("postal_address_as_full_text", ColType::Text),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::Text),
            ("emergency_contact_name", ColType::Text),
            ("emergency_contact_relationship", ColType::Text),
            ("emergency_contact_phone", ColType::Text),
            ("weight_as_kg", ColType::DoubleNull),
            ("height_as_cm", ColType::DoubleNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patients").await
    }
}
