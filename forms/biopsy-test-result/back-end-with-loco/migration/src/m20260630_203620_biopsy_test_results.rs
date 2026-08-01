use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "biopsy_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("biopsy_site", ColType::StringWithDefault(String::new())),
            ("biopsy_method", ColType::StringWithDefault(String::new())),
            ("specimen_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("macroscopic_description", ColType::StringWithDefault(String::new())),
            ("microscopic_description", ColType::StringWithDefault(String::new())),
            ("diagnosis", ColType::StringWithDefault(String::new())),
            ("malignancy_present", ColType::BooleanWithDefault(false)),
            ("tumour_type", ColType::StringWithDefault(String::new())),
            ("histological_grade", ColType::StringWithDefault(String::new())),
            ("resection_margins", ColType::StringWithDefault(String::new())),
            ("lymphovascular_invasion", ColType::BooleanWithDefault(false)),
            ("immunohistochemistry", ColType::StringWithDefault(String::new())),
            ("molecular_results", ColType::StringWithDefault(String::new())),
            ("snomed_code", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "biopsy_test_results").await
    }
}
