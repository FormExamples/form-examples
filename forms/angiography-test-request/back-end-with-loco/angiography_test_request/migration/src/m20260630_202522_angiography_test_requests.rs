use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "angiography_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("angiography_type", ColType::String),
            ("body_region", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("contrast_required", ColType::String),
            ("egfr", ColType::DoubleNull),
            ("contrast_allergy", ColType::Boolean),
            ("diabetes", ColType::Boolean),
            ("metformin", ColType::Boolean),
            ("taking_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("taking_antiplatelet", ColType::Boolean),
            ("bleeding_disorder", ColType::Boolean),
            ("pregnancy_status", ColType::String),
            ("urgency", ColType::String),
            ("ir_me_r_justification", ColType::String),
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
        drop_table(m, "angiography_test_requests").await
    }
}
