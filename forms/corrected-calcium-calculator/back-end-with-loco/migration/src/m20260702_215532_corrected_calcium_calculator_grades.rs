use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "corrected_calcium_calculator_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("corrected_calcium_mmol_l", ColType::DoubleNull),
                ("classification", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("corrected_calcium_calculator_id", ColType::Uuid),
            ],
            &[(
                "corrected_calcium_calculator",
                "corrected_calcium_calculator_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE corrected_calcium_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "corrected_calcium_calculator_grades").await
    }
}
