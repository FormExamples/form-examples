use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "paediatric_early_warning_scores",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("observation_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("age_band", ColType::String),
            ("respiratory_rate", ColType::IntegerNull),
            ("respiratory_effort", ColType::String),
            ("oxygen_saturation", ColType::IntegerNull),
            ("supplemental_oxygen", ColType::String),
            ("heart_rate", ColType::IntegerNull),
            ("capillary_refill", ColType::String),
            ("consciousness_acvpu", ColType::String),
            ("nurse_concern", ColType::String),
            ("parent_concern", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "paediatric_early_warning_scores").await
    }
}
