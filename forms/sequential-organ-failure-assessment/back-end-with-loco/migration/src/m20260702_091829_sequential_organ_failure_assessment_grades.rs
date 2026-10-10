use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "sequential_organ_failure_assessment_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("respiration_score", ColType::IntegerNull),
                ("coagulation_score", ColType::IntegerNull),
                ("liver_score", ColType::IntegerNull),
                ("cardiovascular_score", ColType::IntegerNull),
                ("cns_score", ColType::IntegerNull),
                ("renal_score", ColType::IntegerNull),
                ("total_score", ColType::IntegerNull),
                ("delta_sofa", ColType::IntegerNull),
                ("mortality_band", ColType::StringWithDefault(String::new())),
                ("sepsis3", ColType::BooleanWithDefault(false)),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("sequential_organ_failure_assessment_id", ColType::Uuid),
            ],
            &[(
                "sequential_organ_failure_assessment",
                "sequential_organ_failure_assessment_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE sequential_organ_failure_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "sequential_organ_failure_assessment_grades").await
    }
}
