use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lumbar_puncture_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("procedure_intent", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("suspected_raised_intracranial_pressure", ColType::Boolean),
            ("focal_neurological_signs", ColType::Boolean),
            ("reduced_consciousness", ColType::Boolean),
            ("ct_head_status", ColType::String),
            ("taking_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("taking_antiplatelet", ColType::Boolean),
            ("antiplatelet_agent", ColType::String),
            ("inr", ColType::DoubleNull),
            ("platelet_count", ColType::DoubleNull),
            ("bleeding_disorder", ColType::Boolean),
            ("local_skin_infection", ColType::Boolean),
            ("opening_pressure_required", ColType::Boolean),
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
        drop_table(m, "lumbar_puncture_test_requests").await
    }
}
