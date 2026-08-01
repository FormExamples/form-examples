use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "administration_records",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("vaccine_name", ColType::StringWithDefault(String::new())),
            ("batch_number", ColType::StringWithDefault(String::new())),
            ("expiry_date", ColType::DateNull),
            ("administration_site", ColType::StringWithDefault(String::new())),
            ("administration_route", ColType::StringWithDefault(String::new())),
            ("dose_number", ColType::StringWithDefault(String::new())),
            ("administered_by", ColType::StringWithDefault(String::new())),
            ("administration_date", ColType::DateNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "administration_records").await
    }
}
