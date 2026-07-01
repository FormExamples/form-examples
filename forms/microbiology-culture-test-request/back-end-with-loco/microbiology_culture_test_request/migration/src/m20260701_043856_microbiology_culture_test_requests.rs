use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "microbiology_culture_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("specimen_type", ColType::String),
            ("specimen_site_detail", ColType::String),
            ("test_culture_and_sensitivity", ColType::Boolean),
            ("test_gram_stain", ColType::Boolean),
            ("test_acid_fast_bacilli_tb", ColType::Boolean),
            ("test_fungal_culture", ColType::Boolean),
            ("test_pcr_molecular", ColType::Boolean),
            ("test_c_difficile_toxin", ColType::Boolean),
            ("test_mrsa_screen", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("fever", ColType::Boolean),
            ("current_antibiotics", ColType::Boolean),
            ("antibiotic_name", ColType::String),
            ("recent_travel", ColType::Boolean),
            ("immunocompromised", ColType::Boolean),
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
        drop_table(m, "microbiology_culture_test_requests").await
    }
}
