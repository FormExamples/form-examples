use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "action_items",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("position", ColType::IntegerWithDefault(0)),
                ("title", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                ("owner_name", ColType::StringWithDefault(String::new())),
                ("owner_email", ColType::StringWithDefault(String::new())),
                ("due_date", ColType::DateNull),
                ("priority", ColType::StringWithDefault(String::new())),
                ("status", ColType::StringWithDefault("open".to_string())),
                ("completed_at", ColType::TimestampWithTimeZoneNull),
                (
                    "external_reference",
                    ColType::StringWithDefault(String::new()),
                ),
                ("meeting_id", ColType::Uuid),
            ],
            &[("meeting", "meeting_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE action_items ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "action_items").await
    }
}
