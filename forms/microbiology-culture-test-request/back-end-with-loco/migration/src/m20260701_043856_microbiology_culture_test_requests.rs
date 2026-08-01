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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("specimen_type", ColType::StringWithDefault(String::new())),
            ("specimen_site_detail", ColType::StringWithDefault(String::new())),
            ("test_culture_and_sensitivity", ColType::BooleanWithDefault(false)),
            ("test_gram_stain", ColType::BooleanWithDefault(false)),
            ("test_acid_fast_bacilli_tb", ColType::BooleanWithDefault(false)),
            ("test_fungal_culture", ColType::BooleanWithDefault(false)),
            ("test_pcr_molecular", ColType::BooleanWithDefault(false)),
            ("test_c_difficile_toxin", ColType::BooleanWithDefault(false)),
            ("test_mrsa_screen", ColType::BooleanWithDefault(false)),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("fever", ColType::BooleanWithDefault(false)),
            ("current_antibiotics", ColType::BooleanWithDefault(false)),
            ("antibiotic_name", ColType::StringWithDefault(String::new())),
            ("recent_travel", ColType::BooleanWithDefault(false)),
            ("immunocompromised", ColType::BooleanWithDefault(false)),
            ("specimen_collected", ColType::StringWithDefault(String::new())),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
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
        drop_table(m, "microbiology_culture_test_requests").await
    }
}
