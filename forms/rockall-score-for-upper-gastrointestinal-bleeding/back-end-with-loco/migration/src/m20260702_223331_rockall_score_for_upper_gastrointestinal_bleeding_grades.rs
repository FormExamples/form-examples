use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "rockall_score_for_upper_gastrointestinal_bleeding_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("age_points", ColType::IntegerNull),
                ("shock_points", ColType::IntegerNull),
                ("comorbidity_points", ColType::IntegerNull),
                ("clinical_score", ColType::IntegerNull),
                ("diagnosis_points", ColType::IntegerNull),
                ("stigmata_points", ColType::IntegerNull),
                ("full_score", ColType::IntegerNull),
                ("risk_band", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "rockall_score_for_upper_gastrointestinal_bleeding_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "rockall_score_for_upper_gastrointestinal_bleeding",
                "rockall_score_for_upper_gastrointestinal_bleeding_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE rockall_score_for_upper_gastrointestinal_bleeding_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(
            m,
            "rockall_score_for_upper_gastrointestinal_bleeding_grades",
        )
        .await
    }
}
