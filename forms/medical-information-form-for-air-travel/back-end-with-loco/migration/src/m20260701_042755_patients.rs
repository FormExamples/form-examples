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
            ("name", ColType::TextWithDefault(String::new())),
            ("birth_date", ColType::DateNull),
            ("sex_at_birth", ColType::StringWithDefault(String::new())),
            ("nationality_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("passport_number", ColType::TextWithDefault(String::new())),
            ("united_kingdom_nhs_number", ColType::StringUniq),
            ("national_health_id", ColType::TextWithDefault(String::new())),
            ("email", ColType::TextWithDefault(String::new())),
            ("phone", ColType::TextWithDefault(String::new())),
            ("postal_address_as_full_text", ColType::TextWithDefault(String::new())),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextWithDefault(String::new())),
            ("emergency_contact_name", ColType::TextWithDefault(String::new())),
            ("emergency_contact_relationship", ColType::TextWithDefault(String::new())),
            ("emergency_contact_phone", ColType::TextWithDefault(String::new())),
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
