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
            
            ("reporting_clinician_role", ColType::StringWithDefault(String::new())),
            ("reported_at", ColType::TimestampWithTimeZoneNull),
            ("screening_unit", ColType::TextWithDefault(String::new())),
            ("episode_type", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::IntegerNull),
            ("last_screened_date", ColType::DateNull),
            ("higher_risk_surveillance", ColType::StringWithDefault(String::new())),
            ("symptomatic", ColType::StringWithDefault(String::new())),
            ("consent_given", ColType::StringWithDefault(String::new())),
            ("views_taken", ColType::StringWithDefault(String::new())),
            ("image_adequacy", ColType::StringWithDefault(String::new())),
            ("first_read_opinion", ColType::StringWithDefault(String::new())),
            ("second_read_opinion", ColType::StringWithDefault(String::new())),
            ("arbitration_outcome", ColType::StringWithDefault(String::new())),
            ("reading_outcome", ColType::StringWithDefault(String::new())),
            ("assessment_performed", ColType::StringWithDefault(String::new())),
            ("assessment_modalities", ColType::TextWithDefault(String::new())),
            ("imaging_classification", ColType::IntegerNull),
            ("clinical_context", ColType::TextWithDefault(String::new())),
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
