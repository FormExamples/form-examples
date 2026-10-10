use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "people",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("title", ColType::TextWithDefault(String::new())),
                ("first_names", ColType::TextWithDefault(String::new())),
                ("last_name", ColType::TextWithDefault(String::new())),
                ("other_names", ColType::TextWithDefault(String::new())),
                ("date_of_birth", ColType::DateNull),
                ("email", ColType::TextWithDefault(String::new())),
                ("phone", ColType::TextWithDefault(String::new())),
                ("address_id", ColType::UuidNull),
                ("is_trust_corporation", ColType::BooleanWithDefault(false)),
                (
                    "trust_corporation_number",
                    ColType::TextWithDefault(String::new()),
                ),
                ("is_bankrupt", ColType::BooleanWithDefault(false)),
                ("has_debt_relief_order", ColType::BooleanWithDefault(false)),
            ],
            &[],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE people ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "people").await
    }
}
