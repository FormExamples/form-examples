use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "ottawa_knee_rule_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("instrument", ColType::String),
                ("criterion", ColType::StringWithDefault(String::new())),
                ("fired", ColType::BooleanWithDefault(false)),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                ("ottawa_knee_rule_grade_id", ColType::Uuid),
            ],
            &[("ottawa_knee_rule_grade", "ottawa_knee_rule_grade_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE ottawa_knee_rule_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ottawa_knee_rule_grade_rules").await
    }
}
