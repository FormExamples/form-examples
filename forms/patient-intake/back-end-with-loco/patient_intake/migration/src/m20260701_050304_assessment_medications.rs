use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_medications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("takes_medications", ColType::String),
            ("takes_over_the_counter", ColType::String),
            ("takes_supplements", ColType::String),
            ("supplement_details", ColType::Text),
            ("medication_adherence", ColType::String),
            ("pharmacy_name", ColType::String),
            ("pharmacy_phone", ColType::String),
            ("medications_notes", ColType::Text),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_medications").await
    }
}
