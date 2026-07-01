use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "coagulation_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_condition", ColType::String),
            ("clinical_history", ColType::String),
            ("on_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("prothrombin_time_seconds", ColType::DoubleNull),
            ("inr", ColType::DoubleNull),
            ("activated_partial_thromboplastin_time_seconds", ColType::DoubleNull),
            ("aptt_ratio", ColType::DoubleNull),
            ("fibrinogen_g_l", ColType::DoubleNull),
            ("d_dimer", ColType::DoubleNull),
            ("thrombin_time_seconds", ColType::DoubleNull),
            ("factor_assays", ColType::String),
            ("overall_result_status", ColType::String),
            ("critical_value_present", ColType::Boolean),
            ("critical_value_detail", ColType::String),
            ("findings_narrative", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("impression", ColType::String),
            ("reporting_category", ColType::String),
            ("recommended_follow_up", ColType::String),
            ("critical_result_communicated", ColType::Boolean),
            ("reported_to", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "coagulation_test_results").await
    }
}
