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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("scan_type", ColType::StringWithDefault(String::new())),
            ("radiopharmaceutical", ColType::StringWithDefault(String::new())),
            ("injected_activity_mbq", ColType::DoubleNull),
            ("examination_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("abnormal_uptake", ColType::BooleanWithDefault(false)),
            ("metastatic_pattern", ColType::BooleanWithDefault(false)),
            ("perfusion_defect", ColType::BooleanWithDefault(false)),
            ("photopenic_area", ColType::BooleanWithDefault(false)),
            ("no_significant_abnormality", ColType::BooleanWithDefault(false)),
            ("incidental_finding", ColType::BooleanWithDefault(false)),
            ("ejection_fraction_percent", ColType::DoubleNull),
            ("split_function_left_percent", ColType::DoubleNull),
            ("split_function_right_percent", ColType::DoubleNull),
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
        drop_table(m, "nuclear_medicine_test_results").await
    }
}
