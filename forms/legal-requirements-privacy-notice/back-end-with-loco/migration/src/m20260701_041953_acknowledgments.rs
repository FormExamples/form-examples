use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "acknowledgments",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("confirmed", ColType::BooleanWithDefault(false)),
                ("full_name", ColType::TextWithDefault(String::new())),
                ("acknowledged_date", ColType::DateNull),
                ("patient_id", ColType::Uuid),
            ],
            &[("patient", "patient_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE acknowledgments ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "acknowledgments").await
    }
}
