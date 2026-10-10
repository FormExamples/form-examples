use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "nursing_care_plan_goals",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("goal_text", ColType::TextWithDefault(String::new())),
                ("target_date", ColType::DateNull),
                ("met", ColType::StringWithDefault(String::new())),
                ("nursing_care_plan_problem_id", ColType::Uuid),
            ],
            &[("nursing_care_plan_problem", "nursing_care_plan_problem_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE nursing_care_plan_goals ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "nursing_care_plan_goals").await
    }
}
