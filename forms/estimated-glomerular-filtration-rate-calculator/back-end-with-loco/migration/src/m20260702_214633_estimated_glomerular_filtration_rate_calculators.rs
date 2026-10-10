use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "estimated_glomerular_filtration_rate_calculators",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                (
                    "equation",
                    ColType::StringWithDefault("ckd-epi-2021-creatinine".to_string()),
                ),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("serum_creatinine_umol_l", ColType::DoubleNull),
                ("age_years", ColType::IntegerNull),
                ("sex", ColType::StringWithDefault(String::new())),
                ("specimen_date", ColType::DateNull),
                ("steady_state", ColType::StringWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE estimated_glomerular_filtration_rate_calculators ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "estimated_glomerular_filtration_rate_calculators").await
    }
}
