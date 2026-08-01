use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "urinalysis_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_type", ColType::StringWithDefault(String::new())),
            ("specimen_condition", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("leucocytes", ColType::StringWithDefault(String::new())),
            ("nitrites", ColType::StringWithDefault(String::new())),
            ("protein", ColType::StringWithDefault(String::new())),
            ("blood", ColType::StringWithDefault(String::new())),
            ("glucose", ColType::StringWithDefault(String::new())),
            ("ketones", ColType::StringWithDefault(String::new())),
            ("bilirubin", ColType::StringWithDefault(String::new())),
            ("ph", ColType::DoubleNull),
            ("specific_gravity", ColType::DoubleNull),
            ("red_cell_count", ColType::StringWithDefault(String::new())),
            ("white_cell_count", ColType::StringWithDefault(String::new())),
            ("epithelial_cells", ColType::StringWithDefault(String::new())),
            ("casts", ColType::StringWithDefault(String::new())),
            ("organisms_seen", ColType::BooleanWithDefault(false)),
            ("crystals", ColType::StringWithDefault(String::new())),
            ("culture_result", ColType::StringWithDefault(String::new())),
            ("organism_isolated", ColType::StringWithDefault(String::new())),
            ("colony_count_cfu_ml", ColType::StringWithDefault(String::new())),
            ("antibiotic_sensitivities", ColType::StringWithDefault(String::new())),
            ("overall_result_status", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "urinalysis_test_results").await
    }
}
