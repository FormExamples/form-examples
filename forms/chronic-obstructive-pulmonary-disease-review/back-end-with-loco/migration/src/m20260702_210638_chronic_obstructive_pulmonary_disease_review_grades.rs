use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "chronic_obstructive_pulmonary_disease_review_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "gold_airflow_grade",
                    ColType::StringWithDefault(String::new()),
                ),
                ("symptom_burden", ColType::StringWithDefault(String::new())),
                (
                    "exacerbation_risk",
                    ColType::StringWithDefault(String::new()),
                ),
                ("abe_group", ColType::StringWithDefault(String::new())),
                ("review_status", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "chronic_obstructive_pulmonary_disease_review_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "chronic_obstructive_pulmonary_disease_review",
                "chronic_obstructive_pulmonary_disease_review_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE chronic_obstructive_pulmonary_disease_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "chronic_obstructive_pulmonary_disease_review_grades").await
    }
}
