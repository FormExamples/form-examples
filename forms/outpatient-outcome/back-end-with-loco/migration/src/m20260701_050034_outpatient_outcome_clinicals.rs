use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "outpatient_outcome_clinicals",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "presenting_complaint",
                    ColType::TextWithDefault(String::new()),
                ),
                ("diagnosis", ColType::TextWithDefault(String::new())),
                (
                    "treatment_delivered",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "outcome_classification",
                    ColType::StringWithDefault(String::new()),
                ),
                ("outpatient_outcome_id", ColType::Uuid),
            ],
            &[("outpatient_outcome", "outpatient_outcome_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE outpatient_outcome_clinicals ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_clinicals").await
    }
}
