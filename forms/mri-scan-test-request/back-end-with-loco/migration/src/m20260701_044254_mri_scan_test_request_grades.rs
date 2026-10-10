use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "mri_scan_test_request_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("appropriateness_score", ColType::IntegerNull),
                (
                    "appropriateness_band",
                    ColType::StringWithDefault(String::new()),
                ),
                ("mri_safety_band", ColType::StringWithDefault(String::new())),
                (
                    "contrast_renal_flag",
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
                ("mri_scan_test_request_id", ColType::Uuid),
            ],
            &[("mri_scan_test_request", "mri_scan_test_request_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE mri_scan_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mri_scan_test_request_grades").await
    }
}
