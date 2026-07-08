use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "breast_screenings",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("reporting_clinician_role", ColType::String),
            ("reported_at", ColType::TimestampWithTimeZoneNull),
            ("screening_unit", ColType::Text),
            ("episode_type", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("last_screened_date", ColType::DateNull),
            ("higher_risk_surveillance", ColType::String),
            ("symptomatic", ColType::String),
            ("consent_given", ColType::String),
            ("views_taken", ColType::String),
            ("image_adequacy", ColType::String),
            ("first_read_opinion", ColType::String),
            ("second_read_opinion", ColType::String),
            ("arbitration_outcome", ColType::String),
            ("reading_outcome", ColType::String),
            ("assessment_performed", ColType::String),
            ("assessment_modalities", ColType::Text),
            ("imaging_classification", ColType::IntegerNull),
            ("clinical_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "breast_screenings").await
    }
}
