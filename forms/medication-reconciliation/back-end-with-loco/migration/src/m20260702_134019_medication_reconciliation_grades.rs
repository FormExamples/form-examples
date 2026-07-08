use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medication_reconciliation_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("source_count", ColType::Integer),
            ("unintentional_count", ColType::Integer),
            ("high_risk_unintentional_count", ColType::Integer),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("medication_reconciliation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliation_grades").await
    }
}
