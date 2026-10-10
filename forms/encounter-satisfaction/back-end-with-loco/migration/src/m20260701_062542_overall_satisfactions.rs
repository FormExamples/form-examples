use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "overall_satisfactions",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("overall_rating", ColType::IntegerNull),
                ("likely_to_recommend", ColType::IntegerNull),
                ("likely_to_return", ColType::IntegerNull),
                ("comments", ColType::TextWithDefault(String::new())),
                ("encounter_satisfaction_id", ColType::Uuid),
            ],
            &[("encounter_satisfaction", "encounter_satisfaction_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE overall_satisfactions ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "overall_satisfactions").await
    }
}
