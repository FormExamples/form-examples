use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mammography_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("exam_type", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("laterality", ColType::StringWithDefault(String::new())),
            ("symptom_lump", ColType::BooleanWithDefault(false)),
            ("symptom_pain", ColType::BooleanWithDefault(false)),
            ("symptom_nipple_discharge", ColType::BooleanWithDefault(false)),
            ("symptom_skin_change", ColType::BooleanWithDefault(false)),
            ("symptom_nipple_inversion", ColType::BooleanWithDefault(false)),
            ("previous_mammogram", ColType::StringWithDefault(String::new())),
            ("previous_mammogram_date", ColType::DateNull),
            ("family_history_breast_cancer", ColType::BooleanWithDefault(false)),
            ("breast_implants", ColType::BooleanWithDefault(false)),
            ("pregnancy_or_lactating", ColType::StringWithDefault(String::new())),
            ("hormone_replacement_therapy", ColType::BooleanWithDefault(false)),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("notes", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mammography_test_requests").await
    }
}
