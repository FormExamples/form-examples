use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "allergy_skin_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("allergen_aeroallergens", ColType::Boolean),
            ("allergen_food", ColType::Boolean),
            ("allergen_drug", ColType::Boolean),
            ("allergen_venom", ColType::Boolean),
            ("allergen_latex", ColType::Boolean),
            ("allergen_contact", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("clinical_details", ColType::String),
            ("previous_anaphylaxis", ColType::Boolean),
            ("on_antihistamines", ColType::Boolean),
            ("on_beta_blocker", ColType::Boolean),
            ("current_skin_disease", ColType::Boolean),
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
        drop_table(m, "allergy_skin_test_requests").await
    }
}
