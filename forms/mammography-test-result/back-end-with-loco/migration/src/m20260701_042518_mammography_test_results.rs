use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mammography_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("exam_type", ColType::String),
            ("laterality", ColType::String),
            ("examination_adequacy", ColType::String),
            ("breast_density", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("findings_narrative", ColType::String),
            ("mass", ColType::Boolean),
            ("calcifications", ColType::Boolean),
            ("architectural_distortion", ColType::Boolean),
            ("asymmetry", ColType::Boolean),
            ("skin_or_nipple_change", ColType::Boolean),
            ("lymphadenopathy", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
            ("largest_lesion_size_mm", ColType::DoubleNull),
            ("impression", ColType::String),
            ("bi_rads_category", ColType::String),
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
        drop_table(m, "mammography_test_results").await
    }
}
