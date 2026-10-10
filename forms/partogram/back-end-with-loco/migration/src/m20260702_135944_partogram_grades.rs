use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "partogram_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("progress_status", ColType::StringWithDefault(String::new())),
                ("latest_dilatation_cm", ColType::DoubleNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("partogram_id", ColType::Uuid),
            ],
            &[("partogram", "partogram_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE partogram_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "partogram_grades").await
    }
}
