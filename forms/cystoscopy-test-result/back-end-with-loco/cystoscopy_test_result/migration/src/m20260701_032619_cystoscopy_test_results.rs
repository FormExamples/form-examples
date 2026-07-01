use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cystoscopy_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("procedure", ColType::String),
            ("anaesthesia", ColType::String),
            ("clinical_history", ColType::String),
            ("bladder_tumour", ColType::Boolean),
            ("inflammation_cystitis", ColType::Boolean),
            ("bladder_stones", ColType::Boolean),
            ("urethral_stricture", ColType::Boolean),
            ("trabeculation", ColType::Boolean),
            ("prostatic_enlargement", ColType::Boolean),
            ("normal_examination", ColType::Boolean),
            ("tumour_size_mm", ColType::DoubleNull),
            ("tumour_appearance", ColType::String),
            ("biopsy_taken", ColType::Boolean),
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
        drop_table(m, "cystoscopy_test_results").await
    }
}
