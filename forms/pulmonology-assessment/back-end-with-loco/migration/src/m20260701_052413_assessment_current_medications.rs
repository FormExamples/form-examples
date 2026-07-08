use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_current_medications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("inhaler_use", ColType::String),
            ("inhaler_technique_assessed", ColType::String),
            ("inhaler_technique_adequate", ColType::String),
            ("short_acting_bronchodilator", ColType::String),
            ("saba_frequency", ColType::Text),
            ("long_acting_bronchodilator", ColType::String),
            ("inhaled_corticosteroid", ColType::String),
            ("combination_inhaler", ColType::String),
            ("long_term_oxygen_therapy", ColType::String),
            ("oxygen_flow_rate_lmin", ColType::DoubleNull),
            ("oxygen_hours_per_day", ColType::IntegerNull),
            ("nebuliser_use", ColType::String),
            ("oral_medications", ColType::Text),
            ("medication_adherence", ColType::String),
            ("additional_notes", ColType::Text),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_current_medications").await
    }
}
