use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "childhood_vaccinations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("dtap_ipv_hib_hepb", ColType::IntegerNull),
                ("pneumococcal", ColType::IntegerNull),
                ("rotavirus", ColType::IntegerNull),
                ("meningitis_b", ColType::IntegerNull),
                ("mmr", ColType::IntegerNull),
                ("hib_menc", ColType::IntegerNull),
                ("preschool_booster", ColType::IntegerNull),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE childhood_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "childhood_vaccinations").await
    }
}
