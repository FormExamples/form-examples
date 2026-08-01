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
            ("inhaler_use", ColType::StringWithDefault(String::new())),
            ("inhaler_technique_assessed", ColType::StringWithDefault(String::new())),
            ("inhaler_technique_adequate", ColType::StringWithDefault(String::new())),
            ("short_acting_bronchodilator", ColType::StringWithDefault(String::new())),
            ("saba_frequency", ColType::TextWithDefault(String::new())),
            ("long_acting_bronchodilator", ColType::StringWithDefault(String::new())),
            ("inhaled_corticosteroid", ColType::StringWithDefault(String::new())),
            ("combination_inhaler", ColType::StringWithDefault(String::new())),
            ("long_term_oxygen_therapy", ColType::StringWithDefault(String::new())),
            ("oxygen_flow_rate_lmin", ColType::DoubleNull),
            ("oxygen_hours_per_day", ColType::IntegerNull),
            ("nebuliser_use", ColType::StringWithDefault(String::new())),
            ("oral_medications", ColType::TextWithDefault(String::new())),
            ("medication_adherence", ColType::StringWithDefault(String::new())),
            ("additional_notes", ColType::TextWithDefault(String::new())),
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
