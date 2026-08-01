use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "records_to_releases",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("record_types", ColType::Text),
            ("specific_date_range", ColType::StringWithDefault(String::new())),
            ("date_from", ColType::DateNull),
            ("date_to", ColType::DateNull),
            ("specific_record_details", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("release_form", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "records_to_releases").await
    }
}
