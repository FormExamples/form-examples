use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "agile_principles_assessment_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("answered_count", ColType::IntegerWithDefault(0)),
                ("mean_score", ColType::DoubleNull),
                ("weighted_mean_score", ColType::DoubleNull),
                ("weights_customised", ColType::BooleanWithDefault(false)),
                ("maturity", ColType::StringWithDefault(String::new())),
                ("top_action_1", ColType::StringWithDefault(String::new())),
                ("top_action_2", ColType::StringWithDefault(String::new())),
                ("top_action_3", ColType::StringWithDefault(String::new())),
                ("coach_notes", ColType::TextWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("agile_principles_assessment_id", ColType::Uuid),
            ],
            &[(
                "agile_principles_assessment",
                "agile_principles_assessment_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE agile_principles_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_principles_assessment_grades").await
    }
}
