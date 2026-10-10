use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "travel_vaccinations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("travel_planned", ColType::StringWithDefault(String::new())),
                (
                    "travel_destination",
                    ColType::StringWithDefault(String::new()),
                ),
                ("hepatitis_a", ColType::IntegerNull),
                ("hepatitis_b", ColType::IntegerNull),
                ("typhoid", ColType::IntegerNull),
                ("yellow_fever", ColType::IntegerNull),
                ("rabies", ColType::IntegerNull),
                ("japanese_encephalitis", ColType::IntegerNull),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE travel_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "travel_vaccinations").await
    }
}
