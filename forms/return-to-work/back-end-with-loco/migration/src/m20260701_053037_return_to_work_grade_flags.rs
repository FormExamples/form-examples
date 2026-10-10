use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "return_to_work_grade_flags",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("flag_code", ColType::StringWithDefault(String::new())),
                ("flag_title", ColType::StringWithDefault(String::new())),
                ("flag_category", ColType::StringWithDefault(String::new())),
                ("flag_priority", ColType::StringWithDefault(String::new())),
                ("flag_evidence", ColType::TextWithDefault(String::new())),
                (
                    "flag_recommendation",
                    ColType::TextWithDefault(String::new()),
                ),
                ("return_to_work_grade_id", ColType::Uuid),
            ],
            &[("return_to_work_grade", "return_to_work_grade_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE return_to_work_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_work_grade_flags").await
    }
}
