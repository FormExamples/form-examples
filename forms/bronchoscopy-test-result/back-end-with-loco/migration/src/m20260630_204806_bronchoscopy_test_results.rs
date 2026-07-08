use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bronchoscopy_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("procedure", ColType::String),
            ("sedation_used", ColType::String),
            ("extent_examined", ColType::String),
            ("clinical_history", ColType::String),
            ("endobronchial_lesion", ColType::Boolean),
            ("mucosal_abnormality", ColType::Boolean),
            ("extrinsic_compression", ColType::Boolean),
            ("bleeding", ColType::Boolean),
            ("foreign_body", ColType::Boolean),
            ("secretions_purulent", ColType::Boolean),
            ("normal_examination", ColType::Boolean),
            ("lesion_location", ColType::String),
            ("samples_taken", ColType::String),
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
        drop_table(m, "bronchoscopy_test_results").await
    }
}
