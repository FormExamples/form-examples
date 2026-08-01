use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cardiac_stress_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("symptom_chest_pain", ColType::BooleanWithDefault(false)),
            ("symptom_breathlessness", ColType::BooleanWithDefault(false)),
            ("symptom_palpitations", ColType::BooleanWithDefault(false)),
            ("able_to_exercise", ColType::BooleanWithDefault(false)),
            ("resting_ecg_findings", ColType::StringWithDefault(String::new())),
            ("known_coronary_artery_disease", ColType::BooleanWithDefault(false)),
            ("recent_acute_coronary_syndrome", ColType::BooleanWithDefault(false)),
            ("aortic_stenosis", ColType::StringWithDefault(String::new())),
            ("uncontrolled_hypertension", ColType::BooleanWithDefault(false)),
            ("beta_blocker", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "cardiac_stress_test_requests").await
    }
}
