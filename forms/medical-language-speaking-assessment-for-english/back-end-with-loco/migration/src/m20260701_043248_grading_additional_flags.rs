use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "grading_additional_flags",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("flag_id", ColType::String),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                ("priority", ColType::StringWithDefault("medium".to_string())),
                ("grade_id", ColType::Uuid),
            ],
            &[("grade", "grade_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE grading_additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grading_additional_flags").await
    }
}
