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
            
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("observation_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("respiratory_rate", ColType::IntegerNull),
            ("respiratory_effort", ColType::StringWithDefault(String::new())),
            ("oxygen_saturation", ColType::IntegerNull),
            ("supplemental_oxygen", ColType::StringWithDefault(String::new())),
            ("heart_rate", ColType::IntegerNull),
            ("capillary_refill", ColType::StringWithDefault(String::new())),
            ("consciousness_acvpu", ColType::StringWithDefault(String::new())),
            ("nurse_concern", ColType::StringWithDefault(String::new())),
            ("parent_concern", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
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
