use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ct_scan_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("body_region", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("contrast_required", ColType::String),
            ("pregnancy_status", ColType::String),
            ("egfr", ColType::DoubleNull),
            ("previous_contrast_reaction", ColType::String),
            ("iodine_contrast_allergy", ColType::Boolean),
            ("metformin", ColType::Boolean),
            ("diabetes", ColType::Boolean),
            ("renal_impairment", ColType::Boolean),
            ("weight_kg", ColType::DoubleNull),
            ("relevant_previous_imaging", ColType::String),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("ir_me_r_justification", ColType::String),
            ("notes", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ct_scan_test_requests").await
    }
}
