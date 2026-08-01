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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("prothrombin_time_inr", ColType::BooleanWithDefault(false)),
            ("activated_partial_thromboplastin_time", ColType::BooleanWithDefault(false)),
            ("fibrinogen", ColType::BooleanWithDefault(false)),
            ("d_dimer", ColType::BooleanWithDefault(false)),
            ("thrombophilia_screen", ColType::BooleanWithDefault(false)),
            ("factor_assays", ColType::BooleanWithDefault(false)),
            ("anti_xa_assay", ColType::BooleanWithDefault(false)),
            ("mixing_studies", ColType::BooleanWithDefault(false)),
            ("von_willebrand_screen", ColType::BooleanWithDefault(false)),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("on_anticoagulant", ColType::BooleanWithDefault(false)),
            ("anticoagulant_agent", ColType::StringWithDefault(String::new())),
            ("bleeding_history", ColType::BooleanWithDefault(false)),
            ("thrombosis_history", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "coagulation_test_requests").await
    }
}
