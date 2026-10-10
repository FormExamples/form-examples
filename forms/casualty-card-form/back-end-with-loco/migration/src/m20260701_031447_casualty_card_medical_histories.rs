use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "casualty_card_medical_histories",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "past_medical_history",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "past_surgical_history",
                    ColType::TextWithDefault(String::new()),
                ),
                ("tetanus_status", ColType::TextWithDefault(String::new())),
                ("smoking_status", ColType::TextWithDefault(String::new())),
                (
                    "alcohol_consumption",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "recreational_drug_use",
                    ColType::TextWithDefault(String::new()),
                ),
                ("last_oral_intake", ColType::TextWithDefault(String::new())),
                ("casualty_card_id", ColType::Uuid),
            ],
            &[("casualty_card", "casualty_card_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE casualty_card_medical_histories ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_medical_histories").await
    }
}
