use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "suppliers",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::Text),
                ("trading_name", ColType::TextWithDefault(String::new())),
                (
                    "company_registration_number",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "country_of_registration_as_iso_3166_1_alpha_2",
                    ColType::StringNull,
                ),
                (
                    "ico_registration_number",
                    ColType::TextWithDefault(String::new()),
                ),
                ("website", ColType::TextWithDefault(String::new())),
                ("postal_address_as_full_text", ColType::TextNull),
                ("postcode", ColType::TextNull),
                ("contact_name", ColType::TextWithDefault(String::new())),
                ("contact_email", ColType::TextNull),
                ("contact_phone", ColType::TextNull),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE suppliers ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "suppliers").await
    }
}
