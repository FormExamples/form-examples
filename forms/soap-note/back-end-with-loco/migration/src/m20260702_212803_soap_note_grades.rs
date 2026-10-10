use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "soap_note_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("completeness_percent", ColType::IntegerNull),
                (
                    "subjective_present",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "objective_present",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "assessment_present",
                    ColType::StringWithDefault(String::new()),
                ),
                ("plan_present", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("soap_note_id", ColType::Uuid),
            ],
            &[("soap_note", "soap_note_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE soap_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "soap_note_grades").await
    }
}
