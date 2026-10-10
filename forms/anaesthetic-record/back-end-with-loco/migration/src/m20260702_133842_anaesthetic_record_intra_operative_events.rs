use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anaesthetic_record_intra_operative_events",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("event_type", ColType::StringWithDefault(String::new())),
                ("occurred_at", ColType::TimestampWithTimeZoneNull),
                ("management", ColType::TextWithDefault(String::new())),
                ("anaesthetic_record_id", ColType::Uuid),
            ],
            &[("anaesthetic_record", "anaesthetic_record_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE anaesthetic_record_intra_operative_events ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_record_intra_operative_events").await
    }
}
