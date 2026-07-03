use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_rom_measurements",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("movement", ColType::String),
            ("active_degrees", ColType::IntegerNull),
            ("passive_degrees", ColType::IntegerNull),
            ("normal_degrees", ColType::IntegerNull),
            ("end_feel", ColType::String),
            ("pain_on_movement", ColType::String),
            ("sort_order", ColType::Integer),
            ],
            &[
            ("assessment_range_of_motion", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_rom_measurements").await
    }
}
