use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "clinicians",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::Text),
                ("email", ColType::TextNull),
                ("phone", ColType::TextNull),
                ("postal_address_as_full_text", ColType::TextNull),
                ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
                ("postcode", ColType::TextNull),
                ("role", ColType::TextWithDefault(String::new())),
                ("registration_body", ColType::TextWithDefault(String::new())),
                (
                    "registration_number",
                    ColType::TextWithDefault(String::new()),
                ),
                ("united_kingdom_nhs_number", ColType::StringUniq),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE clinicians ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "clinicians").await
    }
}
