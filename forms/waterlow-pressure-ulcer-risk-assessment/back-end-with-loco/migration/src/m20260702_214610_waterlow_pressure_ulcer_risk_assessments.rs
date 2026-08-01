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
            ("nurse_name", ColType::StringWithDefault(String::new())),
            ("nurse_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("assessment_reason", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("build_weight_for_height", ColType::StringWithDefault(String::new())),
            ("skin_type", ColType::StringWithDefault(String::new())),
            ("continence", ColType::StringWithDefault(String::new())),
            ("mobility", ColType::StringWithDefault(String::new())),
            ("tissue_malnutrition", ColType::StringWithDefault(String::new())),
            ("neurological_deficit", ColType::StringWithDefault(String::new())),
            ("major_surgery_trauma", ColType::StringWithDefault(String::new())),
            ("medication", ColType::StringWithDefault(String::new())),
            ("existing_pressure_damage", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
