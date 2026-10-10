use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "caprini_venous_thromboembolism_risk_assessment_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("factor", ColType::StringWithDefault(String::new())),
                ("weight_group", ColType::StringWithDefault(String::new())),
                ("points", ColType::IntegerNull),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                (
                    "caprini_venous_thromboembolism_risk_assessment_grade_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "caprini_venous_thromboembolism_risk_assessment_grade",
                "caprini_venous_thromboembolism_risk_assessment_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE caprini_venous_thromboembolism_risk_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(
            m,
            "caprini_venous_thromboembolism_risk_assessment_grade_rules",
        )
        .await
    }
}
