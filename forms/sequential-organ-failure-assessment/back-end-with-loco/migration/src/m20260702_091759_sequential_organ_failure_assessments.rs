use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "sequential_organ_failure_assessments",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("assessor_name", ColType::String),
            ("assessor_role", ColType::String),
            ("assessor_registration_number", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_location", ColType::String),
            ("hours_since_admission", ColType::IntegerNull),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("admission_diagnosis", ColType::Text),
            ("suspected_infection", ColType::String),
            ("baseline_sofa_total", ColType::IntegerNull),
            ("pao2", ColType::DoubleNull),
            ("fio2", ColType::DoubleNull),
            ("pao2_fio2_ratio", ColType::DoubleNull),
            ("respiratory_support", ColType::String),
            ("platelets", ColType::DoubleNull),
            ("bilirubin", ColType::DoubleNull),
            ("map", ColType::DoubleNull),
            ("vasopressor", ColType::String),
            ("vasopressor_dose", ColType::DoubleNull),
            ("glasgow_coma_scale", ColType::IntegerNull),
            ("sedated", ColType::Boolean),
            ("creatinine", ColType::DoubleNull),
            ("urine_output", ColType::IntegerNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "sequential_organ_failure_assessments").await
    }
}
