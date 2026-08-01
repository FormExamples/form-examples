use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medication_reconciliation_discrepancies",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("discrepancy_type", ColType::StringWithDefault(String::new())),
            ("bpmh_item_ref", ColType::TextWithDefault(String::new())),
            ("inpatient_item_ref", ColType::TextWithDefault(String::new())),
            ("intended_action", ColType::StringWithDefault(String::new())),
            ("rationale", ColType::TextWithDefault(String::new())),
            ("intentional", ColType::BooleanWithDefault(false)),
            ],
            &[
            ("medication_reconciliation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliation_discrepancies").await
    }
}
