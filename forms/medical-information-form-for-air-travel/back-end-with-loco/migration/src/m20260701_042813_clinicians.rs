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
                ("name", ColType::TextWithDefault(String::new())),
                ("specialty", ColType::TextWithDefault(String::new())),
                ("role", ColType::StringWithDefault(String::new())),
                (
                    "registration_body",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "registration_number",
                    ColType::TextWithDefault(String::new()),
                ),
                ("clinic_name", ColType::TextWithDefault(String::new())),
                ("email", ColType::TextWithDefault(String::new())),
                ("phone", ColType::TextWithDefault(String::new())),
                (
                    "postal_address_as_full_text",
                    ColType::TextWithDefault(String::new()),
                ),
                ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
                ("postcode", ColType::TextWithDefault(String::new())),
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
