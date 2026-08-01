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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_condition", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("known_cancer_site", ColType::StringWithDefault(String::new())),
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
            ("trend", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("overall_result_status", ColType::StringWithDefault(String::new())),
            ("markedly_elevated", ColType::BooleanWithDefault(false)),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "tumor_marker_test_results").await
    }
}
