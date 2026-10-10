use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "zarit_burden_interview_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("total_score", ColType::IntegerNull),
                ("max_score", ColType::IntegerNull),
                ("burden_band", ColType::StringWithDefault(String::new())),
                ("short_form_score", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("zarit_burden_interview_id", ColType::Uuid),
            ],
            &[("zarit_burden_interview", "zarit_burden_interview_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE zarit_burden_interview_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "zarit_burden_interview_grades").await
    }
}
