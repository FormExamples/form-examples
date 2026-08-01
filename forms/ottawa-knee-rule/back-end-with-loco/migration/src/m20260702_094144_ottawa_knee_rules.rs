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

            ("status", ColType::StringWithDefault("draft".to_string())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("injury_mechanism", ColType::StringWithDefault(String::new())),
            ("hours_since_injury", ColType::DoubleNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("injured_side", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::IntegerNull),
            ("patellar_tenderness", ColType::StringWithDefault(String::new())),
            ("other_bony_tenderness", ColType::StringWithDefault(String::new())),
            ("fibular_head_tenderness", ColType::StringWithDefault(String::new())),
            ("unable_to_flex_90", ColType::StringWithDefault(String::new())),
            ("unable_to_bear_weight", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
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
