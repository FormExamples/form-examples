use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "fluid_balance_chart_entries",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("entry_at", ColType::TimestampWithTimeZoneNull),
                ("direction", ColType::StringWithDefault(String::new())),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                ("volume_ml", ColType::DoubleNull),
                ("fluid_balance_chart_id", ColType::Uuid),
            ],
            &[("fluid_balance_chart", "fluid_balance_chart_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE fluid_balance_chart_entries ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "fluid_balance_chart_entries").await
    }
}
