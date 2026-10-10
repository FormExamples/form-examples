use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "practitioners",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::String),
                ("email", ColType::TextNull),
                ("phone", ColType::TextNull),
                ("role", ColType::StringWithDefault(String::new())),
                (
                    "registration_body",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "registration_number",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "organisation_name",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "organisation_ods_code",
                    ColType::StringWithDefault(String::new()),
                ),
                ("site_name", ColType::StringWithDefault(String::new())),
                ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE practitioners ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "practitioners").await
    }
}
