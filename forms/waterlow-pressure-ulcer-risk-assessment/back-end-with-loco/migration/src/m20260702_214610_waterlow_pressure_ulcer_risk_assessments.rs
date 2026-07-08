use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "waterlow_pressure_ulcer_risk_assessments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("nurse_name", ColType::String),
            ("nurse_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("assessment_reason", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("build_weight_for_height", ColType::String),
            ("skin_type", ColType::String),
            ("continence", ColType::String),
            ("mobility", ColType::String),
            ("tissue_malnutrition", ColType::String),
            ("neurological_deficit", ColType::String),
            ("major_surgery_trauma", ColType::String),
            ("medication", ColType::String),
            ("existing_pressure_damage", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "waterlow_pressure_ulcer_risk_assessments").await
    }
}
