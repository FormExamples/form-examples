use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "heart_failure_review_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("nyha_status", ColType::StringWithDefault(String::new())),
                (
                    "medication_optimisation_status",
                    ColType::StringWithDefault(String::new()),
                ),
                ("review_status", ColType::StringWithDefault(String::new())),
                ("indicated_pillars", ColType::IntegerNull),
                ("prescribed_pillars", ColType::IntegerNull),
                ("missing_pillars", ColType::StringWithDefault(String::new())),
                ("completeness_score", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("heart_failure_review_id", ColType::Uuid),
            ],
            &[("heart_failure_review", "heart_failure_review_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE heart_failure_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "heart_failure_review_grades").await
    }
}
