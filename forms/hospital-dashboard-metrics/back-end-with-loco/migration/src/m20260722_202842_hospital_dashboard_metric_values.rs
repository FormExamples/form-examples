use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "hospital_dashboard_metric_values",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("metric_code", ColType::String),
                ("category_number", ColType::Integer),
                ("category_title", ColType::StringWithDefault(String::new())),
                ("metric_text", ColType::TextWithDefault(String::new())),
                ("metric_value", ColType::DoubleNull),
                ("notes", ColType::TextWithDefault(String::new())),
                ("hospital_dashboard_metrics_id", ColType::Uuid),
            ],
            &[(
                "hospital_dashboard_metrics",
                "hospital_dashboard_metrics_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE hospital_dashboard_metric_values ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hospital_dashboard_metric_values").await
    }
}
