use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_performance_rating_items",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("occupational_issue", ColType::String),
            ("domain", ColType::String),
            ("importance_score", ColType::IntegerNull),
            ("performance_score", ColType::IntegerNull),
            ("sort_order", ColType::Integer),
            ],
            &[
            ("performance_ratings", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_performance_rating_items").await
    }
}
