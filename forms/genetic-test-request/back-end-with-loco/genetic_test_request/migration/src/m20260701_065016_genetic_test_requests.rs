use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "genetic_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("clinical_details", ColType::String),
            ("family_history", ColType::String),
            ("suspected_condition", ColType::String),
            ("consent_obtained", ColType::Boolean),
            ("genetic_counselling_offered", ColType::Boolean),
            ("affected_relative_tested", ColType::Boolean),
            ("specimen_type", ColType::String),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("requester_contact", ColType::String),
            ("notes", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "genetic_test_requests").await
    }
}
