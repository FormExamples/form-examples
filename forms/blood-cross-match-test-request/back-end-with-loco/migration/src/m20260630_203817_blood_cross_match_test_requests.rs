use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_cross_match_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("request_type", ColType::String),
            ("component", ColType::String),
            ("units_required", ColType::IntegerNull),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("patient_blood_group", ColType::String),
            ("known_antibodies", ColType::Boolean),
            ("antibody_detail", ColType::String),
            ("previous_transfusion", ColType::Boolean),
            ("previous_transfusion_reaction", ColType::Boolean),
            ("pregnant", ColType::Boolean),
            ("sample_collected", ColType::String),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
            ("two_sample_rule_met", ColType::Boolean),
            ("required_by_datetime", ColType::TimestampWithTimeZoneNull),
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
        drop_table(m, "blood_cross_match_test_requests").await
    }
}
