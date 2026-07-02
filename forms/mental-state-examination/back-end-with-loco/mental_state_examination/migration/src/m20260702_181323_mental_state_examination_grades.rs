use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mental_state_examination_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("risk_level", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("appearance_behaviour_documented", ColType::String),
            ("speech_documented", ColType::String),
            ("emotion_documented", ColType::String),
            ("perception_documented", ColType::String),
            ("thought_documented", ColType::String),
            ("insight_documented", ColType::String),
            ("cognition_documented", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("mental_state_examination", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mental_state_examination_grades").await
    }
}
