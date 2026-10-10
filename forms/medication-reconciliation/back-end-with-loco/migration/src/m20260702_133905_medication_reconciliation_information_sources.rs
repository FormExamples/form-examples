use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medication_reconciliation_information_sources",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("source_type", ColType::StringWithDefault(String::new())),
                ("verified", ColType::BooleanWithDefault(false)),
                ("medication_reconciliation_id", ColType::Uuid),
            ],
            &[("medication_reconciliation", "medication_reconciliation_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medication_reconciliation_information_sources ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliation_information_sources").await
    }
}
