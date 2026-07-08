use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cage_alcohol_questionnaire_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("cut_down_point", ColType::IntegerNull),
            ("annoyed_point", ColType::IntegerNull),
            ("guilty_point", ColType::IntegerNull),
            ("eye_opener_point", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("interpretation", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("cage_alcohol_questionnaire", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cage_alcohol_questionnaire_grades").await
    }
}
