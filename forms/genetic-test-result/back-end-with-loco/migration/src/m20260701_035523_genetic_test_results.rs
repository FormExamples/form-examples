use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "genetic_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("genes_tested", ColType::TextWithDefault(String::new())),
            ("sample_type", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("inheritance_pattern", ColType::StringWithDefault(String::new())),
            ("variants_detected", ColType::StringWithDefault(String::new())),
            ("variant_classification", ColType::StringWithDefault(String::new())),
            ("zygosity", ColType::StringWithDefault(String::new())),
            ("pathogenic_variant_found", ColType::BooleanWithDefault(false)),
            ("vus_found", ColType::BooleanWithDefault(false)),
            ("carrier_status_positive", ColType::BooleanWithDefault(false)),
            ("secondary_finding", ColType::BooleanWithDefault(false)),
            ("no_clinically_significant_variant", ColType::BooleanWithDefault(false)),
            ("interpretation", ColType::StringWithDefault(String::new())),
            ("impression", ColType::StringWithDefault(String::new())),
            ("reporting_category", ColType::StringWithDefault(String::new())),
            ("recommended_cascade_testing", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "genetic_test_results").await
    }
}
