use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "mental_state_examination_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("risk_level", ColType::StringWithDefault(String::new())),
                ("completeness_percent", ColType::IntegerNull),
                (
                    "appearance_behaviour_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "speech_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "emotion_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "perception_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "thought_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "insight_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "cognition_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("mental_state_examination_id", ColType::Uuid),
            ],
            &[("mental_state_examination", "mental_state_examination_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE mental_state_examination_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mental_state_examination_grades").await
    }
}
