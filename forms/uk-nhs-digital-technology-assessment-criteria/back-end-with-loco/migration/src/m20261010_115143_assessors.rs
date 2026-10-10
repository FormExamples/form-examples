use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessors",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::Text),
                ("email", ColType::TextNull),
                ("phone", ColType::TextNull),
                ("organisation", ColType::TextWithDefault(String::new())),
                ("role", ColType::TextWithDefault(String::new())),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE assessors ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessors").await
    }
}
