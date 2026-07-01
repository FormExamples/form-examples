use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "coagulation_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("prothrombin_time_inr", ColType::Boolean),
            ("activated_partial_thromboplastin_time", ColType::Boolean),
            ("fibrinogen", ColType::Boolean),
            ("d_dimer", ColType::Boolean),
            ("thrombophilia_screen", ColType::Boolean),
            ("factor_assays", ColType::Boolean),
            ("anti_xa_assay", ColType::Boolean),
            ("mixing_studies", ColType::Boolean),
            ("von_willebrand_screen", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("on_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("bleeding_history", ColType::Boolean),
            ("thrombosis_history", ColType::Boolean),
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
        drop_table(m, "coagulation_test_requests").await
    }
}
