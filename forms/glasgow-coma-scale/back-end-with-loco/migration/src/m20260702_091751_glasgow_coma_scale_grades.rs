use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "glasgow_coma_scale_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("eye_score", ColType::IntegerNull),
                ("verbal_score", ColType::IntegerNull),
                ("motor_score", ColType::IntegerNull),
                ("total_score", ColType::IntegerNull),
                ("breakdown", ColType::StringWithDefault(String::new())),
                ("total_display", ColType::StringWithDefault(String::new())),
                ("severity_band", ColType::StringWithDefault(String::new())),
                ("pupil_reactivity_score", ColType::IntegerNull),
                ("gcs_p", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("glasgow_coma_scale_id", ColType::Uuid),
            ],
            &[("glasgow_coma_scale", "glasgow_coma_scale_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE glasgow_coma_scale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "glasgow_coma_scale_grades").await
    }
}
