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
                ("name", ColType::String),
                ("birth_date", ColType::DateNull),
                ("sex", ColType::StringWithDefault(String::new())),
                ("identifier_type", ColType::StringWithDefault(String::new())),
                (
                    "identifier_value",
                    ColType::StringWithDefault(String::new()),
                ),
                ("email", ColType::TextNull),
                ("phone", ColType::TextNull),
                (
                    "emergency_contact_name",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "emergency_contact_relationship",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "emergency_contact_phone",
                    ColType::StringWithDefault(String::new()),
                ),
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
