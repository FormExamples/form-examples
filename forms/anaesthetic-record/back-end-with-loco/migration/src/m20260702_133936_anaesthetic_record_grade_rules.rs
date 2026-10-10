use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anaesthetic_record_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("category", ColType::StringWithDefault(String::new())),
                ("criticality", ColType::StringWithDefault(String::new())),
                ("satisfied", ColType::BooleanWithDefault(false)),
                ("description", ColType::StringWithDefault(String::new())),
                ("anaesthetic_record_grade_id", ColType::Uuid),
            ],
            &[("anaesthetic_record_grade", "anaesthetic_record_grade_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE anaesthetic_record_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_record_grade_rules").await
    }
}
