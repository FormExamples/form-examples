use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "donors",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("title", ColType::String),
            ("given_names", ColType::String),
            ("family_name", ColType::String),
            ("other_names_used", ColType::String),
            ("birth_date", ColType::DateNull),
            ("email", ColType::Text),
            ("phone", ColType::Text),
            ("postal_address_as_full_text", ColType::Text),
            ("country_as_iso_3166_1_alpha_2", ColType::String),
            ("postcode", ColType::Text),
            ("united_kingdom_nhs_number", ColType::StringNull),
            ("jurisdiction", ColType::String),
            ("preferred_language", ColType::String),
            ("capacity_declared", ColType::String),
            ("capacity_declared_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "donors").await
    }
}
