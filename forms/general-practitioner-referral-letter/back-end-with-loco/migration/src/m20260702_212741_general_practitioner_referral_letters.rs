use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "general_practitioner_referral_letters",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("patient_identifier", ColType::String),
            ("referrer_role", ColType::String),
            ("referring_practice", ColType::Text),
            ("referral_date", ColType::DateNull),
            ("access_needs", ColType::Text),
            ("referral_specialty", ColType::Text),
            ("named_clinician", ColType::Text),
            ("receiving_organisation", ColType::Text),
            ("urgency", ColType::String),
            ("urgency_reason", ColType::Text),
            ("suspected_cancer_criterion", ColType::Text),
            ("suspected_cancer_pathway", ColType::Text),
            ("reason_for_referral", ColType::Text),
            ("relevant_history", ColType::Text),
            ("presenting_problem", ColType::Text),
            ("symptom_duration", ColType::Text),
            ("red_flag_symptoms", ColType::Text),
            ("examination_findings", ColType::Text),
            ("investigation_results", ColType::Text),
            ("current_medications", ColType::Text),
            ("allergies", ColType::Text),
            ("patient_expectations", ColType::Text),
            ("consent_to_share", ColType::String),
            ("safety_netting", ColType::Text),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "general_practitioner_referral_letters").await
    }
}
