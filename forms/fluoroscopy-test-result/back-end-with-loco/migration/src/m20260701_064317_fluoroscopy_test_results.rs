use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "fluoroscopy_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("study_type", ColType::String),
            ("contrast_used", ColType::String),
            ("examination_adequacy", ColType::String),
            ("screening_time_minutes", ColType::DoubleNull),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("findings_narrative", ColType::String),
            ("stricture", ColType::Boolean),
            ("reflux", ColType::Boolean),
            ("obstruction", ColType::Boolean),
            ("perforation_or_leak", ColType::Boolean),
            ("fistula", ColType::Boolean),
            ("filling_defect", ColType::Boolean),
            ("dysmotility", ColType::Boolean),
            ("normal_study", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
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
        drop_table(m, "fluoroscopy_test_results").await
    }
}
