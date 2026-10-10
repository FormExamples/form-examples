use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "fluid_balance_charts",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::TextWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::TextWithDefault(String::new()),
                ),
                ("ward_or_unit", ColType::TextWithDefault(String::new())),
                ("chart_start_at", ColType::TimestampWithTimeZoneNull),
                ("chart_period_hours", ColType::DoubleNull),
                ("weight_kg", ColType::DoubleNull),
                ("clinical_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE fluid_balance_charts ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "fluid_balance_charts").await
    }
}
