use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_consulting_scorecard_for_hiring_help_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("score_total", ColType::IntegerNull),
            ("manifesto_subtotal", ColType::IntegerNull),
            ("principles_subtotal", ColType::IntegerNull),
            ("computed_band", ColType::String),
            ("final_band", ColType::String),
            ("override_reason", ColType::String),
            ("recommendation", ColType::String),
            ("recommended_focus_areas", ColType::Text),
            ("review_notes", ColType::Text),
            ("signed_by", ColType::String),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("agile_consulting_scorecard", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_consulting_scorecard_for_hiring_help_grades").await
    }
}
