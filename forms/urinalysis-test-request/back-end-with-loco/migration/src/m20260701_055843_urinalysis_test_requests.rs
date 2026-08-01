use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "urinalysis_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("dipstick", ColType::BooleanWithDefault(false)),
            ("microscopy_culture_sensitivity", ColType::BooleanWithDefault(false)),
            ("albumin_creatinine_ratio", ColType::BooleanWithDefault(false)),
            ("protein_creatinine_ratio", ColType::BooleanWithDefault(false)),
            ("pregnancy_test", ColType::BooleanWithDefault(false)),
            ("drug_screen", ColType::BooleanWithDefault(false)),
            ("cytology", ColType::BooleanWithDefault(false)),
            ("twenty_four_hour_collection", ColType::BooleanWithDefault(false)),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("symptom_dysuria", ColType::BooleanWithDefault(false)),
            ("symptom_frequency", ColType::BooleanWithDefault(false)),
            ("symptom_visible_haematuria", ColType::BooleanWithDefault(false)),
            ("symptom_loin_pain", ColType::BooleanWithDefault(false)),
            ("symptom_fever", ColType::BooleanWithDefault(false)),
            ("specimen_type", ColType::StringWithDefault(String::new())),
            ("specimen_collected", ColType::StringWithDefault(String::new())),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
            ("pregnant", ColType::BooleanWithDefault(false)),
            ("catheterised", ColType::BooleanWithDefault(false)),
            ("current_antibiotics", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "urinalysis_test_requests").await
    }
}
