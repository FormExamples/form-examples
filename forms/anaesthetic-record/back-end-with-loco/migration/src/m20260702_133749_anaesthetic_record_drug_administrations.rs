use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anaesthetic_record_drug_administrations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("drug_name", ColType::StringWithDefault(String::new())),
                ("dose", ColType::DoubleNull),
                ("dose_unit", ColType::StringWithDefault(String::new())),
                ("route", ColType::StringWithDefault(String::new())),
                ("category", ColType::StringWithDefault(String::new())),
                ("administered_at", ColType::TimestampWithTimeZoneNull),
                ("anaesthetic_record_id", ColType::Uuid),
            ],
            &[("anaesthetic_record", "anaesthetic_record_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE anaesthetic_record_drug_administrations ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_record_drug_administrations").await
    }
}
