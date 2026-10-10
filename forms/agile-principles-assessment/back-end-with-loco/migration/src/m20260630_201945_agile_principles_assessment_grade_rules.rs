use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "agile_principles_assessment_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("principle_number", ColType::Integer),
                ("band", ColType::StringWithDefault(String::new())),
                ("principle_slug", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                ("agile_principles_assessment_grade_id", ColType::Uuid),
            ],
            &[(
                "agile_principles_assessment_grade",
                "agile_principles_assessment_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE agile_principles_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_principles_assessment_grade_rules").await
    }
}
