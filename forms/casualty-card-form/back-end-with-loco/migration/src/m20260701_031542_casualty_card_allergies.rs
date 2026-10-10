use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "casualty_card_allergies",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("allergen", ColType::TextWithDefault(String::new())),
                ("reaction", ColType::TextWithDefault(String::new())),
                ("severity", ColType::TextWithDefault(String::new())),
                ("sort_order", ColType::IntegerWithDefault(0)),
                ("casualty_card_id", ColType::Uuid),
            ],
            &[("casualty_card", "casualty_card_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE casualty_card_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_allergies").await
    }
}
