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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_condition", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("on_anticoagulant", ColType::BooleanWithDefault(false)),
            ("anticoagulant_agent", ColType::StringWithDefault(String::new())),
            ("prothrombin_time_seconds", ColType::DoubleNull),
            ("inr", ColType::DoubleNull),
            ("activated_partial_thromboplastin_time_seconds", ColType::DoubleNull),
            ("aptt_ratio", ColType::DoubleNull),
            ("fibrinogen_g_l", ColType::DoubleNull),
            ("d_dimer", ColType::DoubleNull),
            ("thrombin_time_seconds", ColType::DoubleNull),
            ("factor_assays", ColType::StringWithDefault(String::new())),
            ("overall_result_status", ColType::StringWithDefault(String::new())),
            ("critical_value_present", ColType::BooleanWithDefault(false)),
            ("critical_value_detail", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("impression", ColType::StringWithDefault(String::new())),
            ("reporting_category", ColType::StringWithDefault(String::new())),
            ("recommended_follow_up", ColType::StringWithDefault(String::new())),
            ("critical_result_communicated", ColType::BooleanWithDefault(false)),
            ("reported_to", ColType::StringWithDefault(String::new())),
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
