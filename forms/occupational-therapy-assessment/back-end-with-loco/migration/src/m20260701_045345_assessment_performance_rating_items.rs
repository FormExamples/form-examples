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
            ("occupational_issue", ColType::StringWithDefault(String::new())),
            ("domain", ColType::StringWithDefault(String::new())),
            ("importance_score", ColType::IntegerNull),
            ("performance_score", ColType::IntegerNull),
            ("sort_order", ColType::IntegerWithDefault(0)),
            ],
            &[
            ("assessment_performance_ratings", "performance_ratings_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_performance_rating_items").await
    }
}
