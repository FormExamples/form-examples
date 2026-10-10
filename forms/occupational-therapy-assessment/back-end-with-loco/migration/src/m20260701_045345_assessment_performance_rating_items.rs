use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_performance_rating_items",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "occupational_issue",
                    ColType::StringWithDefault(String::new()),
                ),
                ("domain", ColType::StringWithDefault(String::new())),
                ("importance_score", ColType::IntegerNull),
                ("performance_score", ColType::IntegerNull),
                ("sort_order", ColType::IntegerWithDefault(0)),
                ("performance_ratings_id", ColType::Uuid),
            ],
            &[("assessment_performance_ratings", "performance_ratings_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_performance_rating_items ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_performance_rating_items").await
    }
}
