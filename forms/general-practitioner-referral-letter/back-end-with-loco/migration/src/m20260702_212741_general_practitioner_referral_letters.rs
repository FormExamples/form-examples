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
            
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("referrer_role", ColType::StringWithDefault(String::new())),
            ("referring_practice", ColType::TextWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("access_needs", ColType::TextWithDefault(String::new())),
            ("referral_specialty", ColType::TextWithDefault(String::new())),
            ("named_clinician", ColType::TextWithDefault(String::new())),
            ("receiving_organisation", ColType::TextWithDefault(String::new())),
            ("urgency", ColType::StringWithDefault(String::new())),
            ("urgency_reason", ColType::TextWithDefault(String::new())),
            ("suspected_cancer_criterion", ColType::TextWithDefault(String::new())),
            ("suspected_cancer_pathway", ColType::TextWithDefault(String::new())),
            ("reason_for_referral", ColType::TextWithDefault(String::new())),
            ("relevant_history", ColType::TextWithDefault(String::new())),
            ("presenting_problem", ColType::TextWithDefault(String::new())),
            ("symptom_duration", ColType::TextWithDefault(String::new())),
            ("red_flag_symptoms", ColType::TextWithDefault(String::new())),
            ("examination_findings", ColType::TextWithDefault(String::new())),
            ("investigation_results", ColType::TextWithDefault(String::new())),
            ("current_medications", ColType::TextWithDefault(String::new())),
            ("allergies", ColType::TextWithDefault(String::new())),
            ("patient_expectations", ColType::TextWithDefault(String::new())),
            ("consent_to_share", ColType::StringWithDefault(String::new())),
            ("safety_netting", ColType::TextWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
