use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "fluid_balance_chart_entries",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("entry_at", ColType::TimestampWithTimeZoneNull),
            ("direction", ColType::String),
            ("category", ColType::String),
            ("description", ColType::Text),
            ("volume_ml", ColType::DoubleNull),
            ],
            &[
            ("fluid_balance_chart", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "fluid_balance_chart_entries").await
    }
}
