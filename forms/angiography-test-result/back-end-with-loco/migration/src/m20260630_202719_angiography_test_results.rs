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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("angiography_type", ColType::StringWithDefault(String::new())),
            ("body_region", ColType::StringWithDefault(String::new())),
            ("contrast_used", ColType::StringWithDefault(String::new())),
            ("examination_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("significant_stenosis", ColType::BooleanWithDefault(false)),
            ("occlusion", ColType::BooleanWithDefault(false)),
            ("aneurysm", ColType::BooleanWithDefault(false)),
            ("dissection", ColType::BooleanWithDefault(false)),
            ("active_extravasation", ColType::BooleanWithDefault(false)),
            ("thrombus", ColType::BooleanWithDefault(false)),
            ("normal_vessels", ColType::BooleanWithDefault(false)),
            ("incidental_finding", ColType::BooleanWithDefault(false)),
            ("max_stenosis_percent", ColType::DoubleNull),
            ("intervention_performed", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "angiography_test_results").await
    }
}
