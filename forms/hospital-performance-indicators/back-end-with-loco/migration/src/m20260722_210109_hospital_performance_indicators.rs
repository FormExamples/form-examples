use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "hospital_performance_indicators",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("hospital_name", ColType::StringWithDefault(String::new())),
                ("period_month", ColType::IntegerNull),
                ("period_year", ColType::IntegerNull),
                (
                    "prepared_by_name",
                    ColType::StringWithDefault(String::new()),
                ),
                ("overall_notes", ColType::TextWithDefault(String::new())),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE hospital_performance_indicators ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hospital_performance_indicators").await
    }
}
