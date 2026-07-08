use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medication_reconciliation_line_items",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("list_source", ColType::String),
            ("drug_name", ColType::Text),
            ("form", ColType::Text),
            ("dose", ColType::Text),
            ("route", ColType::String),
            ("frequency", ColType::Text),
            ("indication", ColType::Text),
            ("high_risk_class", ColType::String),
            ("adherence", ColType::String),
            ("source_type", ColType::String),
            ("status", ColType::String),
            ],
            &[
            ("medication_reconciliation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliation_line_items").await
    }
}
