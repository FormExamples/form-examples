use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cytology_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("specimen_type", ColType::String),
            ("specimen_site", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("clinical_details", ColType::String),
            ("hpv_test_requested", ColType::Boolean),
            ("previous_abnormal_cytology", ColType::String),
            ("last_menstrual_period_date", ColType::DateNull),
            ("specimen_collected", ColType::String),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
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
        drop_table(m, "cytology_test_requests").await
    }
}
