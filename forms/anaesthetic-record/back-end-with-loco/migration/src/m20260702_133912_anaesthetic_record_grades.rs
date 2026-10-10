use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anaesthetic_record_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("completeness_percent", ColType::IntegerWithDefault(0)),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("anaesthetic_record_id", ColType::Uuid),
            ],
            &[("anaesthetic_record", "anaesthetic_record_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE anaesthetic_record_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_record_grades").await
    }
}
