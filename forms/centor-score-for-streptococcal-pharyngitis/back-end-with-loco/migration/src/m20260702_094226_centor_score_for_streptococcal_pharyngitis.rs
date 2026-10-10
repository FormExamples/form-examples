use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "centor_score_for_streptococcal_pharyngitis",
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
                ("age_years", ColType::IntegerNull),
                ("sex", ColType::StringWithDefault(String::new())),
                (
                    "tonsillar_exudate",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "tender_anterior_cervical_nodes",
                    ColType::StringWithDefault(String::new()),
                ),
                ("fever_over_38", ColType::StringWithDefault(String::new())),
                ("measured_temperature_celsius", ColType::DoubleNull),
                (
                    "absence_of_cough",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "stridor_or_breathing_difficulty",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "drooling_or_cannot_swallow",
                    ColType::StringWithDefault(String::new()),
                ),
                ("trismus", ColType::StringWithDefault(String::new())),
                ("muffled_voice", ColType::StringWithDefault(String::new())),
                (
                    "unilateral_neck_swelling",
                    ColType::StringWithDefault(String::new()),
                ),
                ("clinical_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE centor_score_for_streptococcal_pharyngitis ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "centor_score_for_streptococcal_pharyngitis").await
    }
}
