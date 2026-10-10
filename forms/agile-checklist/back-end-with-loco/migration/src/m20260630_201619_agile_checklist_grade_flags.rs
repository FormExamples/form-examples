use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "agile_checklist_grade_flags",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("flag_id", ColType::String),
                ("category", ColType::StringWithDefault(String::new())),
                ("priority", ColType::StringWithDefault("medium".to_string())),
                ("section", ColType::StringWithDefault(String::new())),
                (
                    "triggering_items",
                    ColType::StringWithDefault(String::new()),
                ),
                ("description", ColType::StringWithDefault(String::new())),
                (
                    "suggested_action",
                    ColType::StringWithDefault(String::new()),
                ),
                ("agile_checklist_grade_id", ColType::Uuid),
            ],
            &[("agile_checklist_grade", "agile_checklist_grade_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE agile_checklist_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_checklist_grade_flags").await
    }
}
