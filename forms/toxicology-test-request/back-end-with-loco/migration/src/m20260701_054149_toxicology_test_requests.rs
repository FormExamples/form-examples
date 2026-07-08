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
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("paracetamol_level", ColType::Boolean),
            ("salicylate_level", ColType::Boolean),
            ("alcohol_level", ColType::Boolean),
            ("drugs_of_abuse_screen", ColType::Boolean),
            ("lithium_level", ColType::Boolean),
            ("digoxin_level", ColType::Boolean),
            ("antiepileptic_drug_level", ColType::Boolean),
            ("carboxyhaemoglobin", ColType::Boolean),
            ("heavy_metals", ColType::Boolean),
            ("specific_drug_level", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("suspected_agent", ColType::String),
            ("time_since_ingestion_hours", ColType::DoubleNull),
            ("deliberate_overdose", ColType::Boolean),
            ("symptomatic", ColType::Boolean),
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
        drop_table(m, "toxicology_test_requests").await
    }
}
