use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "paediatric_early_warning_scores",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("observation_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                ("age_band", ColType::StringWithDefault(String::new())),
                ("respiratory_rate", ColType::IntegerNull),
                (
                    "respiratory_effort",
                    ColType::StringWithDefault(String::new()),
                ),
                ("oxygen_saturation", ColType::IntegerNull),
                (
                    "supplemental_oxygen",
                    ColType::StringWithDefault(String::new()),
                ),
                ("heart_rate", ColType::IntegerNull),
                (
                    "capillary_refill",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "consciousness_acvpu",
                    ColType::StringWithDefault(String::new()),
                ),
                ("nurse_concern", ColType::StringWithDefault(String::new())),
                ("parent_concern", ColType::StringWithDefault(String::new())),
                ("clinical_notes", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE paediatric_early_warning_scores ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "paediatric_early_warning_scores").await
    }
}
