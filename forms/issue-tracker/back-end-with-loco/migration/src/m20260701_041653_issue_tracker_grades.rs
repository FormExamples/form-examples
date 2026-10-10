use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "issue_tracker_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("score_by_priority_rank", ColType::IntegerNull),
                ("score_by_severity_of_impact", ColType::IntegerNull),
                ("score_by_magnitude_of_damage", ColType::IntegerNull),
                ("score_by_harm_grade", ColType::IntegerNull),
                (
                    "score_by_failure_condition",
                    ColType::StringWithDefault(String::new()),
                ),
                ("score_by_moscow_requirement", ColType::IntegerNull),
                ("score_by_frequency_percent", ColType::DoubleNull),
                (
                    "computed_composite_priority",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "final_composite_priority",
                    ColType::StringWithDefault(String::new()),
                ),
                ("override_reason", ColType::StringWithDefault(String::new())),
                ("recommendation", ColType::StringWithDefault(String::new())),
                ("triage_notes", ColType::TextWithDefault(String::new())),
                ("signed_by", ColType::StringWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("issue_tracker_id", ColType::Uuid),
            ],
            &[("issue_tracker", "issue_tracker_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE issue_tracker_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "issue_tracker_grades").await
    }
}
