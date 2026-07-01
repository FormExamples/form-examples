use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "colonoscopy_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("procedure", ColType::String),
            ("extent_reached", ColType::String),
            ("bowel_preparation_quality", ColType::String),
            ("sedation_used", ColType::Boolean),
            ("clinical_history", ColType::String),
            ("polyps_found", ColType::Boolean),
            ("mass_lesion", ColType::Boolean),
            ("diverticulosis", ColType::Boolean),
            ("inflammation_ibd", ColType::Boolean),
            ("angiodysplasia", ColType::Boolean),
            ("bleeding_source_identified", ColType::Boolean),
            ("normal_examination", ColType::Boolean),
            ("polyp_count", ColType::IntegerNull),
            ("largest_polyp_mm", ColType::DoubleNull),
            ("biopsy_taken", ColType::Boolean),
            ("polypectomy_performed", ColType::Boolean),
            ("complication", ColType::String),
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
        drop_table(m, "colonoscopy_test_results").await
    }
}
