use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "learning_disability_annual_health_check_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("completeness_percent", ColType::IntegerNull),
                (
                    "health_action_plan_complete",
                    ColType::StringWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("learning_disability_annual_health_check_id", ColType::Uuid),
            ],
            &[(
                "learning_disability_annual_health_check",
                "learning_disability_annual_health_check_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE learning_disability_annual_health_check_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "learning_disability_annual_health_check_grades").await
    }
}
