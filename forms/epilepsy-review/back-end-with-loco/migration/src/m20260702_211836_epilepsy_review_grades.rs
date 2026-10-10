use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "epilepsy_review_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("seizure_control", ColType::StringWithDefault(String::new())),
                ("review_status", ColType::StringWithDefault(String::new())),
                ("completeness_score", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("epilepsy_review_id", ColType::Uuid),
            ],
            &[("epilepsy_review", "epilepsy_review_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE epilepsy_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "epilepsy_review_grades").await
    }
}
