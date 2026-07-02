use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "edinburgh_postnatal_depression_scales",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("care_setting", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("perinatal_stage", ColType::String),
            ("perinatal_week", ColType::DoubleNull),
            ("respondent_identifier", ColType::String),
            ("age_band", ColType::String),
            ("preferred_language", ColType::String),
            ("assistance_needed", ColType::String),
            ("item_1", ColType::IntegerNull),
            ("item_2", ColType::IntegerNull),
            ("item_3", ColType::IntegerNull),
            ("item_4", ColType::IntegerNull),
            ("item_5", ColType::IntegerNull),
            ("item_6", ColType::IntegerNull),
            ("item_7", ColType::IntegerNull),
            ("item_8", ColType::IntegerNull),
            ("item_9", ColType::IntegerNull),
            ("item_10", ColType::IntegerNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "edinburgh_postnatal_depression_scales").await
    }
}
