use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "rockall_score_for_upper_gastrointestinal_bleeding_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("parameter", ColType::String),
                ("points", ColType::IntegerNull),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                (
                    "rockall_score_for_upper_gastrointestinal_bleeding_grade_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "rockall_score_for_upper_gastrointestinal_bleeding_grade",
                "rockall_score_for_upper_gastrointestinal_bleeding_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE rockall_score_for_upper_gastrointestinal_bleeding_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(
            m,
            "rockall_score_for_upper_gastrointestinal_bleeding_grade_rules",
        )
        .await
    }
}
