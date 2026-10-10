use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "pre_operative_assessment_by_clinician_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "computed_asa_grade",
                    ColType::StringWithDefault(String::new()),
                ),
                ("final_asa_grade", ColType::StringWithDefault(String::new())),
                (
                    "asa_emergency_suffix",
                    ColType::StringWithDefault(String::new()),
                ),
                ("override_reason", ColType::StringWithDefault(String::new())),
                (
                    "mallampati_class",
                    ColType::StringWithDefault(String::new()),
                ),
                ("rcri_score", ColType::IntegerNull),
                ("stopbang_score", ColType::IntegerNull),
                ("frailty_scale", ColType::IntegerNull),
                ("composite_risk", ColType::StringWithDefault(String::new())),
                ("recommendation", ColType::StringWithDefault(String::new())),
                ("clinician_notes", ColType::TextWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("pre_operative_assessment_by_clinician_id", ColType::Uuid),
            ],
            &[(
                "pre_operative_assessment_by_clinician",
                "pre_operative_assessment_by_clinician_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE pre_operative_assessment_by_clinician_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pre_operative_assessment_by_clinician_grades").await
    }
}
