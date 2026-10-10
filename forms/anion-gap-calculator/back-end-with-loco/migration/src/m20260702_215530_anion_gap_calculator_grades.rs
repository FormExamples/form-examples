use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anion_gap_calculator_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("anion_gap", ColType::DoubleNull),
                ("corrected_anion_gap", ColType::DoubleNull),
                ("classification", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("anion_gap_calculator_id", ColType::Uuid),
            ],
            &[("anion_gap_calculator", "anion_gap_calculator_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE anion_gap_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anion_gap_calculator_grades").await
    }
}
