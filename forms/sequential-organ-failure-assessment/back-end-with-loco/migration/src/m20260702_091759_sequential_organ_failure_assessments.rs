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
            
            ("assessor_name", ColType::StringWithDefault(String::new())),
            ("assessor_role", ColType::StringWithDefault(String::new())),
            ("assessor_registration_number", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_location", ColType::StringWithDefault(String::new())),
            ("hours_since_admission", ColType::IntegerNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("admission_diagnosis", ColType::TextWithDefault(String::new())),
            ("suspected_infection", ColType::StringWithDefault(String::new())),
            ("baseline_sofa_total", ColType::IntegerNull),
            ("pao2", ColType::DoubleNull),
            ("fio2", ColType::DoubleNull),
            ("pao2_fio2_ratio", ColType::DoubleNull),
            ("respiratory_support", ColType::StringWithDefault(String::new())),
            ("platelets", ColType::DoubleNull),
            ("bilirubin", ColType::DoubleNull),
            ("map", ColType::DoubleNull),
            ("vasopressor", ColType::StringWithDefault(String::new())),
            ("vasopressor_dose", ColType::DoubleNull),
            ("glasgow_coma_scale", ColType::IntegerNull),
            ("sedated", ColType::BooleanWithDefault(false)),
            ("creatinine", ColType::DoubleNull),
            ("urine_output", ColType::IntegerNull),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
