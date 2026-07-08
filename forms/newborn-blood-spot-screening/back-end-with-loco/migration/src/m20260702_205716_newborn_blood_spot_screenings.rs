use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "newborn_blood_spot_screenings",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("sample_taker_role", ColType::String),
            ("care_setting", ColType::String),
            ("record_date", ColType::DateNull),
            ("time_of_birth", ColType::StringNull),
            ("gestation_weeks", ColType::DoubleNull),
            ("previously_screened", ColType::String),
            ("consent_given", ColType::String),
            ("decline_reason", ColType::Text),
            ("sample_date", ColType::DateNull),
            ("sample_time", ColType::StringNull),
            ("age_at_sample_days", ColType::IntegerNull),
            ("sampling_site", ColType::String),
            ("sample_notes", ColType::Text),
            ("sample_adequacy", ColType::String),
            ("spot_quality_issue", ColType::String),
            ("is_repeat", ColType::String),
            ("repeat_reason", ColType::String),
            ("scd_result", ColType::String),
            ("cf_result", ColType::String),
            ("cht_result", ColType::String),
            ("pku_result", ColType::String),
            ("mcadd_result", ColType::String),
            ("msud_result", ColType::String),
            ("iva_result", ColType::String),
            ("ga1_result", ColType::String),
            ("hcu_result", ColType::String),
            ("clinical_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "newborn_blood_spot_screenings").await
    }
}
