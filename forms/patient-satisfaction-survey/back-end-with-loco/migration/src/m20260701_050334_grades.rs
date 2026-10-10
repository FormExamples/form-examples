use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("normalized_score", ColType::DoubleWithDefault(0.0)),
                (
                    "satisfaction_category",
                    ColType::StringWithDefault(String::new()),
                ),
                ("domain_access_score", ColType::DoubleNull),
                ("domain_communication_score", ColType::DoubleNull),
                ("domain_clinical_care_score", ColType::DoubleNull),
                ("domain_staff_score", ColType::DoubleNull),
                ("domain_environment_score", ColType::DoubleNull),
                ("domain_discharge_score", ColType::DoubleNull),
                ("domain_overall_score", ColType::DoubleNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
