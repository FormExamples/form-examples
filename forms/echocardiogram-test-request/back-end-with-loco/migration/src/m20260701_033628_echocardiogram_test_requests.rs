use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "echocardiogram_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("echo_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("breathlessness", ColType::Boolean),
            ("chest_pain", ColType::Boolean),
            ("palpitations", ColType::Boolean),
            ("syncope", ColType::Boolean),
            ("oedema", ColType::Boolean),
            ("nyha_class", ColType::String),
            ("ecg_findings", ColType::String),
            ("bnp_or_nt_probnp", ColType::DoubleNull),
            ("known_murmur", ColType::Boolean),
            ("previous_echo", ColType::String),
            ("previous_echo_date", ColType::DateNull),
            ("ejection_fraction_known", ColType::DoubleNull),
            ("on_cardiotoxic_chemotherapy", ColType::Boolean),
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
        drop_table(m, "echocardiogram_test_requests").await
    }
}
