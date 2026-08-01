use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "allergy_skin_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("allergen_aeroallergens", ColType::BooleanWithDefault(false)),
            ("allergen_food", ColType::BooleanWithDefault(false)),
            ("allergen_drug", ColType::BooleanWithDefault(false)),
            ("allergen_venom", ColType::BooleanWithDefault(false)),
            ("allergen_latex", ColType::BooleanWithDefault(false)),
            ("allergen_contact", ColType::BooleanWithDefault(false)),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("previous_anaphylaxis", ColType::BooleanWithDefault(false)),
            ("on_antihistamines", ColType::BooleanWithDefault(false)),
            ("on_beta_blocker", ColType::BooleanWithDefault(false)),
            ("current_skin_disease", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "allergy_skin_test_requests").await
    }
}
