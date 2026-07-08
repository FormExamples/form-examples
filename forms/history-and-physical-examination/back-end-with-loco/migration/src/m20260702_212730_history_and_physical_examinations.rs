use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "history_and_physical_examinations",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clerked_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_role", ColType::String),
            ("registration_number", ColType::String),
            ("care_setting", ColType::String),
            ("admission_source", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("presenting_complaint", ColType::Text),
            ("history_of_presenting_complaint", ColType::Text),
            ("past_medical_surgical_history", ColType::Text),
            ("drug_history", ColType::Text),
            ("allergy_status", ColType::String),
            ("allergy_detail", ColType::Text),
            ("family_history", ColType::Text),
            ("social_history", ColType::Text),
            ("systems_review", ColType::Text),
            ("temperature", ColType::DoubleNull),
            ("heart_rate", ColType::IntegerNull),
            ("respiratory_rate", ColType::IntegerNull),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("oxygen_saturation", ColType::IntegerNull),
            ("consciousness_level", ColType::String),
            ("exam_cardiovascular", ColType::Text),
            ("exam_respiratory", ColType::Text),
            ("exam_abdominal", ColType::Text),
            ("exam_neurological", ColType::Text),
            ("exam_other", ColType::Text),
            ("investigations", ColType::Text),
            ("impression", ColType::Text),
            ("red_flag_findings", ColType::Text),
            ("management_plan", ColType::Text),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "history_and_physical_examinations").await
    }
}
