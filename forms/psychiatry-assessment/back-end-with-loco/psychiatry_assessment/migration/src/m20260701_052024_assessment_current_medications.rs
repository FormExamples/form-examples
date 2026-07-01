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
            ("takes_psychiatric_medications", ColType::String),
            ("takes_other_medications", ColType::String),
            ("medication_adherence", ColType::String),
            ("adherence_barriers", ColType::Text),
            ("side_effects", ColType::Text),
            ("clozapine_registered", ColType::String),
            ("depot_injection", ColType::String),
            ("depot_details", ColType::Text),
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
