use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "employers",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::String),
            ("industry_sector", ColType::StringWithDefault(String::new())),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("occupational_health_contact_name", ColType::TextWithDefault(String::new())),
            ("occupational_health_contact_email", ColType::TextWithDefault(String::new())),
            ("occupational_health_contact_phone", ColType::TextWithDefault(String::new())),
            ("hr_contact_name", ColType::TextWithDefault(String::new())),
            ("hr_contact_email", ColType::TextWithDefault(String::new())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "employers").await
    }
}
