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
            ("chief_complaint", ColType::TextWithDefault(String::new())),
            ("history_of_presenting_complaint", ColType::TextWithDefault(String::new())),
            ("onset", ColType::TextWithDefault(String::new())),
            ("duration", ColType::TextWithDefault(String::new())),
            ("character", ColType::TextWithDefault(String::new())),
            ("severity", ColType::TextWithDefault(String::new())),
            ("location", ColType::TextWithDefault(String::new())),
            ("radiation", ColType::TextWithDefault(String::new())),
            ("aggravating_factors", ColType::TextWithDefault(String::new())),
            ("relieving_factors", ColType::TextWithDefault(String::new())),
            ("associated_symptoms", ColType::TextWithDefault(String::new())),
            ("previous_episodes", ColType::TextWithDefault(String::new())),
            ("treatment_prior_to_arrival", ColType::TextWithDefault(String::new())),
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
