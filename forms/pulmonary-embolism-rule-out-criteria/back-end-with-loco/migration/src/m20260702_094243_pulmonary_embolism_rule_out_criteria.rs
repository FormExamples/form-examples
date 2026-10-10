use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "pulmonary_embolism_rule_out_criteria",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                (
                    "presenting_complaint",
                    ColType::TextWithDefault(String::new()),
                ),
                ("age", ColType::DoubleNull),
                ("heart_rate", ColType::DoubleNull),
                ("oxygen_saturation", ColType::DoubleNull),
                (
                    "pretest_probability",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age_under_50", ColType::StringWithDefault(String::new())),
                (
                    "heart_rate_under_100",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "spo2_at_least_95",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "no_unilateral_leg_swelling",
                    ColType::StringWithDefault(String::new()),
                ),
                ("no_haemoptysis", ColType::StringWithDefault(String::new())),
                (
                    "no_recent_surgery_trauma",
                    ColType::StringWithDefault(String::new()),
                ),
                ("no_prior_dvt_pe", ColType::StringWithDefault(String::new())),
                (
                    "no_oestrogen_use",
                    ColType::StringWithDefault(String::new()),
                ),
                ("clinical_notes", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE pulmonary_embolism_rule_out_criteria ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pulmonary_embolism_rule_out_criteria").await
    }
}
