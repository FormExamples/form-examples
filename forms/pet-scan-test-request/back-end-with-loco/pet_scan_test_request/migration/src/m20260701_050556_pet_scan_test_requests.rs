use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pet_scan_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("scan_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("primary_tumour_site", ColType::String),
            ("diabetes", ColType::Boolean),
            ("blood_glucose_mmol_l", ColType::DoubleNull),
            ("pregnancy_status", ColType::String),
            ("breastfeeding", ColType::Boolean),
            ("egfr", ColType::DoubleNull),
            ("recent_chemo_radiotherapy", ColType::String),
            ("claustrophobia", ColType::Boolean),
            ("weight_kg", ColType::DoubleNull),
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
        drop_table(m, "pet_scan_test_requests").await
    }
}
