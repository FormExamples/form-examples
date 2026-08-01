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
            
            ("sample_taker_role", ColType::StringWithDefault(String::new())),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("record_date", ColType::DateNull),
            ("time_of_birth", ColType::StringNull),
            ("gestation_weeks", ColType::DoubleNull),
            ("previously_screened", ColType::StringWithDefault(String::new())),
            ("consent_given", ColType::StringWithDefault(String::new())),
            ("decline_reason", ColType::TextWithDefault(String::new())),
            ("sample_date", ColType::DateNull),
            ("sample_time", ColType::StringNull),
            ("age_at_sample_days", ColType::IntegerNull),
            ("sampling_site", ColType::StringWithDefault(String::new())),
            ("sample_notes", ColType::TextWithDefault(String::new())),
            ("sample_adequacy", ColType::StringWithDefault(String::new())),
            ("spot_quality_issue", ColType::StringWithDefault(String::new())),
            ("is_repeat", ColType::StringWithDefault(String::new())),
            ("repeat_reason", ColType::StringWithDefault(String::new())),
            ("scd_result", ColType::StringWithDefault(String::new())),
            ("cf_result", ColType::StringWithDefault(String::new())),
            ("cht_result", ColType::StringWithDefault(String::new())),
            ("pku_result", ColType::StringWithDefault(String::new())),
            ("mcadd_result", ColType::StringWithDefault(String::new())),
            ("msud_result", ColType::StringWithDefault(String::new())),
            ("iva_result", ColType::StringWithDefault(String::new())),
            ("ga1_result", ColType::StringWithDefault(String::new())),
            ("hcu_result", ColType::StringWithDefault(String::new())),
            ("clinical_context", ColType::TextWithDefault(String::new())),
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
