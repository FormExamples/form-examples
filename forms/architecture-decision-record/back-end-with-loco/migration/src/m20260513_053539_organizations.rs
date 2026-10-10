use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "organizations",
            &[
                ("id", ColType::PkUuid),
                ("name", ColType::String),
                ("legal_name", ColType::StringWithDefault(String::new())),
                ("industry", ColType::StringWithDefault(String::new())),
                ("domain", ColType::StringWithDefault(String::new())),
                ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
                ("description", ColType::TextWithDefault(String::new())),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE organizations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "organizations").await
    }
}
