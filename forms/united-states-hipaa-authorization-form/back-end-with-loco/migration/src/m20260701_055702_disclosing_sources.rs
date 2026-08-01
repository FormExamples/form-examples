use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "disclosing_sources",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("identification_mode", ColType::StringWithDefault(String::new())),
            ("specific_persons_or_organizations", ColType::TextWithDefault(String::new())),
            ("class_description", ColType::TextWithDefault(String::new())),
            ("is_va_facility", ColType::StringWithDefault(String::new())),
            ("is_part_2_program", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("hipaa_authorization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "disclosing_sources").await
    }
}
