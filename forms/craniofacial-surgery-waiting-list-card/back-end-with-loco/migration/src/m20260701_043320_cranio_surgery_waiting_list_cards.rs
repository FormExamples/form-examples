use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cranio_surgery_waiting_list_cards",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("entry_date", ColType::DateNull),
            ("entry_time", ColType::StringNull),
            ("referral_source", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("referral_letter_reference", ColType::StringWithDefault(String::new())),
            ("reason_for_referral", ColType::TextWithDefault(String::new())),
            ("presenting_condition", ColType::TextWithDefault(String::new())),
            ("icd_10_code", ColType::StringWithDefault(String::new())),
            ("snomed_ct_code", ColType::StringWithDefault(String::new())),
            ("suspected_cancer", ColType::StringWithDefault(String::new())),
            ("list_name", ColType::StringWithDefault(String::new())),
            ("specialty", ColType::StringWithDefault(String::new())),
            ("sub_specialty", ColType::StringWithDefault(String::new())),
            ("procedure_description", ColType::TextWithDefault(String::new())),
            ("opcs_4_code", ColType::StringWithDefault(String::new())),
            ("clinical_priority", ColType::StringWithDefault(String::new())),
            ("rtt_clock_start_date", ColType::DateNull),
            ("expected_procedure_type", ColType::StringWithDefault(String::new())),
            ("expected_wait_weeks", ColType::IntegerNull),
            ("consent_to_reminders", ColType::StringWithDefault(String::new())),
            ("communication_notes", ColType::TextWithDefault(String::new())),
            ("additional_notes", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("patient", ""),
            ("practitioner", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cranio_surgery_waiting_list_cards").await
    }
}
