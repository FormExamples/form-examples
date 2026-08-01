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
            
            ("list_source", ColType::StringWithDefault(String::new())),
            ("drug_name", ColType::TextWithDefault(String::new())),
            ("form", ColType::TextWithDefault(String::new())),
            ("dose", ColType::TextWithDefault(String::new())),
            ("route", ColType::StringWithDefault(String::new())),
            ("frequency", ColType::TextWithDefault(String::new())),
            ("indication", ColType::TextWithDefault(String::new())),
            ("high_risk_class", ColType::StringWithDefault(String::new())),
            ("adherence", ColType::StringWithDefault(String::new())),
            ("source_type", ColType::StringWithDefault(String::new())),
            ("status", ColType::StringWithDefault(String::new())),
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
