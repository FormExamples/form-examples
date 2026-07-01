use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "allergy_skin_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("test_type", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::String),
            ("antihistamines_withheld", ColType::Boolean),
            ("positive_control_valid", ColType::Boolean),
            ("allergens_tested", ColType::String),
            ("wheal_sizes", ColType::String),
            ("specific_ige_results", ColType::String),
            ("sensitised_allergens", ColType::String),
            ("positive_reactions", ColType::Boolean),
            ("sensitisation_confirmed", ColType::Boolean),
            ("anaphylaxis_during_test", ColType::Boolean),
            ("all_negative", ColType::Boolean),
            ("test_invalid", ColType::Boolean),
            ("interpretation", ColType::String),
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
        drop_table(m, "allergy_skin_test_results").await
    }
}
