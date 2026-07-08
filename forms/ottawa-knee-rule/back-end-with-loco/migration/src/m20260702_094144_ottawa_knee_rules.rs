use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ottawa_knee_rules",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("status", ColType::String),
            ("patient_identifier", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("injury_mechanism", ColType::String),
            ("hours_since_injury", ColType::DoubleNull),
            ("sex", ColType::String),
            ("injured_side", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("patellar_tenderness", ColType::String),
            ("other_bony_tenderness", ColType::String),
            ("fibular_head_tenderness", ColType::String),
            ("unable_to_flex_90", ColType::String),
            ("unable_to_bear_weight", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ottawa_knee_rules").await
    }
}
