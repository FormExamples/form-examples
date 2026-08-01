use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pulmonary_function_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("test_quality", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("fev1_litres", ColType::DoubleNull),
            ("fev1_percent_predicted", ColType::DoubleNull),
            ("fvc_litres", ColType::DoubleNull),
            ("fvc_percent_predicted", ColType::DoubleNull),
            ("fev1_fvc_ratio", ColType::DoubleNull),
            ("peak_expiratory_flow", ColType::DoubleNull),
            ("dlco_percent_predicted", ColType::DoubleNull),
            ("ventilatory_pattern", ColType::StringWithDefault(String::new())),
            ("severity", ColType::StringWithDefault(String::new())),
            ("bronchodilator_reversibility", ColType::StringWithDefault(String::new())),
            ("airflow_obstruction", ColType::BooleanWithDefault(false)),
            ("restriction", ColType::BooleanWithDefault(false)),
            ("reduced_gas_transfer", ColType::BooleanWithDefault(false)),
            ("significant_reversibility", ColType::BooleanWithDefault(false)),
            ("normal_spirometry", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "pulmonary_function_test_results").await
    }
}
