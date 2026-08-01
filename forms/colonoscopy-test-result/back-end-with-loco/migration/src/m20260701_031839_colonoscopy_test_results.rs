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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("procedure", ColType::StringWithDefault(String::new())),
            ("extent_reached", ColType::StringWithDefault(String::new())),
            ("bowel_preparation_quality", ColType::StringWithDefault(String::new())),
            ("sedation_used", ColType::BooleanWithDefault(false)),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("polyps_found", ColType::BooleanWithDefault(false)),
            ("mass_lesion", ColType::BooleanWithDefault(false)),
            ("diverticulosis", ColType::BooleanWithDefault(false)),
            ("inflammation_ibd", ColType::BooleanWithDefault(false)),
            ("angiodysplasia", ColType::BooleanWithDefault(false)),
            ("bleeding_source_identified", ColType::BooleanWithDefault(false)),
            ("normal_examination", ColType::BooleanWithDefault(false)),
            ("polyp_count", ColType::IntegerNull),
            ("largest_polyp_mm", ColType::DoubleNull),
            ("biopsy_taken", ColType::BooleanWithDefault(false)),
            ("polypectomy_performed", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "colonoscopy_test_results").await
    }
}
