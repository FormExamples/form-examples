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
            
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::TextWithDefault(String::new())),
            ("ward_or_unit", ColType::TextWithDefault(String::new())),
            ("chart_start_at", ColType::TimestampWithTimeZoneNull),
            ("chart_period_hours", ColType::DoubleNull),
            ("weight_kg", ColType::DoubleNull),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
