use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "cataract_diagnostic_evaluation_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "computed_locs_iii_severity_right",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "computed_locs_iii_severity_left",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "computed_surgical_candidacy",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "final_surgical_candidacy",
                    ColType::StringWithDefault(String::new()),
                ),
                ("override_reason", ColType::StringWithDefault(String::new())),
                ("functional_impact_score", ColType::IntegerNull),
                ("clinician_notes", ColType::TextWithDefault(String::new())),
                ("signed_by_name", ColType::StringWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("cataract_diagnostic_evaluation_id", ColType::Uuid),
            ],
            &[(
                "cataract_diagnostic_evaluation",
                "cataract_diagnostic_evaluation_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE cataract_diagnostic_evaluation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cataract_diagnostic_evaluation_grades").await
    }
}
