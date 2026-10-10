use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "chronic_kidney_disease_review_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("gfr_category", ColType::StringWithDefault(String::new())),
                (
                    "albuminuria_category",
                    ColType::StringWithDefault(String::new()),
                ),
                ("kdigo_risk_zone", ColType::StringWithDefault(String::new())),
                ("review_status", ColType::StringWithDefault(String::new())),
                ("blood_pressure_target_systolic", ColType::IntegerNull),
                ("blood_pressure_target_diastolic", ColType::IntegerNull),
                ("blood_pressure_at_target", ColType::BooleanNull),
                ("completeness_score", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("chronic_kidney_disease_review_id", ColType::Uuid),
            ],
            &[(
                "chronic_kidney_disease_review",
                "chronic_kidney_disease_review_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE chronic_kidney_disease_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "chronic_kidney_disease_review_grades").await
    }
}
