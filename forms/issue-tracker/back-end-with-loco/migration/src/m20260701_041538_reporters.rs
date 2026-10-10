use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "reporters",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::StringWithDefault(String::new())),
                ("email", ColType::TextWithDefault(String::new())),
                ("phone", ColType::TextWithDefault(String::new())),
                ("role", ColType::StringWithDefault(String::new())),
                ("organisation", ColType::StringWithDefault(String::new())),
                ("team", ColType::StringWithDefault(String::new())),
                ("location", ColType::StringWithDefault(String::new())),
                ("timezone", ColType::StringWithDefault(String::new())),
                (
                    "preferred_contact",
                    ColType::StringWithDefault(String::new()),
                ),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE reporters ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "reporters").await
    }
}
