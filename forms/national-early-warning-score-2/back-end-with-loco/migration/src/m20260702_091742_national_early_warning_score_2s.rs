use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "national_early_warning_score_2s",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("observation_at", ColType::TimestampWithTimeZoneNull),
                (
                    "ward_or_location",
                    ColType::StringWithDefault(String::new()),
                ),
                ("spo2_scale", ColType::StringWithDefault(String::new())),
                (
                    "spo2_scale2_endorsed",
                    ColType::StringWithDefault(String::new()),
                ),
                ("respiratory_rate", ColType::IntegerNull),
                ("spo2", ColType::IntegerNull),
                ("on_oxygen", ColType::StringWithDefault(String::new())),
                ("oxygen_device", ColType::StringWithDefault(String::new())),
                ("oxygen_flow_rate_l_min", ColType::DoubleNull),
                ("inspired_oxygen_fraction_percent", ColType::IntegerNull),
                ("systolic_blood_pressure", ColType::IntegerNull),
                ("pulse", ColType::IntegerNull),
                (
                    "consciousness_acvpu",
                    ColType::StringWithDefault(String::new()),
                ),
                ("temperature", ColType::DoubleNull),
                ("is_under_16", ColType::StringWithDefault(String::new())),
                ("is_pregnant", ColType::StringWithDefault(String::new())),
                (
                    "has_spinal_cord_injury",
                    ColType::StringWithDefault(String::new()),
                ),
                ("clinical_notes", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE national_early_warning_score_2s ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "national_early_warning_score_2s").await
    }
}
