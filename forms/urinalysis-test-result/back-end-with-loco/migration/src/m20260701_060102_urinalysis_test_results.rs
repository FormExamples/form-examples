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
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_type", ColType::String),
            ("specimen_condition", ColType::String),
            ("clinical_history", ColType::String),
            ("leucocytes", ColType::String),
            ("nitrites", ColType::String),
            ("protein", ColType::String),
            ("blood", ColType::String),
            ("glucose", ColType::String),
            ("ketones", ColType::String),
            ("bilirubin", ColType::String),
            ("ph", ColType::DoubleNull),
            ("specific_gravity", ColType::DoubleNull),
            ("red_cell_count", ColType::String),
            ("white_cell_count", ColType::String),
            ("epithelial_cells", ColType::String),
            ("casts", ColType::String),
            ("organisms_seen", ColType::Boolean),
            ("crystals", ColType::String),
            ("culture_result", ColType::String),
            ("organism_isolated", ColType::String),
            ("colony_count_cfu_ml", ColType::String),
            ("antibiotic_sensitivities", ColType::String),
            ("overall_result_status", ColType::String),
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
        drop_table(m, "urinalysis_test_results").await
    }
}
