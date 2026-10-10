use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "authorization_periods",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("start_date", ColType::Date),
                ("end_date", ColType::Date),
                ("single_use", ColType::StringWithDefault(String::new())),
                ("release_form_id", ColType::Uuid),
            ],
            &[("release_form", "release_form_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE authorization_periods ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "authorization_periods").await
    }
}
