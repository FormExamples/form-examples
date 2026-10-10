use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "patients",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::StringWithDefault(String::new())),
                ("birth_date", ColType::DateNull),
                (
                    "social_security_number",
                    ColType::StringWithDefault(String::new()),
                ),
                ("street_address", ColType::TextWithDefault(String::new())),
                ("city", ColType::StringWithDefault(String::new())),
                ("state", ColType::StringWithDefault(String::new())),
                ("zip_code", ColType::StringWithDefault(String::new())),
                ("phone", ColType::StringWithDefault(String::new())),
                ("email", ColType::StringWithDefault(String::new())),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patients").await
    }
}
