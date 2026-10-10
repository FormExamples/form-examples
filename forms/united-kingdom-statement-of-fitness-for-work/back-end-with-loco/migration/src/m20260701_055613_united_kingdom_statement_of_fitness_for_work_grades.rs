use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "united_kingdom_statement_of_fitness_for_work_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "fitness_category",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "adaptation_intensity",
                    ColType::StringWithDefault(String::new()),
                ),
                ("adaptation_count", ColType::IntegerWithDefault(0)),
                ("period_days", ColType::IntegerNull),
                (
                    "period_compliance",
                    ColType::StringWithDefault(String::new()),
                ),
                ("recommendation", ColType::StringWithDefault(String::new())),
                (
                    "is_within_first_six_months_of_condition",
                    ColType::StringWithDefault(String::new()),
                ),
                ("is_valid", ColType::StringWithDefault(String::new())),
                ("grader_notes", ColType::TextWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "clinician_override",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "clinician_override_reason",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "clinician_final_recommendation",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "united_kingdom_statement_of_fitness_for_work_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "united_kingdom_statement_of_fitness_for_work",
                "united_kingdom_statement_of_fitness_for_work_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE united_kingdom_statement_of_fitness_for_work_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "united_kingdom_statement_of_fitness_for_work_grades").await
    }
}
