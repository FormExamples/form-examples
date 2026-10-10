use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "uk_nhs_digital_technology_assessment_criteria_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("section", ColType::String),
                ("criterion_id", ColType::String),
                ("status", ColType::StringWithDefault(String::new())),
                ("mandatory", ColType::BooleanWithDefault(true)),
                ("description", ColType::StringWithDefault(String::new())),
                ("grade_id", ColType::Uuid),
            ],
            &[(
                "uk_nhs_digital_technology_assessment_criteria_grade",
                "grade_id",
            )],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE uk_nhs_digital_technology_assessment_criteria_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(
            m,
            "uk_nhs_digital_technology_assessment_criteria_grade_rules",
        )
        .await
    }
}
