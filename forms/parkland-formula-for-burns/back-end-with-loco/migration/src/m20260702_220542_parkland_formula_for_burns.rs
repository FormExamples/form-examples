use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "parkland_formula_for_burns",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("care_setting", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("weight_kg", ColType::DoubleNull),
            ("tbsa_percent", ColType::DoubleNull),
            ("tbsa_method", ColType::String),
            ("injury_at", ColType::TimestampWithTimeZoneNull),
            ("injury_time_known", ColType::String),
            ("inhalation_suspected", ColType::String),
            ("circumferential_or_deep", ColType::String),
            ("mechanism", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "parkland_formula_for_burns").await
    }
}
