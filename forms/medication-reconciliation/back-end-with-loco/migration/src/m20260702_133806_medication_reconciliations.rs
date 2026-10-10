use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medication_reconciliations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "reconciliation_type",
                    ColType::StringWithDefault(String::new()),
                ),
                ("care_setting", ColType::StringWithDefault(String::new())),
                ("reconciled_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::TextWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::TextWithDefault(String::new()),
                ),
                ("age_band", ColType::StringWithDefault(String::new())),
                ("sex", ColType::StringWithDefault(String::new())),
                ("weight_kg", ColType::DoubleNull),
                ("allergy_status", ColType::StringWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medication_reconciliations ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medication_reconciliations").await
    }
}
