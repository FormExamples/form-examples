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
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("registration_number", ColType::StringWithDefault(String::new())),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("admission_source", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("presenting_complaint", ColType::TextWithDefault(String::new())),
            ("history_of_presenting_complaint", ColType::TextWithDefault(String::new())),
            ("past_medical_surgical_history", ColType::TextWithDefault(String::new())),
            ("drug_history", ColType::TextWithDefault(String::new())),
            ("allergy_status", ColType::StringWithDefault(String::new())),
            ("allergy_detail", ColType::TextWithDefault(String::new())),
            ("family_history", ColType::TextWithDefault(String::new())),
            ("social_history", ColType::TextWithDefault(String::new())),
            ("systems_review", ColType::TextWithDefault(String::new())),
            ("temperature", ColType::DoubleNull),
            ("heart_rate", ColType::IntegerNull),
            ("respiratory_rate", ColType::IntegerNull),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("oxygen_saturation", ColType::IntegerNull),
            ("consciousness_level", ColType::StringWithDefault(String::new())),
            ("exam_cardiovascular", ColType::TextWithDefault(String::new())),
            ("exam_respiratory", ColType::TextWithDefault(String::new())),
            ("exam_abdominal", ColType::TextWithDefault(String::new())),
            ("exam_neurological", ColType::TextWithDefault(String::new())),
            ("exam_other", ColType::TextWithDefault(String::new())),
            ("investigations", ColType::TextWithDefault(String::new())),
            ("impression", ColType::TextWithDefault(String::new())),
            ("red_flag_findings", ColType::TextWithDefault(String::new())),
            ("management_plan", ColType::TextWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
