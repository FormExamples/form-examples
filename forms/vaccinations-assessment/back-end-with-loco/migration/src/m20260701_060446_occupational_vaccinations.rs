use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "occupational_vaccinations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("occupation", ColType::StringWithDefault(String::new())),
                (
                    "healthcare_worker",
                    ColType::StringWithDefault(String::new()),
                ),
                ("hepatitis_b_occupational", ColType::IntegerNull),
                ("influenza_occupational", ColType::IntegerNull),
                ("varicella", ColType::IntegerNull),
                ("bcg_tuberculosis", ColType::IntegerNull),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE occupational_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "occupational_vaccinations").await
    }
}
