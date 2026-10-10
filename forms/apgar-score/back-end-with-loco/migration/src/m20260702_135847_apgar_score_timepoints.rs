use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "apgar_score_timepoints",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("timepoint_minutes", ColType::IntegerNull),
                ("appearance", ColType::StringWithDefault(String::new())),
                ("pulse", ColType::StringWithDefault(String::new())),
                ("grimace", ColType::StringWithDefault(String::new())),
                ("activity", ColType::StringWithDefault(String::new())),
                ("respiration", ColType::StringWithDefault(String::new())),
                ("total", ColType::IntegerNull),
                ("band", ColType::StringWithDefault(String::new())),
                ("apgar_score_id", ColType::Uuid),
            ],
            &[("apgar_score", "apgar_score_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE apgar_score_timepoints ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "apgar_score_timepoints").await
    }
}
