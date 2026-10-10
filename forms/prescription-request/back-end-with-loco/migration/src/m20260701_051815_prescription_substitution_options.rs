use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "prescription_substitution_options",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "allow_brand_substitution",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "allow_generic_substitution",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "allow_dosage_adjustment",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "substitution_notes",
                    ColType::TextWithDefault(String::new()),
                ),
                ("prescription_request_id", ColType::Uuid),
            ],
            &[("prescription_request", "prescription_request_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE prescription_substitution_options ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "prescription_substitution_options").await
    }
}
