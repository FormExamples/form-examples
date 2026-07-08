use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "tumor_marker_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_condition", ColType::String),
            ("clinical_history", ColType::String),
            ("known_cancer_site", ColType::String),
            ("psa", ColType::DoubleNull),
            ("ca125", ColType::DoubleNull),
            ("ca19_9", ColType::DoubleNull),
            ("carcinoembryonic_antigen_cea", ColType::DoubleNull),
            ("alpha_fetoprotein_afp", ColType::DoubleNull),
            ("beta_hcg", ColType::DoubleNull),
            ("ca15_3", ColType::DoubleNull),
            ("lactate_dehydrogenase_ldh", ColType::DoubleNull),
            ("calcitonin", ColType::DoubleNull),
            ("chromogranin_a", ColType::DoubleNull),
            ("previous_value", ColType::DoubleNull),
            ("trend", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("overall_result_status", ColType::String),
            ("markedly_elevated", ColType::Boolean),
            ("findings_narrative", ColType::String),
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
        drop_table(m, "tumor_marker_test_results").await
    }
}
