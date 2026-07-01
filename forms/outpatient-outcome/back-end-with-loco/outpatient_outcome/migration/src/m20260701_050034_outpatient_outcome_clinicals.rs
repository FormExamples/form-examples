use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "outpatient_outcome_clinicals",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("presenting_complaint", ColType::Text),
            ("diagnosis", ColType::Text),
            ("treatment_delivered", ColType::Text),
            ("outcome_classification", ColType::String),
            ],
            &[
            ("outpatient_outcome", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_clinicals").await
    }
}
