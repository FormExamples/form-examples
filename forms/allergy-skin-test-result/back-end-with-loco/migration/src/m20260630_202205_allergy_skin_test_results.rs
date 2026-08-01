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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("antihistamines_withheld", ColType::BooleanWithDefault(false)),
            ("positive_control_valid", ColType::BooleanWithDefault(false)),
            ("allergens_tested", ColType::StringWithDefault(String::new())),
            ("wheal_sizes", ColType::StringWithDefault(String::new())),
            ("specific_ige_results", ColType::StringWithDefault(String::new())),
            ("sensitised_allergens", ColType::StringWithDefault(String::new())),
            ("positive_reactions", ColType::BooleanWithDefault(false)),
            ("sensitisation_confirmed", ColType::BooleanWithDefault(false)),
            ("anaphylaxis_during_test", ColType::BooleanWithDefault(false)),
            ("all_negative", ColType::BooleanWithDefault(false)),
            ("test_invalid", ColType::BooleanWithDefault(false)),
            ("interpretation", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "allergy_skin_test_results").await
    }
}
