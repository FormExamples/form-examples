use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "visit_informations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("visit_date", ColType::DateNull),
                ("department", ColType::TextWithDefault(String::new())),
                ("provider_name", ColType::TextWithDefault(String::new())),
                ("visit_type", ColType::TextWithDefault(String::new())),
                ("reason_for_visit", ColType::TextWithDefault(String::new())),
                ("first_visit", ColType::TextWithDefault(String::new())),
                ("encounter_satisfaction_id", ColType::Uuid),
            ],
            &[("encounter_satisfaction", "encounter_satisfaction_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE visit_informations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "visit_informations").await
    }
}
