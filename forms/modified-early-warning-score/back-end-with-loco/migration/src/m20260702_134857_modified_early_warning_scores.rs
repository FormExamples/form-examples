use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "modified_early_warning_scores",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("observation_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                (
                    "ward_or_location",
                    ColType::StringWithDefault(String::new()),
                ),
                ("systolic_blood_pressure", ColType::IntegerNull),
                ("heart_rate", ColType::IntegerNull),
                ("respiratory_rate", ColType::IntegerNull),
                ("temperature", ColType::DoubleNull),
                (
                    "consciousness_avpu",
                    ColType::StringWithDefault(String::new()),
                ),
                ("previous_mews_score", ColType::IntegerNull),
                ("clinical_notes", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE modified_early_warning_scores ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "modified_early_warning_scores").await
    }
}
