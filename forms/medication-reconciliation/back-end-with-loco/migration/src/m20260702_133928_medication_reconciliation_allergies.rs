use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medication_reconciliation_allergies",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("substance", ColType::TextWithDefault(String::new())),
            ("reaction_type", ColType::StringWithDefault(String::new())),
            ("severity", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("medication_reconciliation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliation_allergies").await
    }
}
