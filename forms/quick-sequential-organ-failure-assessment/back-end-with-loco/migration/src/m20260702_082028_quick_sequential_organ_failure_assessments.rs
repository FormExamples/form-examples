use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "quick_sequential_organ_failure_assessments",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                ("suspected_source", ColType::TextWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age_band", ColType::StringWithDefault(String::new())),
                ("sex", ColType::StringWithDefault(String::new())),
                ("respiratory_rate", ColType::DoubleNull),
                ("glasgow_coma_scale", ColType::IntegerNull),
                (
                    "mentation_altered",
                    ColType::StringWithDefault(String::new()),
                ),
                ("systolic_blood_pressure", ColType::DoubleNull),
                ("clinical_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE quick_sequential_organ_failure_assessments ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "quick_sequential_organ_failure_assessments").await
    }
}
