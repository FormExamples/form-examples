use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "hospital_daily_monitoring_checklist_items",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("item_code", ColType::String),
                ("section_number", ColType::Integer),
                ("section_title", ColType::StringWithDefault(String::new())),
                ("item_text", ColType::TextWithDefault(String::new())),
                ("status", ColType::StringWithDefault(String::new())),
                ("remarks", ColType::TextWithDefault(String::new())),
                ("hospital_daily_monitoring_checklist_id", ColType::Uuid),
            ],
            &[(
                "hospital_daily_monitoring_checklist",
                "hospital_daily_monitoring_checklist_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE hospital_daily_monitoring_checklist_items ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hospital_daily_monitoring_checklist_items").await
    }
}
