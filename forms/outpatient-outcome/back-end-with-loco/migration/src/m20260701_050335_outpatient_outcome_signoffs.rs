use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "outpatient_outcome_signoffs",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "reporting_clinician_name",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "reporting_clinician_role",
                    ColType::StringWithDefault(String::new()),
                ),
                ("signed_off_at", ColType::TimestampWithTimeZoneNull),
                ("outpatient_outcome_id", ColType::Uuid),
                ("reporting_clinician_id", ColType::UuidNull),
            ],
            &[
                ("outpatient_outcome", "outpatient_outcome_id"),
                ("clinician", "reporting_clinician_id"),
            ],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE outpatient_outcome_signoffs ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_signoffs").await
    }
}
