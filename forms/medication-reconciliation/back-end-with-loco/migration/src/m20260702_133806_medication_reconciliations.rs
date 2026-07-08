use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medication_reconciliations",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("reconciliation_type", ColType::String),
            ("care_setting", ColType::String),
            ("reconciled_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("patient_identifier", ColType::Text),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("weight_kg", ColType::DoubleNull),
            ("allergy_status", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliations").await
    }
}
