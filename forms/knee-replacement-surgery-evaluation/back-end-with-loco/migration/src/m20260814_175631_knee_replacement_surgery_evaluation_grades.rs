use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "knee_replacement_surgery_evaluation_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("oks_total", ColType::IntegerNull),
                (
                    "computed_oks_category",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "final_oks_category",
                    ColType::StringWithDefault(String::new()),
                ),
                ("max_kellgren_lawrence_grade", ColType::IntegerNull),
                (
                    "computed_candidacy",
                    ColType::StringWithDefault(String::new()),
                ),
                ("final_candidacy", ColType::StringWithDefault(String::new())),
                ("override_reason", ColType::StringWithDefault(String::new())),
                ("clinician_notes", ColType::TextWithDefault(String::new())),
                ("signed_by_name", ColType::StringWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("knee_replacement_surgery_evaluation_id", ColType::Uuid),
            ],
            &[(
                "knee_replacement_surgery_evaluation",
                "knee_replacement_surgery_evaluation_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE knee_replacement_surgery_evaluation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "knee_replacement_surgery_evaluation_grades").await
    }
}
