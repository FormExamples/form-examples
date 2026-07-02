use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "anion_gap_calculators",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("calculated_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("clinical_context", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("sodium_mmol_l", ColType::DoubleNull),
            ("potassium_mmol_l", ColType::DoubleNull),
            ("chloride_mmol_l", ColType::DoubleNull),
            ("bicarbonate_mmol_l", ColType::DoubleNull),
            ("albumin_g_l", ColType::DoubleNull),
            ("include_potassium", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anion_gap_calculators").await
    }
}
