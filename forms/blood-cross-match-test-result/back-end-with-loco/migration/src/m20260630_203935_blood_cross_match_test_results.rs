use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_cross_match_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("request_type", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("abo_group", ColType::StringWithDefault(String::new())),
            ("rhd_group", ColType::StringWithDefault(String::new())),
            ("antibody_screen_result", ColType::StringWithDefault(String::new())),
            ("antibodies_identified", ColType::StringWithDefault(String::new())),
            ("crossmatch_result", ColType::StringWithDefault(String::new())),
            ("component", ColType::StringWithDefault(String::new())),
            ("units_crossmatched", ColType::IntegerNull),
            ("units_available", ColType::IntegerNull),
            ("two_sample_rule_met", ColType::BooleanWithDefault(false)),
            ("special_requirements", ColType::StringWithDefault(String::new())),
            ("historical_group_concordant", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "blood_cross_match_test_results").await
    }
}
