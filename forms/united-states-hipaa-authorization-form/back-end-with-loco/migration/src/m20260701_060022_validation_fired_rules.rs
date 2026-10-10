use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "validation_fired_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("citation", ColType::StringWithDefault(String::new())),
                ("domain", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                ("priority", ColType::StringWithDefault("medium".to_string())),
                ("validation_result_id", ColType::Uuid),
            ],
            &[("validation_result", "validation_result_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE validation_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "validation_fired_rules").await
    }
}
