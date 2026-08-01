use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bronchoscopy_test_request_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("appropriateness_score", ColType::IntegerNull),
            ("appropriateness_band", ColType::StringWithDefault(String::new())),
            ("triage_tier", ColType::StringWithDefault(String::new())),
            ("target_timeframe", ColType::StringWithDefault(String::new())),
            ("two_week_wait_eligible", ColType::BooleanWithDefault(false)),
            ("completeness_percent", ColType::IntegerNull),
            ("risk_band", ColType::StringWithDefault(String::new())),
            ("anticoagulant_action", ColType::StringWithDefault(String::new())),
            ("recommendation", ColType::StringWithDefault(String::new())),
            ("clinician_notes", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("bronchoscopy_test_request", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bronchoscopy_test_request_grades").await
    }
}
