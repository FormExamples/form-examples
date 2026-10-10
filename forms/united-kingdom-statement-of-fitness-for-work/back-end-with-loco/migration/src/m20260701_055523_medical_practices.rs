use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_practices",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::Text),
                (
                    "postal_address_as_full_text",
                    ColType::TextWithDefault(String::new()),
                ),
                ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
                ("postcode", ColType::TextNull),
                ("phone", ColType::TextNull),
                ("email", ColType::TextNull),
                ("ods_code", ColType::TextNull),
                ("setting", ColType::TextWithDefault(String::new())),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE medical_practices ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_practices").await
    }
}
