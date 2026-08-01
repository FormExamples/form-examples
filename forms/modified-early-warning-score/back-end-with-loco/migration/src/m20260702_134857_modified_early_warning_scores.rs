use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "modified_early_warning_scores",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("observation_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("ward_or_location", ColType::StringWithDefault(String::new())),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("heart_rate", ColType::IntegerNull),
            ("respiratory_rate", ColType::IntegerNull),
            ("temperature", ColType::DoubleNull),
            ("consciousness_avpu", ColType::StringWithDefault(String::new())),
            ("previous_mews_score", ColType::IntegerNull),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "modified_early_warning_scores").await
    }
}
