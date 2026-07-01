use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "eye_vision_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("laterality", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("symptom_reduced_vision", ColType::Boolean),
            ("symptom_sudden_loss", ColType::Boolean),
            ("symptom_flashes_floaters", ColType::Boolean),
            ("symptom_eye_pain", ColType::Boolean),
            ("symptom_red_eye", ColType::Boolean),
            ("diabetes", ColType::Boolean),
            ("known_glaucoma", ColType::Boolean),
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
        drop_table(m, "eye_vision_test_requests").await
    }
}
