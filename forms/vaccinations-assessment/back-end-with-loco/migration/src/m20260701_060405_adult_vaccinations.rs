use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "adult_vaccinations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("td_ipv_booster", ColType::IntegerNull),
                ("hpv", ColType::IntegerNull),
                ("meningitis_acwy", ColType::IntegerNull),
                ("influenza_annual", ColType::IntegerNull),
                ("covid19", ColType::IntegerNull),
                ("shingles", ColType::IntegerNull),
                ("pneumococcal_ppv", ColType::IntegerNull),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE adult_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "adult_vaccinations").await
    }
}
