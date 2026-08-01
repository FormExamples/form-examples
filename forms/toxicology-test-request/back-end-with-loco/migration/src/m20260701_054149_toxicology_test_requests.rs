use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "toxicology_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("paracetamol_level", ColType::BooleanWithDefault(false)),
            ("salicylate_level", ColType::BooleanWithDefault(false)),
            ("alcohol_level", ColType::BooleanWithDefault(false)),
            ("drugs_of_abuse_screen", ColType::BooleanWithDefault(false)),
            ("lithium_level", ColType::BooleanWithDefault(false)),
            ("digoxin_level", ColType::BooleanWithDefault(false)),
            ("antiepileptic_drug_level", ColType::BooleanWithDefault(false)),
            ("carboxyhaemoglobin", ColType::BooleanWithDefault(false)),
            ("heavy_metals", ColType::BooleanWithDefault(false)),
            ("specific_drug_level", ColType::BooleanWithDefault(false)),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("suspected_agent", ColType::StringWithDefault(String::new())),
            ("time_since_ingestion_hours", ColType::DoubleNull),
            ("deliberate_overdose", ColType::BooleanWithDefault(false)),
            ("symptomatic", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "toxicology_test_requests").await
    }
}
