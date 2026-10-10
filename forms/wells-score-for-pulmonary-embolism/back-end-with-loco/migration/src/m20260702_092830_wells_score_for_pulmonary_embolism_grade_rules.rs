use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "wells_score_for_pulmonary_embolism_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("instrument", ColType::String),
                ("points", ColType::DoubleWithDefault(0.0)),
                ("band", ColType::StringWithDefault(String::new())),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                ("wells_score_for_pulmonary_embolism_grade_id", ColType::Uuid),
            ],
            &[(
                "wells_score_for_pulmonary_embolism_grade",
                "wells_score_for_pulmonary_embolism_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE wells_score_for_pulmonary_embolism_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "wells_score_for_pulmonary_embolism_grade_rules").await
    }
}
