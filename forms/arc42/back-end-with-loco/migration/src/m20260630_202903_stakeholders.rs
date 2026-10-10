use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "stakeholders",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("ordinal", ColType::IntegerWithDefault(0)),
                ("name", ColType::TextWithDefault(String::new())),
                ("role", ColType::TextWithDefault(String::new())),
                ("concerns", ColType::TextWithDefault(String::new())),
                ("arc42_documentation_id", ColType::Uuid),
            ],
            &[("arc42_documentation", "arc42_documentation_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE stakeholders ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "stakeholders").await
    }
}
