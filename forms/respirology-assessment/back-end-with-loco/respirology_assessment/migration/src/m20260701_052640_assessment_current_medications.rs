use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_current_medications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("takes_respiratory_medications", ColType::String),
            ("inhaler_use", ColType::String),
            ("inhaler_technique_assessed", ColType::String),
            ("inhaler_technique_adequate", ColType::String),
            ("long_term_oxygen_therapy", ColType::String),
            ("nebuliser_use", ColType::String),
            ("takes_other_medications", ColType::String),
            ("medication_adherence", ColType::String),
            ("adverse_drug_reactions", ColType::Text),
            ("additional_notes", ColType::Text),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_current_medications").await
    }
}
