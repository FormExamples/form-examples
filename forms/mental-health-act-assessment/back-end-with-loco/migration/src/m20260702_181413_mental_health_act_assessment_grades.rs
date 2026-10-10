use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "mental_health_act_assessment_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "completeness_status",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "recommended_section_class",
                    ColType::StringWithDefault(String::new()),
                ),
                ("urgency", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("mental_health_act_assessment_id", ColType::Uuid),
            ],
            &[(
                "mental_health_act_assessment",
                "mental_health_act_assessment_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE mental_health_act_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mental_health_act_assessment_grades").await
    }
}
