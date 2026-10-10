use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "columbia_suicide_severity_rating_scale_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("ideation_level", ColType::IntegerNull),
                ("any_behaviour", ColType::StringWithDefault(String::new())),
                (
                    "recent_behaviour",
                    ColType::StringWithDefault(String::new()),
                ),
                ("risk_tier", ColType::StringWithDefault(String::new())),
                ("positive_features", ColType::TextWithDefault(String::new())),
                (
                    "management_recommendation",
                    ColType::TextWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("columbia_suicide_severity_rating_scale_id", ColType::Uuid),
            ],
            &[(
                "columbia_suicide_severity_rating_scale",
                "columbia_suicide_severity_rating_scale_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE columbia_suicide_severity_rating_scale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "columbia_suicide_severity_rating_scale_grades").await
    }
}
