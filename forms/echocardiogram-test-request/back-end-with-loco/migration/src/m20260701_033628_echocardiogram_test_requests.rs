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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("echo_type", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("breathlessness", ColType::BooleanWithDefault(false)),
            ("chest_pain", ColType::BooleanWithDefault(false)),
            ("palpitations", ColType::BooleanWithDefault(false)),
            ("syncope", ColType::BooleanWithDefault(false)),
            ("oedema", ColType::BooleanWithDefault(false)),
            ("nyha_class", ColType::StringWithDefault(String::new())),
            ("ecg_findings", ColType::StringWithDefault(String::new())),
            ("bnp_or_nt_probnp", ColType::DoubleNull),
            ("known_murmur", ColType::BooleanWithDefault(false)),
            ("previous_echo", ColType::StringWithDefault(String::new())),
            ("previous_echo_date", ColType::DateNull),
            ("ejection_fraction_known", ColType::DoubleNull),
            ("on_cardiotoxic_chemotherapy", ColType::BooleanWithDefault(false)),
            ("relevant_medications", ColType::StringWithDefault(String::new())),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("notes", ColType::StringWithDefault(String::new())),
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
