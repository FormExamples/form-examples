use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "fluid_balance_charts",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("patient_identifier", ColType::Text),
            ("ward_or_unit", ColType::Text),
            ("chart_start_at", ColType::TimestampWithTimeZoneNull),
            ("chart_period_hours", ColType::DoubleNull),
            ("weight_kg", ColType::DoubleNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "fluid_balance_charts").await
    }
}
