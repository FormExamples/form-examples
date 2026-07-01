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
            ("takes_regular_medications", ColType::String),
            ("current_hrt", ColType::String),
            ("current_hrt_type", ColType::String),
            ("current_hrt_route", ColType::String),
            ("current_hrt_duration", ColType::String),
            ("previous_hrt", ColType::String),
            ("previous_hrt_details", ColType::Text),
            ("reason_for_stopping_hrt", ColType::Text),
            ("takes_herbal_supplements", ColType::String),
            ("herbal_supplement_details", ColType::Text),
            ("takes_anticoagulants", ColType::String),
            ("anticoagulant_details", ColType::Text),
            ("medication_notes", ColType::Text),
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
