use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "ottawa_knee_rule_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("xray_indicated", ColType::StringWithDefault(String::new())),
                ("decision", ColType::StringWithDefault(String::new())),
                (
                    "recommended_action",
                    ColType::TextWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("ottawa_knee_rule_id", ColType::Uuid),
            ],
            &[("ottawa_knee_rule", "ottawa_knee_rule_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE ottawa_knee_rule_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ottawa_knee_rule_grades").await
    }
}
