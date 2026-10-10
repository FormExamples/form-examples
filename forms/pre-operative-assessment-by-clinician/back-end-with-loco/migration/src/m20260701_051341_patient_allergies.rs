use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "patient_allergies",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("patient_id", ColType::Uuid),
                ("allergy_id", ColType::Uuid),
            ],
            &[("patient", "patient_id"), ("allergy", "allergy_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE patient_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_allergies").await
    }
}
