use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mri_scan_test_requests",
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
            ("egfr", ColType::DoubleNull),
            ("previous_gadolinium_reaction", ColType::String),
            ("pregnancy_status", ColType::String),
            ("pacemaker_or_icd", ColType::Boolean),
            ("cochlear_implant", ColType::Boolean),
            ("aneurysm_clip", ColType::Boolean),
            ("metallic_foreign_body_eye", ColType::Boolean),
            ("shrapnel_or_metal_fragments", ColType::Boolean),
            ("programmable_shunt", ColType::Boolean),
            ("neurostimulator", ColType::Boolean),
            ("metal_implant_or_prosthesis", ColType::Boolean),
            ("insulin_pump", ColType::Boolean),
            ("claustrophobia", ColType::Boolean),
            ("mri_safety_status", ColType::String),
            ("weight_kg", ColType::DoubleNull),
            ("relevant_previous_imaging", ColType::String),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("notes", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mri_scan_test_requests").await
    }
}
