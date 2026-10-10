use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "cervical_screening_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("result_class", ColType::StringWithDefault(String::new())),
                (
                    "management_action",
                    ColType::StringWithDefault(String::new()),
                ),
                ("status", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("cervical_screening_id", ColType::Uuid),
            ],
            &[("cervical_screening", "cervical_screening_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE cervical_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cervical_screening_grades").await
    }
}
