use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "four_a_test_for_delirium_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("item1_score", ColType::IntegerNull),
                ("item2_score", ColType::IntegerNull),
                ("item3_score", ColType::IntegerNull),
                ("item4_score", ColType::IntegerNull),
                ("total_score", ColType::IntegerNull),
                ("interpretation", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("four_a_test_for_delirium_id", ColType::Uuid),
            ],
            &[("four_a_test_for_delirium", "four_a_test_for_delirium_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE four_a_test_for_delirium_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "four_a_test_for_delirium_grades").await
    }
}
