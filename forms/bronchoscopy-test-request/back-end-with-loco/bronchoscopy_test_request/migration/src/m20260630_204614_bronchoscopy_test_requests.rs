use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bronchoscopy_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("procedure", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("symptom_haemoptysis", ColType::Boolean),
            ("symptom_cough", ColType::Boolean),
            ("symptom_breathlessness", ColType::Boolean),
            ("symptom_weight_loss", ColType::Boolean),
            ("imaging_findings", ColType::String),
            ("taking_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("taking_antiplatelet", ColType::Boolean),
            ("antiplatelet_agent", ColType::String),
            ("platelet_count", ColType::DoubleNull),
            ("oxygen_dependent", ColType::Boolean),
            ("asa_grade", ColType::String),
            ("sedation", ColType::String),
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
        drop_table(m, "bronchoscopy_test_requests").await
    }
}
