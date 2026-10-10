use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medication_reconciliation_discrepancies",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "discrepancy_type",
                    ColType::StringWithDefault(String::new()),
                ),
                ("bpmh_item_ref", ColType::TextWithDefault(String::new())),
                (
                    "inpatient_item_ref",
                    ColType::TextWithDefault(String::new()),
                ),
                ("intended_action", ColType::StringWithDefault(String::new())),
                ("rationale", ColType::TextWithDefault(String::new())),
                ("intentional", ColType::BooleanWithDefault(false)),
                ("medication_reconciliation_id", ColType::Uuid),
            ],
            &[("medication_reconciliation", "medication_reconciliation_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medication_reconciliation_discrepancies ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliation_discrepancies").await
    }
}
