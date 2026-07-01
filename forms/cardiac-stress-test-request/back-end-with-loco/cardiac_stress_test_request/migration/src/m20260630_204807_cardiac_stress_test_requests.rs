use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cardiac_stress_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("symptom_chest_pain", ColType::Boolean),
            ("symptom_breathlessness", ColType::Boolean),
            ("symptom_palpitations", ColType::Boolean),
            ("able_to_exercise", ColType::Boolean),
            ("resting_ecg_findings", ColType::String),
            ("known_coronary_artery_disease", ColType::Boolean),
            ("recent_acute_coronary_syndrome", ColType::Boolean),
            ("aortic_stenosis", ColType::String),
            ("uncontrolled_hypertension", ColType::Boolean),
            ("beta_blocker", ColType::Boolean),
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
        drop_table(m, "cardiac_stress_test_requests").await
    }
}
