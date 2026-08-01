use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "microbiology_culture_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_type", ColType::StringWithDefault(String::new())),
            ("specimen_site_detail", ColType::StringWithDefault(String::new())),
            ("specimen_condition", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("gram_stain_result", ColType::StringWithDefault(String::new())),
            ("culture_result", ColType::StringWithDefault(String::new())),
            ("organism_isolated", ColType::StringWithDefault(String::new())),
            ("second_organism_isolated", ColType::StringWithDefault(String::new())),
            ("colony_count", ColType::StringWithDefault(String::new())),
            ("antibiotic_sensitivities", ColType::StringWithDefault(String::new())),
            ("resistance_mrsa", ColType::BooleanWithDefault(false)),
            ("resistance_esbl", ColType::BooleanWithDefault(false)),
            ("resistance_cpe", ColType::BooleanWithDefault(false)),
            ("c_difficile_toxin", ColType::StringWithDefault(String::new())),
            ("acid_fast_bacilli", ColType::StringWithDefault(String::new())),
            ("pcr_result", ColType::StringWithDefault(String::new())),
            ("critical_organism", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "microbiology_culture_test_results").await
    }
}
