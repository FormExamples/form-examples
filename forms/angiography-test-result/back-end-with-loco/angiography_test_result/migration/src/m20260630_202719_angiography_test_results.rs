use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "angiography_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("angiography_type", ColType::String),
            ("body_region", ColType::String),
            ("contrast_used", ColType::String),
            ("examination_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("findings_narrative", ColType::String),
            ("significant_stenosis", ColType::Boolean),
            ("occlusion", ColType::Boolean),
            ("aneurysm", ColType::Boolean),
            ("dissection", ColType::Boolean),
            ("active_extravasation", ColType::Boolean),
            ("thrombus", ColType::Boolean),
            ("normal_vessels", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
            ("max_stenosis_percent", ColType::DoubleNull),
            ("intervention_performed", ColType::Boolean),
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
        drop_table(m, "angiography_test_results").await
    }
}
