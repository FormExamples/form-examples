use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pulmonary_embolism_rule_out_criteria",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("status", ColType::String),
            ("patient_identifier", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("presenting_complaint", ColType::Text),
            ("age", ColType::DoubleNull),
            ("heart_rate", ColType::DoubleNull),
            ("oxygen_saturation", ColType::DoubleNull),
            ("pretest_probability", ColType::String),
            ("age_under_50", ColType::String),
            ("heart_rate_under_100", ColType::String),
            ("spo2_at_least_95", ColType::String),
            ("no_unilateral_leg_swelling", ColType::String),
            ("no_haemoptysis", ColType::String),
            ("no_recent_surgery_trauma", ColType::String),
            ("no_prior_dvt_pe", ColType::String),
            ("no_oestrogen_use", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pulmonary_embolism_rule_out_criteria").await
    }
}
