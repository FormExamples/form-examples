use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "pregnancy_ultrasound_test_request_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("appropriateness_score", ColType::IntegerNull),
                (
                    "appropriateness_band",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "gestational_age_window_fit",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "recommended_scan_type",
                    ColType::StringWithDefault(String::new()),
                ),
                ("completeness_percent", ColType::IntegerNull),
                ("triage_tier", ColType::StringWithDefault(String::new())),
                (
                    "target_timeframe",
                    ColType::StringWithDefault(String::new()),
                ),
                ("recommendation", ColType::StringWithDefault(String::new())),
                ("clinician_notes", ColType::TextWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("pregnancy_ultrasound_test_request_id", ColType::Uuid),
            ],
            &[(
                "pregnancy_ultrasound_test_request",
                "pregnancy_ultrasound_test_request_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE pregnancy_ultrasound_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pregnancy_ultrasound_test_request_grades").await
    }
}
