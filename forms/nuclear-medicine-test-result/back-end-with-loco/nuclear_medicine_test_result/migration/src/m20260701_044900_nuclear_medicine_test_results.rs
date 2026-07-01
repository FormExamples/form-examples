use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "nuclear_medicine_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("scan_type", ColType::String),
            ("radiopharmaceutical", ColType::String),
            ("injected_activity_mbq", ColType::DoubleNull),
            ("examination_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("findings_narrative", ColType::String),
            ("abnormal_uptake", ColType::Boolean),
            ("metastatic_pattern", ColType::Boolean),
            ("perfusion_defect", ColType::Boolean),
            ("photopenic_area", ColType::Boolean),
            ("no_significant_abnormality", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
            ("ejection_fraction_percent", ColType::DoubleNull),
            ("split_function_left_percent", ColType::DoubleNull),
            ("split_function_right_percent", ColType::DoubleNull),
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
        drop_table(m, "nuclear_medicine_test_results").await
    }
}
