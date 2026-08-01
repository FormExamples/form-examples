use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "electroencephalogram_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("eeg_type", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("seizure_frequency", ColType::StringWithDefault(String::new())),
            ("first_seizure", ColType::BooleanWithDefault(false)),
            ("known_epilepsy", ColType::BooleanWithDefault(false)),
            ("current_antiepileptics", ColType::StringWithDefault(String::new())),
            ("recent_seizure", ColType::BooleanWithDefault(false)),
            ("suspected_status_epilepticus", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "electroencephalogram_test_requests").await
    }
}
