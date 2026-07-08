use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "respect",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("person_name", ColType::Text),
            ("date_of_birth", ColType::DateNull),
            ("identifier", ColType::Text),
            ("address", ColType::Text),
            ("key_contact", ColType::Text),
            ("health_summary", ColType::Text),
            ("diagnoses", ColType::Text),
            ("existing_documents", ColType::Text),
            ("what_matters", ColType::Text),
            ("care_preferences", ColType::Text),
            ("priority_balance", ColType::String),
            ("recommended_interventions", ColType::Text),
            ("not_recommended_interventions", ColType::Text),
            ("cpr_recommendation", ColType::String),
            ("cpr_rationale", ColType::Text),
            ("cpr_discussed", ColType::String),
            ("hospital_transfer", ColType::String),
            ("critical_care_admission", ColType::String),
            ("treatment_ceilings", ColType::Text),
            ("has_capacity", ColType::String),
            ("capacity_assessment", ColType::Text),
            ("involvement", ColType::String),
            ("proxy_details", ColType::Text),
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("clinician_registration", ColType::Text),
            ("signature", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("senior_endorsement", ColType::Text),
            ("emergency_contacts", ColType::Text),
            ("review_date", ColType::DateNull),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "respect").await
    }
}
