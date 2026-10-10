use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "cha2ds2_vascs",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                (
                    "atrial_fibrillation_type",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age_years", ColType::IntegerNull),
                ("sex", ColType::StringWithDefault(String::new())),
                (
                    "congestive_heart_failure",
                    ColType::StringWithDefault(String::new()),
                ),
                ("hypertension", ColType::StringWithDefault(String::new())),
                ("diabetes", ColType::StringWithDefault(String::new())),
                (
                    "stroke_tia_thromboembolism",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "vascular_disease",
                    ColType::StringWithDefault(String::new()),
                ),
                ("clinical_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE cha2ds2_vascs ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cha2ds2_vascs").await
    }
}
