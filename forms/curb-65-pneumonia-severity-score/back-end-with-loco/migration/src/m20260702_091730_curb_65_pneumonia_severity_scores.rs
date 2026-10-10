use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "curb_65_pneumonia_severity_scores",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("sex", ColType::StringWithDefault(String::new())),
                ("age_years", ColType::IntegerNull),
                (
                    "confusion_present",
                    ColType::StringWithDefault(String::new()),
                ),
                ("amt_score", ColType::IntegerNull),
                ("urea_measured", ColType::StringWithDefault(String::new())),
                ("urea_mmol_l", ColType::DoubleNull),
                ("respiratory_rate", ColType::IntegerNull),
                ("systolic_bp", ColType::IntegerNull),
                ("diastolic_bp", ColType::IntegerNull),
                ("oxygen_saturation", ColType::IntegerNull),
                ("temperature_c", ColType::DoubleNull),
                (
                    "significant_comorbidity",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "multilobar_changes",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "clinician_override_band",
                    ColType::StringWithDefault(String::new()),
                ),
                ("override_reason", ColType::TextWithDefault(String::new())),
                ("clinical_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE curb_65_pneumonia_severity_scores ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "curb_65_pneumonia_severity_scores").await
    }
}
