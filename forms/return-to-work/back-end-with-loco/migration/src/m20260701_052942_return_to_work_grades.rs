use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "return_to_work_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "fitness_statement",
                    ColType::StringWithDefault("not-fit".to_string()),
                ),
                (
                    "restriction_priority",
                    ColType::StringWithDefault("routine".to_string()),
                ),
                ("rule_count", ColType::IntegerWithDefault(0)),
                ("flag_count", ColType::IntegerWithDefault(0)),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("return_to_work_id", ColType::Uuid),
            ],
            &[("return_to_work", "return_to_work_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE return_to_work_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_work_grades").await
    }
}
