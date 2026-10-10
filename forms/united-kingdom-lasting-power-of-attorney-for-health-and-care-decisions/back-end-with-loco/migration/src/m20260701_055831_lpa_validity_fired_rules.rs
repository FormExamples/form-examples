use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lpa_validity_fired_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("severity", ColType::StringWithDefault(String::new())),
                ("rule_family", ColType::StringWithDefault(String::new())),
                ("source_citation", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                (
                    "suggested_correction",
                    ColType::TextWithDefault(String::new()),
                ),
                ("lpa_validity_id", ColType::Uuid),
            ],
            &[("lpa_validities", "lpa_validity_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE lpa_validity_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_validity_fired_rules").await
    }
}
