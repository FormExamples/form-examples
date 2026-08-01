use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_conditions",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("has_diabetes", ColType::StringWithDefault(String::new())),
            ("has_atrial_fibrillation", ColType::StringWithDefault(String::new())),
            ("has_rheumatoid_arthritis", ColType::StringWithDefault(String::new())),
            ("has_chronic_kidney_disease", ColType::StringWithDefault(String::new())),
            ("has_migraine", ColType::StringWithDefault(String::new())),
            ("has_severe_mental_illness", ColType::StringWithDefault(String::new())),
            ("has_erectile_dysfunction", ColType::StringWithDefault(String::new())),
            ("on_atypical_antipsychotic", ColType::StringWithDefault(String::new())),
            ("on_corticosteroids", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_conditions").await
    }
}
