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
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("dipstick", ColType::Boolean),
            ("microscopy_culture_sensitivity", ColType::Boolean),
            ("albumin_creatinine_ratio", ColType::Boolean),
            ("protein_creatinine_ratio", ColType::Boolean),
            ("pregnancy_test", ColType::Boolean),
            ("drug_screen", ColType::Boolean),
            ("cytology", ColType::Boolean),
            ("twenty_four_hour_collection", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("symptom_dysuria", ColType::Boolean),
            ("symptom_frequency", ColType::Boolean),
            ("symptom_visible_haematuria", ColType::Boolean),
            ("symptom_loin_pain", ColType::Boolean),
            ("symptom_fever", ColType::Boolean),
            ("specimen_type", ColType::String),
            ("specimen_collected", ColType::String),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
            ("pregnant", ColType::Boolean),
            ("catheterised", ColType::Boolean),
            ("current_antibiotics", ColType::Boolean),
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
        drop_table(m, "urinalysis_test_requests").await
    }
}
