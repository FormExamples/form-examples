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
            ("originating_request_reference", ColType::String),
            ("test_type", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("report_status", ColType::String),
            ("test_quality", ColType::String),
            ("clinical_history", ColType::String),
            ("fev1_litres", ColType::DoubleNull),
            ("fev1_percent_predicted", ColType::DoubleNull),
            ("fvc_litres", ColType::DoubleNull),
            ("fvc_percent_predicted", ColType::DoubleNull),
            ("fev1_fvc_ratio", ColType::DoubleNull),
            ("peak_expiratory_flow", ColType::DoubleNull),
            ("dlco_percent_predicted", ColType::DoubleNull),
            ("ventilatory_pattern", ColType::String),
            ("severity", ColType::String),
            ("bronchodilator_reversibility", ColType::String),
            ("airflow_obstruction", ColType::Boolean),
            ("restriction", ColType::Boolean),
            ("reduced_gas_transfer", ColType::Boolean),
            ("significant_reversibility", ColType::Boolean),
            ("normal_spirometry", ColType::Boolean),
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
        drop_table(m, "pulmonary_function_test_results").await
    }
}
