use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "holter_monitor_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("monitor_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("symptom_palpitations", ColType::Boolean),
            ("symptom_syncope", ColType::Boolean),
            ("symptom_presyncope", ColType::Boolean),
            ("symptom_breathlessness", ColType::Boolean),
            ("symptom_frequency", ColType::String),
            ("known_arrhythmia", ColType::String),
            ("recent_stroke_tia", ColType::Boolean),
            ("relevant_medications", ColType::String),
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
        drop_table(m, "holter_monitor_test_requests").await
    }
}
