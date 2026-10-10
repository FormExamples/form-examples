use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "diabetes_eye_screening_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "worst_retinopathy",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "worst_maculopathy",
                    ColType::StringWithDefault(String::new()),
                ),
                ("any_ungradable", ColType::StringWithDefault(String::new())),
                ("outcome", ColType::StringWithDefault(String::new())),
                ("referral", ColType::StringWithDefault(String::new())),
                ("recall_interval_months", ColType::IntegerNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("diabetes_eye_screening_id", ColType::Uuid),
            ],
            &[("diabetes_eye_screening", "diabetes_eye_screening_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE diabetes_eye_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetes_eye_screening_grades").await
    }
}
