use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "news2_results",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("total_score", ColType::Integer),
                ("clinical_response", ColType::TextWithDefault(String::new())),
                ("has_any_single_score_3", ColType::BooleanWithDefault(false)),
                ("supplemental_oxygen", ColType::String),
                ("scored_at", ColType::TimestampWithTimeZone),
                ("casualty_card_id", ColType::Uuid),
            ],
            &[("casualty_card", "casualty_card_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE news2_results ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "news2_results").await
    }
}
