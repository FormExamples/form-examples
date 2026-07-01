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
            ("has_diabetes", ColType::String),
            ("has_atrial_fibrillation", ColType::String),
            ("has_rheumatoid_arthritis", ColType::String),
            ("has_chronic_kidney_disease", ColType::String),
            ("has_migraine", ColType::String),
            ("has_severe_mental_illness", ColType::String),
            ("has_erectile_dysfunction", ColType::String),
            ("on_atypical_antipsychotic", ColType::String),
            ("on_corticosteroids", ColType::String),
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
