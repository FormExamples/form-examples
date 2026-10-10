use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "diabetes_podiatry_assessment_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("right_foot_risk", ColType::StringWithDefault(String::new())),
                ("left_foot_risk", ColType::StringWithDefault(String::new())),
                ("overall_risk", ColType::StringWithDefault(String::new())),
                ("review_pathway", ColType::StringWithDefault(String::new())),
                ("referral", ColType::StringWithDefault(String::new())),
                ("review_interval_months", ColType::IntegerNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("diabetes_podiatry_assessment_id", ColType::Uuid),
            ],
            &[(
                "diabetes_podiatry_assessment",
                "diabetes_podiatry_assessment_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE diabetes_podiatry_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetes_podiatry_assessment_grades").await
    }
}
