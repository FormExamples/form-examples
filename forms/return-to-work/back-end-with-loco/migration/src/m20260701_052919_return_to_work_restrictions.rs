use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "return_to_work_restrictions",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("kind", ColType::StringWithDefault(String::new())),
                ("severity", ColType::StringWithDefault(String::new())),
                (
                    "quantitative_limit",
                    ColType::StringWithDefault(String::new()),
                ),
                ("notes", ColType::StringWithDefault(String::new())),
                ("start_date", ColType::DateNull),
                ("end_date", ColType::DateNull),
                ("priority_rank", ColType::IntegerWithDefault(0)),
                ("return_to_work_id", ColType::Uuid),
            ],
            &[("return_to_work", "return_to_work_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE return_to_work_restrictions ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_work_restrictions").await
    }
}
