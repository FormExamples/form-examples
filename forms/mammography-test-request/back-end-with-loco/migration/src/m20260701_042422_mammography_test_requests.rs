use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mammography_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("exam_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("laterality", ColType::String),
            ("symptom_lump", ColType::Boolean),
            ("symptom_pain", ColType::Boolean),
            ("symptom_nipple_discharge", ColType::Boolean),
            ("symptom_skin_change", ColType::Boolean),
            ("symptom_nipple_inversion", ColType::Boolean),
            ("previous_mammogram", ColType::String),
            ("previous_mammogram_date", ColType::DateNull),
            ("family_history_breast_cancer", ColType::Boolean),
            ("breast_implants", ColType::Boolean),
            ("pregnancy_or_lactating", ColType::String),
            ("hormone_replacement_therapy", ColType::Boolean),
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
        drop_table(m, "mammography_test_requests").await
    }
}
