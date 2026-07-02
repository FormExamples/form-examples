use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "four_a_test_for_delirium_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("item1_score", ColType::IntegerNull),
            ("item2_score", ColType::IntegerNull),
            ("item3_score", ColType::IntegerNull),
            ("item4_score", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("interpretation", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("four_a_test_for_delirium", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "four_a_test_for_delirium_grades").await
    }
}
