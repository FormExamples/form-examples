use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anion_gap_calculators",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("calculated_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                ("clinical_context", ColType::TextWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age_band", ColType::StringWithDefault(String::new())),
                ("sex", ColType::StringWithDefault(String::new())),
                ("sodium_mmol_l", ColType::DoubleNull),
                ("potassium_mmol_l", ColType::DoubleNull),
                ("chloride_mmol_l", ColType::DoubleNull),
                ("bicarbonate_mmol_l", ColType::DoubleNull),
                ("albumin_g_l", ColType::DoubleNull),
                (
                    "include_potassium",
                    ColType::StringWithDefault(String::new()),
                ),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician", "clinician_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE anion_gap_calculators ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anion_gap_calculators").await
    }
}
