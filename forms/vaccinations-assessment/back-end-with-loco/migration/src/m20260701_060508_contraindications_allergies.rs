use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "contraindications_allergies",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("egg_allergy", ColType::String),
            ("gelatin_allergy", ColType::String),
            ("latex_allergy", ColType::String),
            ("neomycin_allergy", ColType::String),
            ("pregnant", ColType::String),
            ("pregnancy_weeks", ColType::String),
            ("severe_illness", ColType::String),
            ("previous_anaphylaxis", ColType::String),
            ("anaphylaxis_details", ColType::Text),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "contraindications_allergies").await
    }
}
