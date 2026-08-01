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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("procedure", ColType::StringWithDefault(String::new())),
            ("sedation_used", ColType::StringWithDefault(String::new())),
            ("extent_examined", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("endobronchial_lesion", ColType::BooleanWithDefault(false)),
            ("mucosal_abnormality", ColType::BooleanWithDefault(false)),
            ("extrinsic_compression", ColType::BooleanWithDefault(false)),
            ("bleeding", ColType::BooleanWithDefault(false)),
            ("foreign_body", ColType::BooleanWithDefault(false)),
            ("secretions_purulent", ColType::BooleanWithDefault(false)),
            ("normal_examination", ColType::BooleanWithDefault(false)),
            ("lesion_location", ColType::StringWithDefault(String::new())),
            ("samples_taken", ColType::StringWithDefault(String::new())),
            ("complication", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "bronchoscopy_test_results").await
    }
}
