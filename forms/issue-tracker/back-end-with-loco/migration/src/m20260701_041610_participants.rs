use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "participants",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::StringWithDefault(String::new())),
                ("email", ColType::TextWithDefault(String::new())),
                ("phone", ColType::TextWithDefault(String::new())),
                ("role", ColType::StringWithDefault(String::new())),
                ("organisation", ColType::StringWithDefault(String::new())),
                ("team", ColType::StringWithDefault(String::new())),
                ("notify_on", ColType::StringWithDefault(String::new())),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE participants ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "participants").await
    }
}
