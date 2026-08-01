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
            
            ("person_name", ColType::TextWithDefault(String::new())),
            ("date_of_birth", ColType::DateNull),
            ("identifier", ColType::TextWithDefault(String::new())),
            ("address", ColType::TextWithDefault(String::new())),
            ("key_contact", ColType::TextWithDefault(String::new())),
            ("health_summary", ColType::TextWithDefault(String::new())),
            ("diagnoses", ColType::TextWithDefault(String::new())),
            ("existing_documents", ColType::TextWithDefault(String::new())),
            ("what_matters", ColType::TextWithDefault(String::new())),
            ("care_preferences", ColType::TextWithDefault(String::new())),
            ("priority_balance", ColType::StringWithDefault(String::new())),
            ("recommended_interventions", ColType::TextWithDefault(String::new())),
            ("not_recommended_interventions", ColType::TextWithDefault(String::new())),
            ("cpr_recommendation", ColType::StringWithDefault(String::new())),
            ("cpr_rationale", ColType::TextWithDefault(String::new())),
            ("cpr_discussed", ColType::StringWithDefault(String::new())),
            ("hospital_transfer", ColType::StringWithDefault(String::new())),
            ("critical_care_admission", ColType::StringWithDefault(String::new())),
            ("treatment_ceilings", ColType::TextWithDefault(String::new())),
            ("has_capacity", ColType::StringWithDefault(String::new())),
            ("capacity_assessment", ColType::TextWithDefault(String::new())),
            ("involvement", ColType::StringWithDefault(String::new())),
            ("proxy_details", ColType::TextWithDefault(String::new())),
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("clinician_registration", ColType::TextWithDefault(String::new())),
            ("signature", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("senior_endorsement", ColType::TextWithDefault(String::new())),
            ("emergency_contacts", ColType::TextWithDefault(String::new())),
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
