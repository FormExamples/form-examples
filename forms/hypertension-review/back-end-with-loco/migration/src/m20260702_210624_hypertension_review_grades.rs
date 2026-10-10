use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "hypertension_review_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("control_status", ColType::StringWithDefault(String::new())),
                (
                    "hypertension_stage",
                    ColType::StringWithDefault(String::new()),
                ),
                ("review_status", ColType::StringWithDefault(String::new())),
                ("primary_source", ColType::StringWithDefault(String::new())),
                ("target_group", ColType::StringWithDefault(String::new())),
                ("clinic_target_systolic", ColType::IntegerNull),
                ("clinic_target_diastolic", ColType::IntegerNull),
                ("home_target_systolic", ColType::IntegerNull),
                ("home_target_diastolic", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("hypertension_review_id", ColType::Uuid),
            ],
            &[("hypertension_review", "hypertension_review_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE hypertension_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hypertension_review_grades").await
    }
}
