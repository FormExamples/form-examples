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
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("request_type", ColType::String),
            ("clinical_history", ColType::String),
            ("abo_group", ColType::String),
            ("rhd_group", ColType::String),
            ("antibody_screen_result", ColType::String),
            ("antibodies_identified", ColType::String),
            ("crossmatch_result", ColType::String),
            ("component", ColType::String),
            ("units_crossmatched", ColType::IntegerNull),
            ("units_available", ColType::IntegerNull),
            ("two_sample_rule_met", ColType::Boolean),
            ("special_requirements", ColType::String),
            ("historical_group_concordant", ColType::Boolean),
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
        drop_table(m, "blood_cross_match_test_results").await
    }
}
