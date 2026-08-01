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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("procedure", ColType::StringWithDefault(String::new())),
            ("anaesthesia", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("bladder_tumour", ColType::BooleanWithDefault(false)),
            ("inflammation_cystitis", ColType::BooleanWithDefault(false)),
            ("bladder_stones", ColType::BooleanWithDefault(false)),
            ("urethral_stricture", ColType::BooleanWithDefault(false)),
            ("trabeculation", ColType::BooleanWithDefault(false)),
            ("prostatic_enlargement", ColType::BooleanWithDefault(false)),
            ("normal_examination", ColType::BooleanWithDefault(false)),
            ("tumour_size_mm", ColType::DoubleNull),
            ("tumour_appearance", ColType::StringWithDefault(String::new())),
            ("biopsy_taken", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "cystoscopy_test_results").await
    }
}
