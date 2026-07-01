use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_presenting_complaints",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("chief_complaint", ColType::Text),
            ("history_of_presenting_complaint", ColType::Text),
            ("onset", ColType::Text),
            ("duration", ColType::Text),
            ("character", ColType::Text),
            ("severity", ColType::Text),
            ("location", ColType::Text),
            ("radiation", ColType::Text),
            ("aggravating_factors", ColType::Text),
            ("relieving_factors", ColType::Text),
            ("associated_symptoms", ColType::Text),
            ("previous_episodes", ColType::Text),
            ("treatment_prior_to_arrival", ColType::Text),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_presenting_complaints").await
    }
}
