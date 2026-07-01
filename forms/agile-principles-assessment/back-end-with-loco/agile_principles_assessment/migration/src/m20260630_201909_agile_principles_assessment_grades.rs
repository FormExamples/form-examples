use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_principles_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("answered_count", ColType::Integer),
            ("mean_score", ColType::DoubleNull),
            ("weighted_mean_score", ColType::DoubleNull),
            ("weights_customised", ColType::Boolean),
            ("maturity", ColType::String),
            ("top_action_1", ColType::String),
            ("top_action_2", ColType::String),
            ("top_action_3", ColType::String),
            ("coach_notes", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("agile_principles_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_principles_assessment_grades").await
    }
}
