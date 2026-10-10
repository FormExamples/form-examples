use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "recurring_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("frequency", ColType::StringWithDefault("none".to_string())),
                ("interval_count", ColType::IntegerWithDefault(1)),
                ("by_day_of_week", ColType::StringWithDefault(String::new())),
                ("by_day_of_month", ColType::IntegerNull),
                ("by_set_position", ColType::IntegerNull),
                ("by_month_of_year", ColType::IntegerNull),
                ("series_count", ColType::IntegerNull),
                ("series_until", ColType::TimestampWithTimeZoneNull),
                ("timezone", ColType::StringWithDefault(String::new())),
                ("rrule_text", ColType::StringWithDefault(String::new())),
                ("meeting_id", ColType::Uuid),
            ],
            &[("meeting", "meeting_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE recurring_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "recurring_rules").await
    }
}
