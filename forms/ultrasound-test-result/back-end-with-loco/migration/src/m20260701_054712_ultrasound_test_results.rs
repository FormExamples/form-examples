use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ultrasound_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("body_region", ColType::StringWithDefault(String::new())),
            ("laterality", ColType::StringWithDefault(String::new())),
            ("examination_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("mass_or_lesion", ColType::BooleanWithDefault(false)),
            ("cyst", ColType::BooleanWithDefault(false)),
            ("gallstones", ColType::BooleanWithDefault(false)),
            ("hydronephrosis", ColType::BooleanWithDefault(false)),
            ("free_fluid", ColType::BooleanWithDefault(false)),
            ("dvt_present", ColType::BooleanWithDefault(false)),
            ("aneurysm", ColType::BooleanWithDefault(false)),
            ("organ_enlargement", ColType::BooleanWithDefault(false)),
            ("incidental_finding", ColType::BooleanWithDefault(false)),
            ("largest_lesion_size_mm", ColType::DoubleNull),
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
        drop_table(m, "ultrasound_test_results").await
    }
}
