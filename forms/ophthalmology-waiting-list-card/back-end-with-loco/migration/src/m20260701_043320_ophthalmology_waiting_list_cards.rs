use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ophthalmology_waiting_list_cards",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("entry_date", ColType::DateNull),
            ("entry_time", ColType::StringNull),
            ("referral_source", ColType::String),
            ("referral_date", ColType::DateNull),
            ("referral_letter_reference", ColType::String),
            ("reason_for_referral", ColType::Text),
            ("presenting_condition", ColType::Text),
            ("icd_10_code", ColType::String),
            ("snomed_ct_code", ColType::String),
            ("suspected_cancer", ColType::String),
            ("list_name", ColType::String),
            ("specialty", ColType::String),
            ("sub_specialty", ColType::String),
            ("procedure_description", ColType::Text),
            ("opcs_4_code", ColType::String),
            ("clinical_priority", ColType::String),
            ("rtt_clock_start_date", ColType::DateNull),
            ("expected_procedure_type", ColType::String),
            ("expected_wait_weeks", ColType::IntegerNull),
            ("consent_to_reminders", ColType::String),
            ("communication_notes", ColType::Text),
            ("additional_notes", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("patient", ""),
            ("practitioner", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ophthalmology_waiting_list_cards").await
    }
}
