use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "united_kingdom_statement_of_fitness_for_work_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("rule_set", ColType::StringWithDefault(String::new())),
                ("severity", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                (
                    "united_kingdom_statement_of_fitness_for_work_grade_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "united_kingdom_statement_of_fitness_for_work_grade",
                "united_kingdom_statement_of_fitness_for_work_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE united_kingdom_statement_of_fitness_for_work_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(
            m,
            "united_kingdom_statement_of_fitness_for_work_grade_rules",
        )
        .await
    }
}
